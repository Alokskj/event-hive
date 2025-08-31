import { useQuery } from '@tanstack/react-query';
import { EventService } from '../services/event.service';
import EventCard from '../components/EventCard';
import { Input } from '@/components/ui/input';
import { useState, useMemo, useEffect } from 'react';
import {
    EVENT_CATEGORIES,
    PaginatedEvents,
    Event as EventType,
} from '../types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useDebounce } from '@/hooks/useDebounce';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    X,
    Layers,
    Filter,
    Map as MapIcon,
    List as ListIcon,
} from 'lucide-react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Tooltip,
    useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geocodeBatch } from '../lib/geocode';

const ExploreEventsPage = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [category, setCategory] = useState<string | undefined>();
    const [city, setCity] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [page, setPage] = useState(0);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const limit = 10;

    const filters = useMemo(
        () => ({
            search: debouncedSearch || undefined,
            category: category || undefined,
            city: city || undefined,
            isFeatured: isFeatured || undefined,
            isPublic: isPublic || undefined,
            page,
            limit,
        }),
        [debouncedSearch, category, city, isFeatured, isPublic, page],
    );

    const { data, isLoading, refetch, isFetching } = useQuery<PaginatedEvents>({
        queryKey: ['events', filters],
        queryFn: () => EventService.list(filters),
    });

    const total = data?.meta?.total ?? data?.data?.length ?? 0;
    const totalPages = total ? Math.ceil(total / limit) : 1;

    const activeChips: { label: string; onRemove: () => void; key: string }[] =
        [];
    if (category)
        activeChips.push({
            label: category,
            onRemove: () => setCategory(undefined),
            key: 'category',
        });
    if (city)
        activeChips.push({
            label: city,
            onRemove: () => setCity(''),
            key: 'city',
        });
    if (isFeatured)
        activeChips.push({
            label: 'Featured',
            onRemove: () => setIsFeatured(false),
            key: 'featured',
        });
    if (!isPublic)
        activeChips.push({
            label: 'Private',
            onRemove: () => setIsPublic(true),
            key: 'public',
        });

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Explore Events
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Find and book experiences that match your interests.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex-1 md:w-80">
                        <Input
                            placeholder="Search events, e.g. hackathon"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-24 space-y-6">
                        <div className="rounded-xl border bg-muted/20 dark:bg-muted/5 p-5 space-y-6">
                            <FilterFields
                                category={category}
                                setCategory={(v) => {
                                    setCategory(v);
                                    setPage(0);
                                }}
                                city={city}
                                setCity={(v) => {
                                    setCity(v);
                                    setPage(0);
                                }}
                                isFeatured={isFeatured}
                                setIsFeatured={(v) => {
                                    setIsFeatured(v);
                                    setPage(0);
                                }}
                                isPublic={isPublic}
                                setIsPublic={(v) => {
                                    setIsPublic(v);
                                    setPage(0);
                                }}
                            />
                        </div>
                        {activeChips.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {activeChips.map((chip) => (
                                    <Badge
                                        key={chip.key}
                                        variant="outline"
                                        className="pr-1 pl-2 gap-1 group"
                                    >
                                        <Layers className="size-3 opacity-50" />
                                        {chip.label}
                                        <button
                                            onClick={chip.onRemove}
                                            className="p-0.5 rounded hover:bg-destructive/10"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
                <div className="xl:col-span-9 space-y-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs text-muted-foreground">
                                {data?.meta?.total || 0} result(s)
                            </p>
                            <div className="inline-flex rounded-md border bg-muted/40 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 ${viewMode === 'list' ? 'bg-background shadow' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <ListIcon className="size-3" /> List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('map')}
                                    className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 ${viewMode === 'map' ? 'bg-background shadow' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <MapIcon className="size-3" /> Map
                                </button>
                            </div>
                        </div>
                        {viewMode === 'list' && (
                            <>
                                {isLoading && (
                                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {Array.from({ length: 6 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="animate-pulse h-56 rounded-xl bg-muted/40"
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {data?.data?.map((ev: EventType) => (
                                        <EventCard key={ev.id} event={ev} />
                                    ))}
                                </div>
                                {!isLoading && !data?.data?.length && (
                                    <div className="text-center py-20 space-y-4">
                                        <div className="mx-auto size-16 rounded-full bg-muted/40 flex items-center justify-center">
                                            <Filter className="size-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            No events found. Adjust your filters
                                            or try a different search.
                                        </p>
                                    </div>
                                )}
                                {totalPages > 0 && (
                                    <Pagination className="pt-2">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPage((p) =>
                                                            Math.max(0, p - 1),
                                                        );
                                                    }}
                                                />
                                            </PaginationItem>
                                            {Array.from({ length: totalPages })
                                                .slice(0, 5)
                                                .map((_, idx) => {
                                                    const displayPage = idx + 1;
                                                    return (
                                                        <PaginationItem
                                                            key={displayPage}
                                                        >
                                                            <PaginationLink
                                                                href="#"
                                                                isActive={
                                                                    displayPage -
                                                                        1 ===
                                                                    page
                                                                }
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    setPage(
                                                                        displayPage -
                                                                            1,
                                                                    );
                                                                }}
                                                            >
                                                                {displayPage}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                })}
                                            {totalPages > 5 && (
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        ...
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )}
                                            <PaginationItem >
                                                <PaginationNext
                                                    
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPage((p) =>
                                                            Math.min(
                                                                totalPages - 1,
                                                                p + 1,
                                                            ),
                                                        );
                                                    }}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                )}
                            </>
                        )}
                        {viewMode === 'map' && (
                            <div className="h-[70vh] rounded-xl overflow-hidden border">
                                <EventsMap
                                    events={data?.data || []}
                                    loading={isLoading || isFetching}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ExploreEventsPage;

interface EventsMapProps {
    events: EventType[];
    loading: boolean;
}
const markerIcon = (color: string) =>
    new L.DivIcon({
        className: 'event-marker',
        html: `<div class="pin" style="--pin-color:${color}"><svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0Z" fill="${color}"/><circle cx="14" cy="14" r="6" fill="white"/></svg></div>`,
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -36],
    });

const CATEGORY_COLORS: Record<string, string> = {
    WORKSHOP: '#6366F1',
    CONCERT: '#EF4444',
    SPORTS: '#10B981',
    HACKATHON: '#0EA5E9',
    CONFERENCE: '#F59E0B',
    NETWORKING: '#8B5CF6',
    EXHIBITION: '#EC4899',
    CULTURAL: '#84CC16',
    EDUCATIONAL: '#06B6D4',
    ENTERTAINMENT: '#F472B6',
};
function EventsMap({ events, loading }: EventsMapProps) {
    const [geoEnhanced, setGeoEnhanced] = useState<EventType[]>(events);
    const [pendingGeocode, setPendingGeocode] = useState(false);

    // When events change, attempt geocode for those missing coordinates
    useEffect(() => {
        // Always reset to fresh events set first so stale markers vanish immediately
        setGeoEnhanced(events);
        const need = events.filter(
            (e) => !e.latitude && !e.longitude && !e.isOnline,
        );
        if (!need.length) {
            setPendingGeocode(false);
            return;
        }
        setPendingGeocode(true);
        geocodeBatch(
            need.map((e) => ({
                city: e.city,
                state: (e as any).state,
                country: (e as any).country,
            })),
            (query, result) => {
                if (!result) return;
                setGeoEnhanced((prev) =>
                    prev.map((ev) =>
                        ev.city === query.city &&
                        (ev as any).state === query.state &&
                        (ev as any).country === query.country &&
                        !ev.latitude &&
                        !ev.longitude
                            ? {
                                  ...ev,
                                  latitude: result.lat,
                                  longitude: result.lon,
                              }
                            : ev,
                    ),
                );
            },
        ).finally(() => setPendingGeocode(false));
    }, [events]);

    const positions = geoEnhanced.filter(
        (e) => e.latitude && e.longitude,
    ) as Required<Pick<EventType, 'latitude' | 'longitude'>>[] as any;
    const center = positions.length
        ? [positions[0].latitude!, positions[0].longitude!]
        : [20.5937, 78.9629];
    let bounds: L.LatLngBoundsExpression | undefined;
    if (positions.length > 1) {
        const lats = positions.map((p: any) => p.latitude!);
        const lngs = positions.map((p: any) => p.longitude!);
        bounds = [
            [Math.min(...lats), Math.min(...lngs)],
            [Math.max(...lats), Math.max(...lngs)],
        ] as any;
    }

    return (
        <MapContainer
            key={events.map((e) => e.id).join(',')}
            center={center as any}
            bounds={bounds}
            zoom={5}
            className="w-full h-full"
            scrollWheelZoom
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AutoFit
                positions={positions.map(
                    (p: any) => [p.latitude!, p.longitude!] as [number, number],
                )}
            />
            <MapLegend events={geoEnhanced} pending={pendingGeocode} />
            {!loading &&
                positions.map((ev: EventType) => {
                    const color = CATEGORY_COLORS[ev.category] || '#6366F1';
                    return (
                        <Marker
                            key={ev.id}
                            position={[ev.latitude!, ev.longitude!] as any}
                            icon={markerIcon(color)}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, -10]}
                                className="event-pin-tooltip"
                                opacity={1}
                            >
                                <div className="text-xs space-y-1">
                                    <p className="font-medium leading-tight max-w-[180px] truncate">
                                        {ev.title}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {new Date(
                                            ev.startDateTime,
                                        ).toLocaleDateString()}{' '}
                                        • {ev.city}
                                    </p>
                                </div>
                            </Tooltip>
                            <Popup className="event-pin-popup">
                                <div className="space-y-3 min-w-[200px]">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-sm leading-snug">
                                            {ev.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(
                                                ev.startDateTime,
                                            ).toLocaleString()}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground/80">
                                            {ev.venue ? ev.venue + ', ' : ''}
                                            {ev.city}
                                        </p>
                                    </div>
                                    {ev.tickets?.length ? (
                                        <div className="flex flex-wrap gap-1">
                                            {ev.tickets.slice(0, 3).map((t) => (
                                                <span
                                                    key={t.id}
                                                    className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium"
                                                >
                                                    {t.name}
                                                    {t.price !== '0'
                                                        ? ` ₹${t.price}`
                                                        : ''}
                                                </span>
                                            ))}
                                            {ev.tickets.length > 3 && (
                                                <span className="text-[10px] text-muted-foreground">
                                                    +{ev.tickets.length - 3}{' '}
                                                    more
                                                </span>
                                            )}
                                        </div>
                                    ) : null}
                                    <a
                                        href={`/events/${ev.id}`}
                                        className="text-xs font-medium inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        View details
                                        <span aria-hidden>→</span>
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
        </MapContainer>
    );
}

interface MapLegendProps {
    events: EventType[];
    pending: boolean;
}
function MapLegend({ events, pending }: MapLegendProps) {
    const map = useMap(); // ensure re-render when map exists
    const counts = events.reduce<Record<string, number>>((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + 1;
        return acc;
    }, {});
    return (
        <div className="absolute top-2 left-2 z-[1000] max-w-[260px]">
            <div className="rounded-lg border bg-background/90 backdrop-blur px-3 py-2 shadow-md space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-medium">Map Legend</p>
                    {pending && (
                        <span className="text-[10px] text-muted-foreground animate-pulse">
                            geocoding…
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(counts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 8)
                        .map(([cat, count]) => (
                            <span
                                key={cat}
                                className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 bg-muted/40 text-[10px]"
                            >
                                <span
                                    className="size-2 rounded-sm"
                                    style={{
                                        background:
                                            CATEGORY_COLORS[cat] || '#6366F1',
                                    }}
                                />
                                {cat}
                                <span className="opacity-60">({count})</span>
                            </span>
                        ))}
                </div>
                <div className="text-[10px] text-muted-foreground/70">
                    Showing{' '}
                    {events.filter((e) => e.latitude && e.longitude).length} /{' '}
                    {events.length} plotted events.
                </div>
            </div>
        </div>
    );
}

// Adjust map view when marker positions change
function AutoFit({ positions }: { positions: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (!positions.length) return;
        if (positions.length === 1) {
            map.setView(positions[0], 10, { animate: true });
        } else {
            const b = L.latLngBounds(
                positions.map((p) => L.latLng(p[0], p[1])),
            );
            map.fitBounds(b, { padding: [30, 30] });
        }
    }, [positions, map]);
    return null;
}

interface FilterFieldsProps {
    category: string | undefined;
    setCategory: (v: string | undefined) => void;
    city: string;
    setCity: (v: string) => void;
    isFeatured: boolean;
    setIsFeatured: (v: boolean) => void;
    isPublic: boolean;
    setIsPublic: (v: boolean) => void;
}

const FilterFields = ({
    category,
    setCategory,
    city,
    setCity,
    isFeatured,
    setIsFeatured,
    isPublic,
    setIsPublic,
}: FilterFieldsProps) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Category
                </label>
                <Select
                    value={category ?? 'ALL'}
                    onValueChange={(v) => {
                        if (v === 'ALL') setCategory(undefined);
                        else setCategory(v);
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        {EVENT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    City
                </label>
                <Input
                    placeholder="Any"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-3">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Flags
                </label>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="featured-flag"
                        checked={isFeatured}
                        onCheckedChange={(v) => setIsFeatured(!!v)}
                    />
                    <label htmlFor="featured-flag" className="text-sm">
                        Featured
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="public-flag"
                        checked={isPublic}
                        onCheckedChange={(v) => setIsPublic(!!v)}
                    />
                    <label htmlFor="public-flag" className="text-sm">
                        Public
                    </label>
                </div>
            </div>
        </div>
    );
};
