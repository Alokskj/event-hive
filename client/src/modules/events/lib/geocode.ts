export interface GeocodeInput {
    city: string;
    state?: string;
    country?: string;
}
export interface GeocodeResult {
    lat: number;
    lon: number;
}

const LS_KEY = 'eventhive_geocode_cache_v1';

function loadCache(): Record<string, GeocodeResult> {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    } catch {
        return {};
    }
}
function saveCache(cache: Record<string, GeocodeResult>) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(cache));
    } catch {
        console.error('Failed to save geocode cache');
    }
}

let inMemoryCache: Record<string, GeocodeResult> | null = null;

export async function geocodeLocation(
    input: GeocodeInput,
): Promise<GeocodeResult | null> {
    if (!inMemoryCache) inMemoryCache = loadCache();
    const q = [input.city, input.state, input.country]
        .filter(Boolean)
        .join(', ');
    if (!q) return null;
    if (inMemoryCache[q]) return inMemoryCache[q];
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.lat && data[0]?.lon) {
            const result: GeocodeResult = {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
            };
            inMemoryCache[q] = result;
            saveCache(inMemoryCache);
            return result;
        }
    } catch {
        // swallow
    }
    return null;
}

// Batch helper (sequential to stay friendly)
export async function geocodeBatch(
    inputs: GeocodeInput[],
    onResult: (query: GeocodeInput, r: GeocodeResult | null) => void,
) {
    for (const inp of inputs) {
        const r = await geocodeLocation(inp);
        onResult(inp, r);
        // small delay to be nice to API
        await new Promise((r) => setTimeout(r, 400));
    }
}
