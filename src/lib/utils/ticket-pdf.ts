import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

export interface TicketPdfOptions {
    bookingNumber: string;
    eventTitle: string;
    eventDate: string; // formatted
    eventVenue: string;
    attendeeName: string;
    items: { name: string; quantity: number }[];
    qrData: string; // data encoded in QR
    pageSize?: 'A4' | 'A5' | 'Letter';
    orientation?: 'portrait' | 'landscape';
}

export async function generateTicketPdf(
    opts: TicketPdfOptions,
): Promise<Buffer> {
    const qrPngBuffer = await QRCode.toBuffer(opts.qrData, {
        type: 'png',
        margin: 1,
        width: 240,
    });
    const doc = new PDFDocument({
        size: opts.pageSize || 'A4',
        layout: opts.orientation || 'portrait',
    });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    const done = new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks as any)));
    });

    // Header
    doc.fillColor('#2563eb')
        .fontSize(24)
        .text('EventHive Ticket', { align: 'center' })
        .moveDown();

    doc.fontSize(16)
        .fillColor('black')
        .text(opts.eventTitle, { align: 'center' })
        .moveDown();

    // QR + summary
    const startY = doc.y;
    const qrX = 50;
    const detailsX = 320;
    doc.image(qrPngBuffer, qrX, startY, { width: 220 });

    doc.fontSize(12)
        .text(`Booking #: ${opts.bookingNumber}`, detailsX, startY)
        .moveDown(0.5)
        .text(`Attendee: ${opts.attendeeName}`)
        .moveDown(0.5)
        .text(`Date: ${opts.eventDate}`)
        .moveDown(0.5)
        .text(`Venue: ${opts.eventVenue}`)
        .moveDown();

    doc.moveDown(2);
    doc.fontSize(14).text('Tickets', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    opts.items.forEach((i) => {
        doc.text(`• ${i.name} x ${i.quantity}`);
    });

    doc.moveDown(2);
    doc.fontSize(10)
        .fillColor('#555')
        .text(
            'Please bring a valid photo ID. QR code is required for entry. Non-transferable unless allowed by event policy.',
            { align: 'left' },
        );

    doc.end();
    return done;
}
