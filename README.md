# Operational Management Platform

A production-ready MERN stack Operational Management Platform with Certificate Management, Vehicle Fleet Management, Project Tracking, Executive Dashboard, and Centralized Reporting.

**Plain-language guide:** See [docs/FUNCTIONALITY_GUIDE.md](docs/FUNCTIONALITY_GUIDE.md) for a simple explanation of what each screen and feature does.

## Tech Stack

### Backend
- Node.js, Express.js, TypeScript
- MongoDB, Mongoose
- JWT Authentication with RBAC (7 roles)
- Multer (file uploads), Nodemailer (email)
- ExcelJS & PDFKit (exports)
- Swagger/OpenAPI, Winston logging
- Node-cron (scheduled jobs)

### Frontend
- React 19, Vite, TypeScript
- Material UI, React Router, React Query
- React Hook Form, Axios, Recharts
- Notistack (toast notifications)

## Features

### Module 1: Certificate Management
- Full CRUD with soft delete
- PDF/Image upload & download
- Search, filter, sort, pagination
- Export to Excel/PDF
- Automatic expiry status updates
- Email reminders & notifications
- Analytics dashboard with charts

### Module 2: Vehicle & Fleet Management
- Vehicle database with status tracking
- Assignment workflow with photo capture
- Vehicle return process
- Maintenance history tracking
- Insurance/MVPI/Service alerts
- Fleet utilization dashboard
- Export capabilities

### Module 3: Project Tracking
- Full project lifecycle (Proposal → Closed)
- Paginated project list with search, filters, bulk actions, export
- Multi-tab project detail: General, Planning, Resources, Progress, Documents, Financial
- Milestones, WBS, deliverables, schedule items
- Resource allocation (employees, vehicles, equipment) with double-booking prevention
- Progress updates (weekly/monthly) with auto-calculated project progress
- Document uploads with preview/download
- Financial summary with budget variance
- Project analytics dashboard

### Executive Dashboard
- Live aggregated widgets across projects, fleet, certificates, and finance
- Charts: status distribution, progress trends, resource allocation, cost vs budget

### Centralized Reporting Center
- 8 report types with multi-filter support
- Export to Excel and PDF with applied filters

### Authentication & RBAC
Roles: Super Admin, Admin, Manager, Engineer, Technician, Driver, Viewer

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 7+

### 1. Clone & Install

```bash
# Use Node 20
nvm use 20

# Backend
cd backend
cp .env.example .env
npm install
npm run seed    # Seed demo data
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 2. Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- Swagger Docs: http://localhost:5001/api/docs

### 3. Demo Login
| Email | Role | Password |
|-------|------|----------|
| superadmin@company.com | Super Admin | Admin@123 |
| admin@company.com | Admin | Admin@123 |
| manager@company.com | Manager | Admin@123 |
| engineer@company.com | Engineer | Admin@123 |
| driver@company.com | Driver | Admin@123 |
| viewer@company.com | Viewer | Admin@123 |

## Docker

```bash
docker-compose up -d
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database, env, logger
│   │   ├── constants/      # Roles, permissions, enums
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, RBAC, upload, audit
│   │   ├── validators/     # Request validation
│   │   ├── utils/          # Helpers, storage, exports
│   │   ├── jobs/           # Cron jobs
│   │   └── docs/           # Swagger config
│   └── uploads/            # Local file storage
├── frontend/
│   └── src/
│       ├── features/       # Feature-based modules
│       ├── components/     # Shared UI components
│       ├── contexts/       # React contexts
│       ├── services/       # API client
│       ├── types/          # TypeScript types
│       └── theme/          # MUI theme
└── docker-compose.yml
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `GET /api/auth/users` - List users

### Certificates
- `GET /api/certificates` - List (paginated, filterable)
- `POST /api/certificates` - Create (multipart)
- `GET /api/certificates/dashboard` - Dashboard stats
- `GET /api/certificates/export/excel` - Excel export
- `GET /api/certificates/export/pdf` - PDF export

### Vehicles
- `GET /api/vehicles` - List vehicles
- `POST /api/vehicles/assignments` - Create assignment
- `POST /api/vehicles/assignments/:id/return` - Return vehicle
- `GET /api/vehicles/dashboard` - Fleet dashboard
- `POST /api/vehicles/maintenance` - Add maintenance record

### Notifications
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/read-all` - Mark all read

### Projects
- `GET /api/projects` - List projects (paginated, filterable)
- `GET /api/projects/:id/detail` - Full project detail with tabs data
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id/archive` - Archive project
- `POST /api/projects/:id/duplicate` - Duplicate project
- `GET /api/projects/dashboard` - Project analytics
- `GET /api/projects/resource-allocations` - Resource allocation list
- `POST /api/projects/:id/assignments` - Assign resource
- `PATCH /api/projects/:id/assignments/:id/release` - Release resource

### Executive Dashboard
- `GET /api/executive/dashboard` - Centralized KPIs and charts

### Reports
- `GET /api/reports/types` - Available report types
- `GET /api/reports/generate` - Generate report with filters
- `GET /api/reports/export/excel` - Export report to Excel
- `GET /api/reports/export/pdf` - Export report to PDF

## Testing Module 3 (Project Tracking)

1. **Login** as `manager@company.com` / `Admin@123`
2. **Projects list** — Navigate to Projects → All Projects
   - Search, filter by status/client
   - Create, edit, duplicate, archive, delete
   - Bulk select + archive/delete
   - Export Excel/PDF
3. **Project detail** — Click View on any project
   - **General** tab: verify project fields
   - **Planning** tab: add milestone and WBS/deliverable
   - **Resources** tab: assign employee or vehicle (try assigning same resource twice — should warn/block)
   - **Progress** tab: add weekly/monthly update — progress % should recalculate
   - **Documents** tab: upload PDF/image
   - **Financial** tab: update budget/actual cost — verify variance
4. **Project Analytics** — Projects → Project Analytics (charts load from live data)
5. **Resource Allocation** — Projects → Resource Allocation
6. **Executive Dashboard** — Overview → Executive Dashboard
7. **Reports** — System → Reports → select type, apply filters, Generate, export Excel/PDF

## Environment Variables

See `backend/.env.example` for all configuration options including:
- MongoDB URI, JWT secret
- SMTP settings for email
- Cron schedules for automated jobs
- File upload limits

## License

ISC
