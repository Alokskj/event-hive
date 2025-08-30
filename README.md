# 🏙️ CivicTrack — Civic Issue Reporting Platform

> Empowering citizens to report local issues, track their resolution, and engage with their community within a location-restricted neighborhood zone.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue.svg)](https://www.postgresql.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

CivicTrack is a comprehensive platform that enables citizens to easily report local civic issues like potholes, garbage, water leaks, and more. The platform restricts visibility to a 3-5 km neighborhood zone, ensuring users only see and interact with issues relevant to their immediate community.

### 👥 User Roles

- **Citizen/Reporter**: Report issues, view nearby problems, track resolution status
- **Moderator/Admin**: Review flagged reports, manage users, access analytics dashboard

## ✨ Features

### 📍 Location-Based Visibility
- Users can only see issues within a 3-5 km radius
- GPS-based location detection with manual override
- Zone-restricted interaction and browsing

### 📷 Quick Issue Reporting
- Simple issue reporting form with title, description, and photos
- Support for up to 3-5 photos per report
- Anonymous or verified reporting options
- Categorized issue types

### 📂 Issue Categories
- Roads (potholes, obstructions)
- Lighting (broken/flickering lights)
- Water Supply (leaks, low pressure)
- Cleanliness (overflowing bins, garbage)
- Public Safety (open manholes, exposed wiring)
- Obstructions (fallen trees, debris)

### 🔄 Status Tracking
- Real-time status updates (Reported → In Progress → Resolved)
- Status change logs with timestamps
- Push notifications for status updates

### 🗺️ Interactive Map
- Visual representation of issues as map pins
- Advanced filtering by status, category, and distance
- Distance filters: 1km, 3km, 5km radius

### 🧼 Moderation & Safety
- Community-driven flagging system
- Auto-hide reports with multiple flags
- Admin review and user management tools

### 📈 Analytics Dashboard
- Issue reporting statistics
- Category-wise breakdowns
- User management and flag review history

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with access and refresh tokens
- **File Storage**: AWS S3 with Multer
- **Security**: bcrypt for password hashing, Helmet for security headers
- **Validation**: Zod for input validation
- **Email**: Nodemailer for notifications

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: Shadcn UI components
- **Styling**: TailwindCSS (inferred from structure)
- **State Management**: React Query for server state
- **Client State Management**: Zustand

### Development & DevOps
- **Language**: TypeScript
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Git Hooks**: Husky with lint-staged
- **Containerization**: Docker with Docker Compose
- **Monitoring**: Winston for logging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v13 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [AWS Account](https://aws.amazon.com/) (for S3 file storage)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Alokskj/civictrack.git
cd civictrack
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Set up the database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npm run seed
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/civictrack"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
S3_BUCKET_NAME="your-s3-bucket-name"

# Email Configuration
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"

# Server
PORT=5000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"
```

### Database Setup

1. Create a PostgreSQL database named `civictrack`
2. Update the `DATABASE_URL` in your `.env` file
3. Run migrations: `npx prisma migrate dev`

## 🏃‍♂️ Usage

### Development Mode

#### Start the backend server:
```bash
npm run dev
```

#### Start the frontend development server:
```bash
cd client
npm run dev
```

#### Using Docker Compose:
```bash
# Development mode
npm run docker:dev

# Production mode
npm run docker:build
```

### Production Mode

#### Build the application:
```bash
# Backend
npm run build

# Frontend
cd client
npm run build
```

#### Start the production server:
```bash
npm start
```

### Available Scripts

#### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed the database
- `npm run lint` - Run ESLint
- `npm run prettier` - Check code formatting

#### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Issue Management
- `GET /api/issues` - Get nearby issues
- `POST /api/issues` - Create a new issue
- `GET /api/issues/:id` - Get specific issue details
- `PUT /api/issues/:id` - Update issue (admin only)
- `DELETE /api/issues/:id` - Delete issue (admin only)

### Categories
- `GET /api/categories` - Get all issue categories
- `POST /api/categories` - Create new category (admin only)

### File Upload
- `POST /api/upload` - Upload images for issues

### Admin Features
- `GET /api/audit` - Get audit logs
- `GET /api/admin/analytics` - Get platform analytics

## 📁 Project Structure

```
civic-sense/
├── 📁 client/                  # Frontend React application
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   ├── 📁 modules/         # Feature-specific modules
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   ├── 📁 lib/             # Utility libraries
│   │   └── 📁 types/           # TypeScript type definitions
│   └── 📄 package.json
├── 📁 src/                     # Backend application
│   ├── 📁 controllers/         # Request handlers
│   ├── 📁 services/            # Business logic
│   ├── 📁 routes/              # API route definitions
│   ├── 📁 middlewares/         # Express middlewares
│   ├── 📁 schemas/             # Zod validation schemas
│   ├── 📁 lib/                 # Utility libraries
│   └── 📄 index.ts             # Application entry point
├── 📁 prisma/                  # Database schema and migrations
│   ├── 📄 schema.prisma        # Prisma schema
│   └── 📁 migrations/          # Database migrations
├── 📄 package.json             # Backend dependencies
├── 📄 compose.yml              # Docker Compose configuration
├── 📄 Dockerfile               # Docker configuration
└── 📄 README.md                # Project documentation
```

## 🤝 Contributing

We welcome contributions to CivicTrack! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Follow SOLID principles and modular architecture

### Code Style

- Use TypeScript for type safety
- Follow RESTful API design principles
- Use Zod for input validation
- Maintain clear separation of concerns (controllers, services, routes)

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for civic engagement and community empowerment
- Inspired by the need for better citizen-government communication
- Thanks to all contributors and the open-source community

---

**Made with ❤️ by [Alokskj](https://github.com/Alokskj)**

For questions or support, please open an issue on GitHub or contact the development team.
