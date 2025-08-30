import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useWebFileUpload } from '@/modules/file-upload/hooks/useFileUpload';
import {
    CreateEventInput,
    Event,
    EVENT_CATEGORIES,
    EventStatus,
} from '../types';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import * as React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Props {
    initial?: Partial<Event>;
    onSubmit: (data: CreateEventInput) => any;
    loading?: boolean;
    onChange?: (data: CreateEventInput) => void; // live draft updates
}

export const EventForm = ({ initial, onSubmit, loading, onChange }: Props) => {
    const now = new Date();
    const later = new Date(Date.now() + 3600000);
    const [form, setForm] = useState<CreateEventInput>({
        title: initial?.title || '',
        description: initial?.description || '',
        shortDescription: initial?.shortDescription || '',
        category: (initial as any)?.category || 'WORKSHOP',
        status: 'DRAFT',
        tags: initial?.tags || [],
        startDateTime: initial?.startDateTime || now.toISOString(),
        endDateTime: initial?.endDateTime || later.toISOString(),
        timezone:
            (initial as any)?.timezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
        venue: (initial as any)?.venue || '',
        address: (initial as any)?.address || '',
        city: (initial as any)?.city || '',
        state: (initial as any)?.state || '',
        country: (initial as any)?.country || '',
        latitude: (initial as any)?.latitude,
        longitude: (initial as any)?.longitude,
        isOnline: (initial as any)?.isOnline || false,
        onlineLink: (initial as any)?.onlineLink || undefined,
        bannerImage: (initial as any)?.bannerImage,
        galleryImages: (initial as any)?.galleryImages || [],
        maxAttendees: (initial as any)?.maxAttendees,
        isPublic: initial?.isPublic ?? true,
        isFeatured: initial?.isFeatured ?? false,
        allowWaitlist: (initial as any)?.allowWaitlist || false,
        contactEmail: (initial as any)?.contactEmail || '',
        contactPhone: (initial as any)?.contactPhone || '',
    });

    const { mutateAsync: upload, isPending: uploading } = useWebFileUpload({
        onSuccess: (d) => updateForm({ bannerImage: d.fileUrl }),
    });

    // unified updater so we always emit changes
    const updateForm = (
        patch:
            | Partial<CreateEventInput>
            | ((prev: CreateEventInput) => Partial<CreateEventInput>),
    ) => {
        setForm((prev) => {
            const resolvedPatch =
                typeof patch === 'function' ? patch(prev) : patch;
            const next = { ...prev, ...resolvedPatch } as CreateEventInput;
            onChange?.(next);
            return next;
        });
    };

    // emit initial once for preview consumers
    useEffect(() => {
        onChange?.(form);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        updateForm({ [name]: value } as any);
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await upload({ file });
    };

    const validate = () => {
        if (new Date(form.endDateTime) <= new Date(form.startDateTime)) {
            toast.error('End time must be after start time');
            return false;
        }
        const required: (keyof CreateEventInput)[] = [
            'title',
            'description',
            'category',
            'venue',
            'address',
            'city',
            'state',
            'country',
            'contactEmail',
            'contactPhone',
        ];
        for (const key of required) {
            if (
                !form[key] ||
                (typeof form[key] === 'string' && !(form[key] as string).trim())
            ) {
                toast.error(`Missing ${key}`);
                return false;
            }
        }
        return true;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const payload: CreateEventInput = {
            ...form,
            startDateTime: new Date(form.startDateTime).toISOString(),
            endDateTime: new Date(form.endDateTime).toISOString(),
            tags: Array.isArray(form.tags)
                ? form.tags
                : String(form.tags || '')
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
            latitude: form.latitude ? Number(form.latitude) : undefined,
            longitude: form.longitude ? Number(form.longitude) : undefined,
        };
        onSubmit(payload);
    };

    interface DateTimePickerProps {
        value: string; // ISO
        onChange: (iso: string) => void;
        required?: boolean;
        minISO?: string;
    }

    const DateTimePicker: React.FC<DateTimePickerProps> = ({
        value,
        onChange,
        required,
        minISO,
    }) => {
        const date = new Date(value);
        const [open, setOpen] = useState(false);
        const selectedDate = new Date(date);
        const hours = selectedDate.getHours();
        const minutes = selectedDate.getMinutes();

        const setDatePart = (d: Date) => {
            const combined = new Date(d);
            combined.setHours(hours, minutes, 0, 0);
            onChange(combined.toISOString());
        };
        const setTimePart = (h: number, m: number) => {
            const newDate = new Date(selectedDate);
            newDate.setHours(h, m, 0, 0);
            onChange(newDate.toISOString());
        };

        const hourOptions = Array.from({ length: 24 }, (_, i) => i);
        const minuteOptions = [0, 15, 30, 45];

        const isBeforeMin = (d: Date) =>
            minISO ? d < new Date(minISO) : false;

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="justify-start font-normal w-full"
                        aria-required={required}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? (
                            selectedDate.toLocaleString()
                        ) : (
                            <span>Pick date & time</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 space-y-3" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => d && setDatePart(d)}
                        disabled={(d) => isBeforeMin(d)}
                        initialFocus
                    />
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <select
                            className="border rounded px-2 py-1 text-sm bg-background"
                            value={hours}
                            onChange={(e) =>
                                setTimePart(Number(e.target.value), minutes)
                            }
                        >
                            {hourOptions.map((h) => (
                                <option key={h} value={h}>
                                    {h.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        :
                        <select
                            className="border rounded px-2 py-1 text-sm bg-background"
                            value={
                                minuteOptions.includes(minutes) ? minutes : 0
                            }
                            onChange={(e) =>
                                setTimePart(hours, Number(e.target.value))
                            }
                        >
                            {minuteOptions.map((m) => (
                                <option key={m} value={m}>
                                    {m.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Done
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <form onSubmit={submit} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Core details visible to attendees. Keep it concise and
                        compelling.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <Label>Title</Label>
                            <Input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. React Performance Workshop"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Category</Label>
                            <Select
                                name="category"
                                value={form.category}
                                onValueChange={(value) =>
                                    updateForm({ category: value as any })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EVENT_CATEGORIES.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-3 flex flex-col gap-2">
                            <Label>
                                Short Description{' '}
                                <span className="text-muted-foreground text-[10px]">
                                    (≤200 chars)
                                </span>
                            </Label>
                            <Input
                                name="shortDescription"
                                value={form.shortDescription || ''}
                                onChange={handleChange}
                                maxLength={200}
                                placeholder="One-liner that appears in listings"
                            />
                        </div>
                        <div className="md:col-span-3 flex flex-col gap-2">
                            <Label>Description</Label>
                            <Textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Full event details, agenda, what to expect..."
                            />
                        </div>
                        <div className="md:col-span-3 flex flex-col gap-2">
                            <Label>Tags (comma separated)</Label>
                            <Input
                                name="tags"
                                value={
                                    Array.isArray(form.tags)
                                        ? form.tags.join(',')
                                        : (form.tags as any)
                                }
                                onChange={handleChange}
                                placeholder="react, performance, web"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>
                        Set accurate times; attendees will get reminders
                        automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label>Start</Label>
                            <DateTimePicker
                                value={form.startDateTime}
                                onChange={(iso) =>
                                    updateForm({ startDateTime: iso })
                                }
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>End</Label>
                            <DateTimePicker
                                value={form.endDateTime}
                                onChange={(iso) =>
                                    updateForm({ endDateTime: iso })
                                }
                                required
                                minISO={form.startDateTime}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>
                                Max Attendees{' '}
                                <span className="text-[10px] text-muted-foreground">
                                    (optional)
                                </span>
                            </Label>
                            <Input
                                type="number"
                                name="maxAttendees"
                                value={form.maxAttendees || ''}
                                onChange={(e) =>
                                    updateForm(() => ({
                                        maxAttendees: e.target.value
                                            ? Number(e.target.value)
                                            : undefined,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Location</CardTitle>
                    <CardDescription>
                        Specify venue or mark it as an online event.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label>Venue</Label>
                            <Input
                                name="venue"
                                value={form.venue}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <Label>Address</Label>
                            <Input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>City</Label>
                            <Input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>State</Label>
                            <Input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Country</Label>
                            <Input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6 col-span-3">
                            <Switch
                                checked={form.isOnline || false}
                                onCheckedChange={(v) =>
                                    updateForm({ isOnline: v })
                                }
                            />
                            <Label>Online Event</Label>
                        </div>
                        {form.isOnline && (
                            <div className="md:col-span-3 flex flex-col gap-2">
                                <Label>Online Link (URL)</Label>
                                <Input
                                    name="onlineLink"
                                    value={form.onlineLink || ''}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        )}
                    </div>
                    <details className="group border rounded-lg p-4 bg-muted/30">
                        <summary className="cursor-pointer font-medium text-sm flex items-center justify-between">
                            Advanced Geolocation
                            <span className="text-xs text-muted-foreground group-open:hidden">
                                (optional)
                            </span>
                        </summary>
                        <Separator className="my-4" />
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label>Latitude</Label>
                                <Input
                                    name="latitude"
                                    type="number"
                                    value={form.latitude ?? ''}
                                    onChange={(e) =>
                                        updateForm(() => ({
                                            latitude: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Longitude</Label>
                                <Input
                                    name="longitude"
                                    type="number"
                                    value={form.longitude ?? ''}
                                    onChange={(e) =>
                                        updateForm(() => ({
                                            longitude: e.target.value
                                                ? Number(e.target.value)
                                                : undefined,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </details>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact & Visibility</CardTitle>
                    <CardDescription>
                        How attendees reach you and how the event is listed.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-5 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label>Contact Email</Label>
                            <Input
                                name="contactEmail"
                                type="email"
                                value={form.contactEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Contact Phone</Label>
                            <Input
                                name="contactPhone"
                                value={form.contactPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <Switch
                                checked={form.isPublic}
                                onCheckedChange={(v) =>
                                    updateForm({ isPublic: v })
                                }
                            />
                            <Label>Public</Label>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <Switch
                                checked={form.isFeatured}
                                onCheckedChange={(v) =>
                                    updateForm({ isFeatured: v })
                                }
                            />
                            <Label>Featured</Label>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <Switch
                                checked={form.allowWaitlist || false}
                                onCheckedChange={(v) =>
                                    updateForm({ allowWaitlist: v })
                                }
                            />
                            <Label>Allow Waitlist</Label>
                        </div>
                        {initial?.status && (
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label>Status</Label>
                                <Select
                                    name="status"
                                    defaultValue={(initial as any).status}
                                    onValueChange={(value: EventStatus) =>
                                        updateForm({ status: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            'DRAFT',
                                            'PUBLISHED',
                                            'CANCELLED',
                                            'COMPLETED',
                                        ].map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>
                        High-quality images improve conversion.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Banner Image</Label>
                        {form.bannerImage && (
                            <img
                                src={form.bannerImage}
                                className="h-40 w-full object-cover rounded border"
                            />
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFile}
                            disabled={uploading}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="h-4" />
            <div className="sticky bottom-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t py-4 flex items-center gap-3">
                <Button type="submit" disabled={loading} className="min-w-32">
                    {loading ? 'Saving...' : 'Save Event'}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                        initial ? updateForm(initial as any) : updateForm({})
                    }
                    disabled={loading}
                >
                    Reset
                </Button>
            </div>
        </form>
    );
};

export default EventForm;
