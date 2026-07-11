# Operational Management Platform — Simple Guide

This document explains **what each part of the app does**, in plain language. No technical jargon required.

---

## What is this app?

It is a **work management system** for a company that runs projects, manages vehicles, and tracks certificates (licenses, safety papers, insurance, etc.).

Everything is in one place:
- See how projects are going
- Know who is assigned where
- Track vehicles and their paperwork
- Track certificates before they expire
- Pull reports for management

You log in with your email and password. What you can see and do depends on your **role** (Super Admin, Admin, Manager, Engineer, and so on).

---

## Main areas in the sidebar

### 1. Dashboard (Home)

**What it does:** Gives you a quick snapshot when you first log in.

**You can see:**
- Total counts (certificates, vehicles, projects, etc.)
- Recent activity
- Shortcuts to important areas

**Who uses it:** Everyone — a starting point for the day.

---

### 2. Executive Dashboard

**What it does:** A **big-picture view for leadership**. It combines data from projects, people, vehicles, certificates, and money in one screen.

**You can see:**
- How many projects are active, completed, or delayed
- Overall portfolio progress (%)
- Open RFIs (questions that need answers) and NCRs (quality issues)
- Pending approvals and outstanding payments
- Charts:
  - **Project Status** — how many projects are in each stage (Active, Planning, Completed, etc.)
  - **Certificate Expiry** — how many certs are expired, expiring soon, or still valid
  - **Monthly Project Progress** — average progress over time
  - **Cost vs Budget** — planned money vs money actually spent
  - **Manpower Allocation** — how many people are assigned by role (engineer, supervisor, technician)
  - **Vehicle Utilization** — how many vehicles are available, assigned, in maintenance, etc.

**When charts have no data:** A friendly empty placeholder is shown with a short message (not a blank box).

**Who uses it:** Managers, admins, executives.

---

## Projects section

This is the **project tracking module** — the newest and largest part of the app.

### All Projects

**What it does:** The main list of all company projects.

**You can:**
- **Search** by name, code, or client
- **Filter** by status or client
- **Create** a new project
- **View** project details (click a row or use the ⋮ menu)
- **Edit**, **duplicate**, **archive**, or **delete** a project
- **Select** multiple projects (Select button) and archive or delete in bulk
- **Export** the list to Excel or PDF
- See **summary cards** at the top (total, active, delayed, etc.)

**Project statuses explained (simple):**
| Status | Meaning |
|--------|---------|
| Proposal Stage | Idea / bid stage, not started yet |
| Planning Stage | Being planned, designs and schedules |
| Pending Execution | Approved but work not fully started |
| Active | Work is happening now |
| On Hold | Paused temporarily |
| Completed / Closed | Finished |
| Under Review | Waiting for approval or sign-off |

---

### Project Detail (click any project)

**What it does:** Everything about **one project** in six tabs.

#### General tab
- Basic info: name, code, client, dates, budget, progress %, delay status
- Edit project details from here

#### Planning tab
- **Milestones** — big checkpoints (e.g. “Foundation complete”)
- **WBS / Deliverables / Schedule** — breakdown of work and deadlines
- Add new milestones and planning items

#### Resources tab
- Assign **employees**, **vehicles**, or **equipment** to this project
- Each assignment has a work package, start date, and role
- **Double-booking is blocked** — the same person or vehicle cannot be on two active projects at once
- Release a resource when they are done

#### Progress tab
- Add **weekly or monthly progress updates**
- Each update has a date, progress %, summary, and optional issues
- The project’s overall progress is updated from these entries
- This data feeds the **Monthly Progress Trend** chart

#### Documents tab
- Upload project files (drawings, contracts, reports, etc.)
- Download or preview uploaded documents

#### Financial tab
- Set **budget**, **actual cost**, and **outstanding payments**
- See variance (over or under budget)
- Track invoices (paid, pending, overdue)

---

### Project Analytics

**What it does:** Charts and numbers about **all projects together**.

**You can see:**
- **Portfolio health banner** — overall progress %, active/delayed counts
- **Key metrics** — total, active, delayed, completed, proposal, pending execution
- **Status Distribution** — pie chart of projects by status
- **Resource Allocation** — bar chart of active assignments (employees, vehicles, equipment)
- **Monthly Progress Trend** — line chart of average progress over months
- **Utilization** — manpower and vehicle usage %
- **Project Timeline** — list of upcoming and active projects with dates

**When there is no data:** Charts show an empty-state placeholder with guidance text.

---

### Resource Allocation

**What it does:** A **table of every assignment** across all projects.

**You can see:**
- Assignment ID, project name, resource type (employee / vehicle / equipment)
- Who or what was assigned, work package, dates, status
- Search through allocations

**Why it’s useful:** See at a glance who is working where, without opening each project.

