
# 🚀 AssetFlow – Enterprise Asset & Resource Management System

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue?logo=sqlite)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📖 Overview

**AssetFlow** is a modern **Enterprise Asset & Resource Management System (ERP)** that enables organizations to efficiently manage physical assets, shared resources, maintenance operations, audits, and employee allocations from a centralized platform.

Instead of relying on spreadsheets and paper records, AssetFlow provides real-time visibility into asset ownership, availability, lifecycle, maintenance, bookings, and operational analytics.

The platform is designed for:

- 🏢 Corporate Offices
- 🏫 Universities & Schools
- 🏥 Hospitals
- 🏭 Manufacturing Industries
- 🏛 Government Organizations
- 🚚 Logistics Companies
- 🏬 Enterprises

---

# 🎯 Problem Statement

Organizations often struggle with:

- Manual spreadsheet-based asset tracking
- Double allocation of assets
- Booking conflicts
- Poor maintenance scheduling
- Missing audit trails
- Lost assets
- No centralized visibility
- Lack of accountability
- Inefficient approval workflows

AssetFlow solves these challenges through a scalable ERP platform that provides structured workflows for asset management, maintenance, bookings, audits, notifications, and reporting.

---

# ✨ Key Features

- 🔐 JWT Authentication & Role-Based Access Control
- 🏢 Organization & Department Management
- 👥 Employee Directory
- 📦 Asset Registration & Lifecycle Management
- 🔄 Asset Allocation & Transfer Workflow
- 📅 Shared Resource Booking
- 🔧 Maintenance Approval Workflow
- 📋 Asset Audit Cycles
- 📊 Reports & Analytics Dashboard
- 🔔 Notifications & Activity Logs
- 📈 Enterprise KPI Dashboard

---

# 🏗️ System Architecture

```mermaid
flowchart LR

User --> Frontend

Frontend["Next.js Frontend"]

Frontend --> Auth

Auth["JWT Authentication"]

Auth --> API

API["REST API Layer"]

API --> Service

Service["Business Logic"]

Service --> Prisma

Prisma --> SQLite

Service --> Storage["Local File Storage"]

Service --> Notification["Notification Engine"]

Service --> Reports["Reports & Analytics"]

Service --> Logs["Activity Logs"]
```

---

# 👥 User Roles

```mermaid
graph TD

Admin --> Employee
Admin --> AssetManager
Admin --> DepartmentHead

Employee --> RaiseMaintenance
Employee --> BookResources
Employee --> RequestTransfer

DepartmentHead --> ApproveTransfer
DepartmentHead --> DepartmentBookings

AssetManager --> RegisterAsset
AssetManager --> AllocateAsset
AssetManager --> ApproveMaintenance
AssetManager --> ApproveReturns
```

---

# 🔄 Asset Lifecycle

```mermaid
stateDiagram-v2

[*] --> Available

Available --> Allocated

Available --> Reserved

Available --> UnderMaintenance

Allocated --> Returned

Returned --> Available

Allocated --> TransferRequested

TransferRequested --> Allocated

UnderMaintenance --> Available

Available --> Lost

Available --> Retired

Retired --> Disposed
```

---

# 📦 Asset Allocation Workflow

```mermaid
flowchart TD

A[Employee Requests Asset]

A --> B{Asset Available?}

B -->|Yes| C[Allocate Asset]

C --> D[Update Database]

D --> E[Notify Employee]

B -->|No| F[Transfer Request]

F --> G[Department Head Approval]

G --> H[Asset Manager Approval]

H --> I[Transfer Asset]

I --> J[Update History]
```

---

# 🔧 Maintenance Workflow

```mermaid
flowchart TD

A[Raise Request]

A --> B[Pending Approval]

B --> C{Approved?}

C -->|Yes| D[Assign Technician]

D --> E[Repair]

E --> F[Resolved]

F --> G[Asset Available]

C -->|No| H[Rejected]
```

---

# 📋 Audit Workflow

