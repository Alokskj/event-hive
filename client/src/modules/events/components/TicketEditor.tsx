import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CreateTicketInput, Ticket, UpdateTicketInput } from '../types';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
    Calendar as CalendarIcon,
    Pencil,
    Trash2,
    Plus,
    Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Props {
    eventId: string;
    tickets: Ticket[];
    onCreate: (t: CreateTicketInput) => Promise<any>;
    onUpdate?: (ticketId: string, data: UpdateTicketInput) => Promise<any>;
    onDelete?: (ticketId: string) => Promise<any>;
}

const TICKET_TYPES = [
    'GENERAL',
    'VIP',
    'STUDENT',
    'EARLY_BIRD',
    'GROUP',
    'PREMIUM',
] as const;

function formatLocal(iso: string) {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

export const TicketEditor = ({
    eventId,
    tickets,
    onCreate,
    onUpdate,
    onDelete,
}: Props) => {
    const defaultStart = new Date();
    const defaultEnd = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    const initialForm: CreateTicketInput = {
        eventId,
        name: 'General Admission',
        description: '',
        type: 'GENERAL',
        price: 0,
        quantity: 100,
        maxPerUser: 10,
        saleStartDate: defaultStart.toISOString(),
        saleEndDate: defaultEnd.toISOString(),
    };

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState<CreateTicketInput>(initialForm);

    const reset = () => {
        setForm(initialForm);
        setEditing(null);
    };

    const setField = (name: keyof CreateTicketInput, value: any) =>
        setForm((f) => ({ ...f, [name]: value }));

    const validate = (data: CreateTicketInput | UpdateTicketInput) => {
        if (!data.name) return 'Name required';
        if (data.price! < 0) return 'Price must be >= 0';
        if (data.quantity! <= 0) return 'Quantity must be > 0';
        if (data.maxPerUser! <= 0 || data.maxPerUser! > 100)
            return 'Max per user 1-100';
        if (new Date(data.saleEndDate!) <= new Date(data.saleStartDate!))
            return 'Sale end must be after start';
        return null;
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validate(form);
        if (err) {
            toast.error(err);
            return;
        }
        if (editing && onUpdate) {
            await onUpdate(editing, { ...form });
            toast.success('Ticket updated');
        } else {
            await onCreate(form);
            toast.success('Ticket created');
        }
        reset();
        setOpen(false);
    };

    const startEdit = (t: Ticket) => {
        setEditing(t.id);
        setForm({
            eventId: t.eventId,
            name: t.name,
            description: t.description || '',
            type: (t.type as any) || 'GENERAL',
            price: Number(t.price),
            quantity: t.quantity,
            maxPerUser: t.maxPerUser,
            saleStartDate: t.saleStartDate,
            saleEndDate: t.saleEndDate,
        });
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!onDelete) return;
        if (!confirm('Delete this ticket?')) return;
        await onDelete(id);
        toast.success('Ticket deleted');
    };

    // Reusable date picker inside editor
    const DateInput = ({
        value,
        onChange,
    }: {
        value: string;
        onChange: (iso: string) => void;
    }) => {
        const date = new Date(value);
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="justify-start font-normal w-full text-left overflow-hidden"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="truncate">{formatLocal(value)}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) =>
                            d && onChange(new Date(d).toISOString())
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base">Tickets</CardTitle>
                <Dialog
                    open={open}
                    onOpenChange={(o) => {
                        setOpen(o);
                        if (!o) reset();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            onClick={() => {
                                reset();
                                setOpen(true);
                            }}
                            className="gap-1"
                        >
                            <Plus className="h-4 w-4" /> Add
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editing ? 'Edit Ticket' : 'New Ticket'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="col-span-2 space-y-1">
                                    <Label htmlFor="ticket-name">Name</Label>
                                    <Input
                                        id="ticket-name"
                                        name="name"
                                        value={form.name}
                                        onChange={(e) =>
                                            setField('name', e.target.value)
                                        }
                                        required
                                        placeholder="e.g. VIP Pass"
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label htmlFor="ticket-description">
                                        Description{' '}
                                        <span className="text-[10px] text-muted-foreground">
                                            (optional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="ticket-description"
                                        name="description"
                                        value={form.description}
                                        onChange={(e) =>
                                            setField(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Access perks, seating info..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="ticket-type">Type</Label>
                                    <select
                                        id="ticket-type"
                                        name="type"
                                        value={form.type}
                                        onChange={(e) =>
                                            setField('type', e.target.value)
                                        }
                                        className="border rounded h-10 px-2 text-sm w-full bg-background"
                                    >
                                        {TICKET_TYPES.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="ticket-price">
                                        Price (₹)
                                    </Label>
                                    <Input
                                        id="ticket-price"
                                        name="price"
                                        type="number"
                                        min={0}
                                        value={form.price}
                                        onChange={(e) =>
                                            setField(
                                                'price',
                                                Number(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="ticket-quantity">
                                        Quantity
                                    </Label>
                                    <Input
                                        id="ticket-quantity"
                                        name="quantity"
                                        type="number"
                                        min={1}
                                        value={form.quantity}
                                        onChange={(e) =>
                                            setField(
                                                'quantity',
                                                Number(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="ticket-max-per-user">
                                        Max / User
                                    </Label>
                                    <Input
                                        id="ticket-max-per-user"
                                        name="maxPerUser"
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={form.maxPerUser}
                                        onChange={(e) =>
                                            setField(
                                                'maxPerUser',
                                                Number(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label>Sale Start</Label>
                                    <DateInput
                                        value={form.saleStartDate}
                                        onChange={(iso) =>
                                            setField('saleStartDate', iso)
                                        }
                                    />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label>Sale End</Label>
                                    <DateInput
                                        value={form.saleEndDate}
                                        onChange={(iso) =>
                                            setField('saleEndDate', iso)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="gap-1">
                                    <Save className="h-4 w-4" />{' '}
                                    {editing ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {tickets.map((t) => {
                        const remaining = t.quantity - t.soldQuantity;
                        return (
                            <div
                                key={t.id}
                                className="p-3 border rounded-md flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">
                                        {t.name}{' '}
                                        <span className="text-xs text-muted-foreground">
                                            ({t.type})
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        ₹{t.price} • {t.soldQuantity}/
                                        {t.quantity} sold • {remaining} left
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {formatLocal(t.saleStartDate)} →{' '}
                                        {formatLocal(t.saleEndDate)}
                                    </p>
                                </div>
                                <div className="flex gap-2 self-start md:self-center">
                                    {onUpdate && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => startEdit(t)}
                                            className="h-8 w-8"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(t.id)}
                                            className="h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {!tickets.length && (
                        <p className="text-sm text-muted-foreground">
                            No tickets yet.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
export default TicketEditor;