---

## Certificates section

### All Certificates

**What it does:** Stores and tracks **official documents** — ISO certs, safety training, equipment calibration, vehicle insurance, vendor compliance, etc.

**You can:**
- Add, edit, view, and delete certificates
- Upload PDF or image files
- Filter by category, status, expiry
- Export lists

**Statuses:** Active, Expiring Soon, Expired (updated automatically based on dates)

### Certificate Analytics

**What it does:** Charts showing certificate health — how many are active, expiring, or expired.

---

## Fleet section

### Vehicles

**What it does:** Your **vehicle database** — registration, insurance, MVPI, mileage, fuel type, current status.

### Assignments

**What it does:** Assign a vehicle to a driver/employee, record handover photos, and **return** the vehicle when done.

### Maintenance

**What it does:** Log maintenance work — insurance renewal, service, repairs, etc.

### Fleet Analytics

**What it does:** Dashboard for fleet usage — available vs assigned vehicles, maintenance alerts, utilization charts.

---

## System section

### Reports (Reporting Center)

**What it does:** **Generate downloadable reports** with filters. Pick a report type, set dates and filters, click Generate, then export to Excel or PDF.

**Report types:**

| Report | What it shows |
|--------|----------------|
| **Project Report** | Project list with status, dates, progress, client |
| **Certificate Report** | Certificates with expiry and status |
| **Vehicle Assignment Report** | Who had which vehicle and when |
| **Vehicle Inspection Report** | Inspection-related vehicle data |
| **Vehicle Maintenance Report** | Maintenance history |
| **Manpower Allocation Report** | Which employees are assigned to which projects |
| **Resource Allocation Report** | All resource assignments (people, vehicles, equipment) |
| **Financial Summary Report** | Budget, actual cost, and payments by project |

---

### Notifications

**What it does:** In-app alerts — certificate expiry warnings, assignment updates, and similar messages.

---

### Profile

**What it does:** View and update your name, email, and password.

---

## User roles (who can do what)

| Role | In simple terms |
|------|-----------------|
| **Super Admin** | Full access to everything |
| **Admin** | Manage most modules, users, settings |
| **Manager** | Run projects, assign people, view dashboards |
| **Engineer** | Work on projects, add progress, view assigned work |
| **Technician** | Similar to engineer, more field/maintenance focus |
| **Driver** | Vehicle-related tasks and assignments |
| **Viewer** | Read-only — can look but not change much |

Exact permissions are enforced on the server — if a button is missing, your role may not allow that action.

---

## Demo data (after running seed)

If you run `npm run seed` in the backend folder, sample data is loaded so charts and lists are not empty:

| Data | What you get |
|------|----------------|
| **7 projects** | Different statuses (Active, Planning, Completed, Proposal, etc.) |
| **12 resource assignments** | Employees, vehicles, and equipment on projects |
| **21 progress updates** | Monthly progress history for trend charts |
| **5 financial records** | Budget vs actual and invoices |
| **5 RFIs/NCRs** | Open and closed issues on projects |
| **Team, milestones, planning items** | Content inside project detail tabs |
| **6 certificates, 5 vehicles** | For certificate and fleet modules |

**Demo login:** `superadmin@company.com` / `Admin@123`  
(Other demo users use the same password — see README.)

---

## How the pieces connect

```
Projects
  ├── Assign people, vehicles, equipment  →  Resource Allocation page + charts
  ├── Add progress updates              →  Monthly Progress Trend chart
  ├── Set budget & costs                →  Cost vs Budget chart + Reports
  └── Raise RFIs / NCRs                 →  Executive Dashboard counters

Certificates  ──────────────────────────→  Executive Dashboard (expiry chart)

Vehicles      ──────────────────────────→  Executive Dashboard (utilization chart)

Reports       ← pulls from all of the above
```

---

## Quick “where do I go?” guide

| I want to… | Go to… |
|------------|--------|
| See all projects | Projects → All Projects |
| Open one project | Click a project row or View in ⋮ menu |
| Assign someone to a project | Project detail → Resources tab |
| Log progress this month | Project detail → Progress tab |
| See charts for all projects | Projects → Project Analytics |
| See everything for leadership | Overview → Executive Dashboard |
| See all assignments in one table | Projects → Resource Allocation |
| Download a spreadsheet report | System → Reports |
| Check expiring certificates | Certificates → All Certificates or Analytics |
| Assign a company vehicle | Fleet → Assignments |

---

## Running the app locally

1. Start MongoDB
2. Backend: `cd backend && npm run seed && npm run dev` (port **5001**)
3. Frontend: `cd frontend && npm run dev` (port **5173**)
4. Open http://localhost:5173 and log in

For API details and developer setup, see the main [README](../README.md).