```mermaid
flowchart TD

CreateAudit --> AssignAuditors

AssignAuditors --> VerifyAssets

VerifyAssets --> Missing

VerifyAssets --> Damaged

VerifyAssets --> Verified

Missing --> Report

Damaged --> Report

Verified --> CloseAudit

Report --> ManagerReview

ManagerReview --> CloseAudit
```

---

# 🗄️ Database Overview

```mermaid
erDiagram

USER ||--o{ ALLOCATION : owns

USER ||--o{ BOOKING : creates

USER ||--o{ MAINTENANCE : raises

USER ||--o{ AUDIT : performs

DEPARTMENT ||--o{ USER : contains

CATEGORY ||--o{ ASSET : groups

ASSET ||--o{ ALLOCATION : assigned

ASSET ||--o{ MAINTENANCE : requires

ASSET ||--o{ AUDITITEM : verified
```

---

# 🛠️ Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

## Backend

- Next.js API Routes
- Prisma ORM
- SQLite
- JWT Authentication

## Database

- SQLite

## Data Storage

### SQLite (Primary Database)

Stores all application data:

- Users
- Departments
- Employees
- Assets
- Categories
- Bookings
- Maintenance Requests
- Audit Cycles
- Notifications
- Activity Logs
- Reports
- File Metadata

### Document Storage

Asset images and documents are stored in a local `/uploads` directory during development. Their metadata (file name, path, MIME type, uploader, upload date, and associated asset) is stored in SQLite using Prisma ORM.

> In a production deployment, the `/uploads` directory can be replaced with an object storage service (such as Amazon S3 or Azure Blob Storage) without changing the application's core business logic.

---

# 🚫 Project Constraints

This project intentionally avoids third-party Backend-as-a-Service platforms.

### ✅ Used

- **SQLite** – Primary relational database for all enterprise data.
- **Prisma ORM** – Type-safe database access, schema management, and migrations.
- **JWT Authentication** – Secure authentication and role-based access control (RBAC).
- **SQLite-backed Data Storage** – Stores users, departments, assets, bookings, maintenance records, audit logs, notifications, and application metadata.
- **Local Upload Storage (Development)** – Asset images and documents are stored locally, while their metadata is managed in SQLite via Prisma.
---

# 📂 Project Structure

```
AssetFlow
│
├── prisma/
├── public/
├── docs/
├── uploads/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── middleware/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── .env
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone <repository-url>

cd AssetFlow
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create a `.env` file.

```env
DATABASE_URL="sqlite://username:password@localhost:5432/assetflow"

JWT_SECRET=your_secret_key
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Database Migration

```bash
npx prisma migrate dev
```

## Start Development Server

```bash
npm run dev
```

Application runs at:

```
http://localhost:3000
```

---

# 🗺️ Development Roadmap

| Hour | Milestone |
|------|-----------|
| ⏱️ Hour 1 | Project Setup, README, Architecture |
| ⏱️ Hour 2 | Authentication & Organization |
| ⏱️ Hour 3 | Asset Registration & Directory |
| ⏱️ Hour 4 | Allocation & Resource Booking |
| ⏱️ Hour 5 | Maintenance & Audit |
| ⏱️ Hour 6 | Dashboard, Reports & Notifications |
| ⏱️ Hour 7 | Testing, Deployment & Final Polish |

---

# 📸 Screenshots

Coming Soon...

- Dashboard
- Asset Directory
- Resource Booking
- Reports
- Audit Module

---

# 🚀 Future Scope

```mermaid
mindmap
  root((AssetFlow))
    AI Assistant
    Predictive Maintenance
    QR Scanner
    Barcode Scanner
    OCR
    Mobile App
    PWA
    Email Notifications
    Multi Organization
    IoT Integration
```

---
# 👨‍💻 Team

- [Harshitha Arava](https://github.com/Harshi-max)
- [Sreeshma Kampe](https://github.com/Sreeshma-Kampe/)
- [Asima Firdous](https://github.com/asimafirdous)

---

# 📄 License

This project is developed for educational and hackathon purposes.


