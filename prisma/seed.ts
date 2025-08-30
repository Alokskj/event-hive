// Prisma seed script for Event Hive
// Populates: Users, Events, EventRoles, Tickets, Bookings (with items & payments), Reviews, Analytics, Loyalty Transactions

import { PrismaClient, UserRole, EventCategory, EventStatus, TicketType, BookingStatus, PaymentMethod, PaymentStatus, EventRoleType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PASSWORD = 'Password123!';

async function hash(password: string) {
	return bcrypt.hash(password, 10); // keep in sync with HASH_SALT_ROUNDS
}

async function clear() {
	// Order matters due to FK constraints
	await prisma.checkIn.deleteMany();
	await prisma.notification.deleteMany();
	await prisma.payment.deleteMany();
	await prisma.bookingItem.deleteMany();
	await prisma.booking.deleteMany();
	await prisma.review.deleteMany();
	await prisma.ticket.deleteMany();
	await prisma.eventRole.deleteMany();
	await prisma.eventAnalytics.deleteMany();
	await prisma.loyaltyTransaction.deleteMany();
	await prisma.event.deleteMany();
	await prisma.auditLog.deleteMany();
	await prisma.user.deleteMany();
}

async function main() {
	console.log('Seeding database...');
	await clear();

	// Users
	const [admin, organizer, manager, attendee1, attendee2] = await Promise.all([
		prisma.user.create({ data: { email: 'admin@example.com', password: await hash(PASSWORD), firstName: 'Admin', lastName: 'User', role: UserRole.ADMIN, isVerified: true } }),
		prisma.user.create({ data: { email: 'organizer@example.com', password: await hash(PASSWORD), firstName: 'Olivia', lastName: 'Organizer', role: UserRole.USER, isVerified: true } }),
		prisma.user.create({ data: { email: 'manager@example.com', password: await hash(PASSWORD), firstName: 'Mark', lastName: 'Manager', role: UserRole.USER, isVerified: true } }),
		prisma.user.create({ data: { email: 'attendee1@example.com', password: await hash(PASSWORD), firstName: 'Alice', lastName: 'Attendee', role: UserRole.USER, isVerified: true } }),
		prisma.user.create({ data: { email: 'attendee2@example.com', password: await hash(PASSWORD), firstName: 'Bob', lastName: 'Attendee', role: UserRole.USER, isVerified: true } }),
	]);

	const now = new Date();
	const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
	const inFiveDaysEnd = new Date(inFiveDays.getTime() + 3 * 60 * 60 * 1000);
	const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
	const nextMonthEnd = new Date(nextMonth.getTime() + 8 * 60 * 60 * 1000);

	// Events
	const event1 = await prisma.event.create({
		data: {
			title: 'Full Stack TypeScript Workshop',
			description: 'Hands-on workshop covering modern full stack TypeScript development with Node.js, Prisma, and React.',
			shortDescription: 'Hands-on Full Stack TS',
			category: EventCategory.WORKSHOP,
			status: EventStatus.PUBLISHED,
			startDateTime: inFiveDays,
			endDateTime: inFiveDaysEnd,
			venue: 'Innovation Hub',
			address: '123 Tech Park',
			city: 'Bengaluru',
			state: 'KA',
			country: 'India',
			contactEmail: 'organizer@example.com',
			contactPhone: '+91-9999999999',
			isPublic: true,
			isFeatured: true,
			publishedAt: new Date(),
			tags: ['typescript','workshop','prisma'],
		},
	});

	const event2 = await prisma.event.create({
		data: {
			title: 'Summer Music Festival',
			description: 'A day-long outdoor concert featuring multiple indie bands and food trucks.',
			shortDescription: 'Outdoor music fest',
			category: EventCategory.CONCERT,
			status: EventStatus.PUBLISHED,
			startDateTime: nextMonth,
			endDateTime: nextMonthEnd,
			venue: 'City Arena',
			address: '456 Central Ave',
			city: 'Mumbai',
			state: 'MH',
			country: 'India',
			contactEmail: 'organizer@example.com',
			contactPhone: '+91-9999999999',
			isPublic: true,
			isFeatured: false,
			publishedAt: new Date(),
			tags: ['music','festival','live'],
		},
	});

	// Event Roles
	await prisma.eventRole.createMany({ data: [
		{ userId: organizer.id, eventId: event1.id, role: EventRoleType.ORGANIZER },
		{ userId: manager.id, eventId: event1.id, role: EventRoleType.MANAGER },
		{ userId: organizer.id, eventId: event2.id, role: EventRoleType.ORGANIZER },
	]});

	// Tickets for event1
	const saleStart = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
	const saleEnd = new Date(inFiveDays.getTime() - 12 * 60 * 60 * 1000);
	const ticketsEvent1 = await prisma.$transaction([
		prisma.ticket.create({ data: { eventId: event1.id, name: 'General Admission', type: TicketType.GENERAL, price: 499, quantity: 100, saleStartDate: saleStart, saleEndDate: saleEnd, description: 'Standard seat', maxPerUser: 5 } }),
		prisma.ticket.create({ data: { eventId: event1.id, name: 'Early Bird', type: TicketType.EARLY_BIRD, price: 349, quantity: 30, saleStartDate: saleStart, saleEndDate: new Date(inFiveDays.getTime() - 3 * 24 * 60 * 60 * 1000), description: 'Discounted early access', maxPerUser: 2 } }),
		prisma.ticket.create({ data: { eventId: event1.id, name: 'VIP', type: TicketType.VIP, price: 1299, quantity: 15, saleStartDate: saleStart, saleEndDate: saleEnd, description: 'Front row + swag', maxPerUser: 2 } }),
	]);

	// Tickets for event2
	const saleStart2 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
	const saleEnd2 = new Date(nextMonth.getTime() - 24 * 60 * 60 * 1000);
	const ticketsEvent2 = await prisma.$transaction([
		prisma.ticket.create({ data: { eventId: event2.id, name: 'Festival Pass', type: TicketType.GENERAL, price: 999, quantity: 500, saleStartDate: saleStart2, saleEndDate: saleEnd2, description: 'All day access', maxPerUser: 6 } }),
		prisma.ticket.create({ data: { eventId: event2.id, name: 'VIP Backstage', type: TicketType.VIP, price: 2999, quantity: 50, saleStartDate: saleStart2, saleEndDate: saleEnd2, description: 'Backstage + meet & greet', maxPerUser: 2 } }),
		prisma.ticket.create({ data: { eventId: event2.id, name: 'Group Pack (5)', type: TicketType.GROUP, price: 4499, quantity: 100, saleStartDate: saleStart2, saleEndDate: saleEnd2, description: 'Pack of 5 passes', maxPerUser: 2 } }),
	]);

	// Create a booking for event1 (attendee1 buying 2 general + 1 VIP)
	const generalTicket = ticketsEvent1[0];
	const vipTicket = ticketsEvent1[2];
	const booking1Total = Number(generalTicket.price) * 2 + Number(vipTicket.price) * 1;
	const booking1 = await prisma.booking.create({
		data: {
			bookingNumber: 'BKG-1001',
			eventId: event1.id,
			userId: attendee1.id,
			attendeeName: 'Alice Attendee',
			attendeeEmail: 'attendee1@example.com',
			attendeePhone: '+91-8888888888',
			totalAmount: booking1Total,
			discountAmount: 0,
			finalAmount: booking1Total,
			quantity: 3,
			status: BookingStatus.CONFIRMED,
			confirmedAt: new Date(),
		},
	});

	await prisma.bookingItem.createMany({ data: [
		{ bookingId: booking1.id, ticketId: generalTicket.id, quantity: 2, unitPrice: generalTicket.price, totalPrice: Number(generalTicket.price) * 2 },
		{ bookingId: booking1.id, ticketId: vipTicket.id, quantity: 1, unitPrice: vipTicket.price, totalPrice: vipTicket.price },
	]});

	await prisma.payment.create({ data: { bookingId: booking1.id, amount: booking1.finalAmount, method: PaymentMethod.UPI, status: PaymentStatus.SUCCESS, paidAt: new Date() } });

	// Review for event1
	await prisma.review.create({ data: { eventId: event1.id, userId: attendee1.id, rating: 5, comment: 'Fantastic workshop content and delivery!' } });

	// Loyalty points for attendee1
	await prisma.loyaltyTransaction.create({ data: { userId: attendee1.id, points: 50, type: 'EARNED', description: 'Workshop booking', eventId: event1.id, bookingId: booking1.id } });

	// Simple analytics rows (today)
	const analyticsDate = new Date();
	analyticsDate.setUTCHours(0,0,0,0);
	await prisma.eventAnalytics.createMany({ data: [
		{ eventId: event1.id, date: analyticsDate, views: 120, uniqueViews: 90, bookings: 1, revenue: booking1.finalAmount, checkIns: 0 },
		{ eventId: event2.id, date: analyticsDate, views: 300, uniqueViews: 220, bookings: 0, revenue: 0, checkIns: 0 },
	]});

	console.log('Seed completed.');
	console.log('Login accounts:');
	console.log(' admin@example.com / ' + PASSWORD);
	console.log(' organizer@example.com / ' + PASSWORD);
	console.log(' manager@example.com / ' + PASSWORD);
	console.log(' attendee1@example.com / ' + PASSWORD);
	console.log(' attendee2@example.com / ' + PASSWORD);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

