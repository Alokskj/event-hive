---
applyTo: '**'
---

## 🏙 *EventHive*

---

## User Roles

### *Attendee (User)*

* Discover events via search, filters, and map view.
* Register and book tickets securely.
* Receive tickets via Email/WhatsApp and download from dashboard.
* Manage bookings: view, cancel, and claim refunds as per policies.
* Earn loyalty points and referral rewards.
* Receive notifications, reminders, and event updates.

### *Organizer (Admin/Event Manager)*

* Create, edit, and publish events.
* Manage ticket inventory, pricing, discounts, and promotional codes.
* Track bookings and revenue in real time.
* Export attendee lists and check-in reports.
* Manage roles (Admin, Event Manager, Volunteer).
* Monitor check-ins using QR/Barcode scanners.
* Generate analytics reports and insights.
* Handle refund workflows and attendee communication.

---


### 🎯 *Purpose*

EventHive helps event organizers manage the full lifecycle of events (creation → ticketing → check-in → analytics), and lets attendees discover and join events seamlessly. The platform supports multiple ticket types, integrated payments, QR/Barcode ticketing, automated reminders, and dashboards for organizers and attendees.

---

## 🚀 Features

### 1. Event Creation & Publishing
- Create events with details: *title, description, date, time, location, and category* (workshop, concert, sports, hackathon, etc.).
- Add ticket types (*General, VIP, Student, Early Bird*).
- Define ticket attributes:
  - Price  
  - Sale start date  
  - Sale end date  
  - Maximum ticket quantity  
- Save as draft or publish for public visibility.

---

### 2. Event Discovery & Search
- Browse and search events by *category, date, location, and price*.  
- Filters for *sport type, venue type, rating, trending events*, and pagination.  
- “*Featured/Trending*” section for highlighted events.  

---

### 3. Registration & Booking
- Attendees select the event and ticket type.  
- Multiple ticket booking with per-user limits.  
- Secure attendee registration (*name, email, phone, etc.*).  
- Integrated payment gateway (*UPI, cards, net banking, wallets*).  
- Transaction confirmation with *unique booking ID*.  

---

### 4. Ticket Delivery
- Auto-generated ticket with *QR code/Barcode*.  
- Delivery via:
  - *Email* (PDF ticket with event details)  
  - *WhatsApp* (instant shareable ticket link)  
- Option to download ticket from *user dashboard*.  

---

### 5. Notifications & Reminders
- Booking confirmation via *Email/WhatsApp*.  
- Automated reminders:  
  - *24 hours before the event*  
  - *1 hour before the event*  
- SMS/Push notification integration.  

---

### 6. Organizer Dashboard
- Manage *events, ticket inventory, and bookings*.  
- Real-time *sales analytics and revenue tracking*.  
- Export attendee list to *CSV/Excel*.  
- Role-based access (*Admin, Event Manager, Volunteer*).  

---

### 7. Attendee Dashboard
- View *My Tickets* and booking history.  
- Option to cancel booking (*with refund policy*).  
- Loyalty points & rewards for repeat participation.  

---

### 8. Discounts & Promotions
- Create *promo codes and coupons*.  
- *Early bird discounts*.  
- *Group booking offers* (e.g., “Buy 5, Get 1 Free”).  
- Referral rewards for inviting friends.  

---

### 9. Event Check-In System
- *QR/Barcode scanning* for seamless entry.  
- Real-time validation to *prevent duplicate entries*.  
- Live check-in stats on the *Organizer Dashboard*.  

---

### 10. Analytics & Reports
- *Total tickets sold, revenue earned, active attendees*.  
- Demographics insights (*location, ticket category*).  
- Downloadable detailed reports.  

---

### 11. Advanced Features
- *Refund & Cancellation Workflow* with organizer policies.  
- *Social Media Sharing* (WhatsApp, Instagram, Twitter, Facebook).  
- *Live Streaming Support* for hybrid events.  
- *Map Mode* – Show all events as pins on a map.  

---




### Tech Stack

* Backend:
    * Node.js with Express
    * PostgreSQL with Prisma ORM
    * controllers, services, and routes for modularity
    * zod for validation
    * passport for authentication
    * multer for file uploads
    * s3 for image storage
    * bcrypt for password hashing
    * jsonwebtoken for user authentication

### Design Principles
* Follow RESTful API design principles
* Follow Solid principles for code organization
* Use of TypeScript for type safety
* Modular architecture with clear separation of concerns
* Use of controllers, services, and routes for maintainability
* Use of zod for input validation in controllers


