import { toast } from 'sonner';

export interface TicketGenerationParams {
  booking: any; // shape with bookingNumber, attendeeName, status, quantity, finalAmount, eventId, createdAt, qrCode?
  event: any;   // shape with title, startDateTime
}

export async function generateAndDownloadTicket({ booking, event }: TicketGenerationParams) {
  if (!booking || !event) { toast.error('Ticket not ready'); return; }
  if (booking.status !== 'CONFIRMED') { toast.error('Ticket available after confirmation'); return; }
  try {
    const width = 800; const height = 480;
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,width,height);
    const grad = ctx.createLinearGradient(0,0,width,0);
    grad.addColorStop(0,'#4f46e5'); grad.addColorStop(1,'#7c3aed');
    ctx.fillStyle = grad; ctx.fillRect(0,0,260,height);
    ctx.fillStyle = '#fff';
    ctx.font = '600 26px system-ui, sans-serif';
    const title = event.title?.slice(0,40) + (event.title?.length>40?'…':'');
    ctx.fillText(title, 24, 60);
    ctx.font = '400 14px system-ui, sans-serif';
    ctx.fillText(new Date(event.startDateTime || booking.createdAt).toLocaleString(), 24, 92);
    ctx.setLineDash([6,8]); ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(260,0); ctx.lineTo(260,height); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#111';
    ctx.font = '600 22px system-ui'; ctx.fillText('e-Ticket', 290, 56);
    ctx.font = '400 15px system-ui';
    const line = (label: string, value: string, y: number) => { ctx.fillStyle = '#6b7280'; ctx.fillText(label, 290, y); ctx.fillStyle = '#111'; ctx.fillText(value, 440, y); };
    line('Booking #', booking.bookingNumber, 100);
    line('Attendee', booking.attendeeName, 130);
    line('Status', booking.status, 160);
    line('Quantity', String(booking.quantity), 190);
    line('Amount', '₹'+booking.finalAmount, 220);
    line('Event ID', booking.eventId, 250);
    const qr = new Image();
    const qrBase = booking.qrCode ? (booking.qrCode.startsWith && booking.qrCode.startsWith('data:image') ? booking.qrCode : `data:image/png;base64,${booking.qrCode}`) : '';
    const fallbackQR = () => { const c = document.createElement('canvas'); c.width = 140; c.height = 140; const cctx = c.getContext('2d')!; cctx.fillStyle = '#f3f4f6'; cctx.fillRect(0,0,140,140); cctx.fillStyle = '#374151'; cctx.font = 'bold 16px system-ui'; cctx.textAlign='center'; cctx.fillText('NO QR',70,75); return c.toDataURL('image/png'); };
    const qrData = qrBase || fallbackQR();
    qr.onload = () => {
      ctx.drawImage(qr, width-180, height-200, 140, 140);
      ctx.font = '400 11px system-ui'; ctx.fillStyle = '#374151'; ctx.fillText('Scan at entry', width-188, height-52);
      const link = document.createElement('a');
      link.download = `ticket-${booking.bookingNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Ticket downloaded');
    };
    qr.onerror = () => { toast.error('Failed to load QR'); };
    qr.src = qrData;
  } catch (e:any) { toast.error(e.message || 'Failed to generate ticket'); }
}
