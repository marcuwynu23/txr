<h1 align="center">txr</h1>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb" alt="MongoDB" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
</p>

**txr** (pronounced _ticker_) is a production-ready, full-stack event management platform built for speed, security, and a premium user experience. Manage events, issue high-fidelity tickets, and track live attendance with ease.

---

## Key Features

### For Organizers

- **Live Admin Dashboard**: Real-time analytics on ticket sales, revenue, and attendee check-ins.
- **Dynamic Event Management**: Create, edit, publish, and view private/public events with custom capacities.
- **Live Attendance Scanner**: Integrated browser-based QR code scanner for seamless venue entry using `html5-qrcode`.
- **Attendee Tracking**: Instant access to attendee lists with precise check-in timestamps.

### For Attendees

- **Seamless Booking**: Support for both Free and Paid events with mock payment integration.
- **My Tickets Dashboard**: Personal portal to manage upcoming events and cancel registrations.
- **QR Entry Passes**: Instantly download high-quality QR codes for fast entry at event gates.
- **Responsive Design**: Polished, mobile-first UI built with a minimalist GitLab-inspired aesthetic.

---

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT-based session management using [Jose](https://github.com/panva/jose)
- **Scanning**: [HTML5 QR Code](https://github.com/mebjas/html5-qrcode) for browser-based scanning

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB instance (Local or Atlas)

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SESSION_COOKIE_NAME=txr_session
```

### 3. Installation & Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## Architecture

The project follows a modular architecture with a strict separation of concerns:

- `src/actions`: Server-side logic and database interactions.
- `src/components`: Reusable UI components (Atomic design principles).
- `src/models`: Mongoose schemas for data integrity.
- `src/lib`: Shared utilities for authentication and database connections.

---

## System Flow

### User Roles & Permissions

```mermaid
graph TB
    subgraph "User Roles"
        Admin[👤 Admin]
        Attendee[👥 Attendee]
    end

    subgraph "Admin Capabilities"
        CreateEvent[📅 Create Events]
        ManageEvent[⚙️ Manage Events]
        ScanQR[📱 QR Scanner]
        ViewAnalytics[📊 Analytics Dashboard]
        CheckInUsers[✅ Check-in Attendees]
    end

    subgraph "Attendee Capabilities"
        BrowseEvents[🔍 Browse Events]
        RegisterEvent[🎫 Register for Events]
        ViewTickets[📋 View My Tickets]
        DownloadQR[⬇️ Download QR Codes]
        CancelTicket[❌ Cancel Registration]
    end

    Admin --> CreateEvent
    Admin --> ManageEvent
    Admin --> ScanQR
    Admin --> ViewAnalytics
    Admin --> CheckInUsers

    Attendee --> BrowseEvents
    Attendee --> RegisterEvent
    Attendee --> ViewTickets
    Attendee --> DownloadQR
    Attendee --> CancelTicket
```

### Ticket Lifecycle

```mermaid
sequenceDiagram
    participant A as Admin
    participant S as System
    participant U as Attendee
    participant QR as QR Scanner

    Note over A,QR: Event Creation & Registration Flow

    A->>S: Create Event (Draft)
    S->>S: Generate Event ID
    A->>S: Publish Event

    U->>S: Browse Published Events
    U->>S: Register for Event
    S->>S: Generate Unique Ticket Code
    S->>S: Create QR Code Data
    S->>U: Return Ticket with QR Code

    Note over A,QR: Check-in Flow

    U->>QR: Present QR Code at Venue
    A->>QR: Scan QR Code
    QR->>S: Validate Ticket Code

    alt Valid Ticket
        S->>S: Mark Ticket as "USED"
        S->>S: Set Check-in Timestamp
        S->>QR: ✅ Check-in Success
        QR->>A: Display Success Message
    else Invalid/Used Ticket
        S->>QR: ❌ Check-in Failed
        QR->>A: Display Error Message
    end
```

### Data Flow Architecture

```mermaid
graph LR
    subgraph "Frontend (Next.js)"
        Pages[📄 Pages]
        Components[🧩 Components]
        Actions[⚡ Server Actions]
    end

    subgraph "Backend Services"
        Auth[🔐 Authentication]
        Session[🍪 Session Management]
        Database[🗄️ Database Layer]
    end

    subgraph "Database (MongoDB)"
        Users[(👤 Users)]
        Events[(📅 Events)]
        Tickets[(🎫 Tickets)]
    end

    subgraph "External Services"
        QRGen[📱 QR Code Generation]
        Scanner[📷 HTML5 QR Scanner]
    end

    Pages --> Components
    Components --> Actions
    Actions --> Auth
    Actions --> Database
    Auth --> Session
    Database --> Users
    Database --> Events
    Database --> Tickets
    Actions --> QRGen
    Components --> Scanner
```
