# Hospital Document Management System - FMC Jalingo

A comprehensive web-based document management system designed specifically for Federal Medical Centre Jalingo (FMCJ), built with modern React technologies and a focus on role-based access control, document workflows, and clinical documentation standards.

## 📋 Table of Contents

1. [Application Overview](#-application-overview)
2. [Official FMCJ Department Structure](#-official-fmcj-department-structure)
3. [Current Architecture](#-current-architecture)
4. [Database Schema](#-database-schema)
5. [Security Model](#-security-model)
6. [User Roles & Hierarchy](#-user-roles--hierarchy)
7. [Document Routing Workflow](#-document-routing-workflow)
8. [Key Features](#-key-features)
9. [Technology Stack](#-technology-stack)
10. [Getting Started](#-getting-started)
11. [Project Structure](#-project-structure)
12. [Development Roadmap](#-development-roadmap)

---

## 🏥 Application Overview

This system serves as a centralized platform for managing all types of hospital documents, from clinical reports and patient referrals to administrative memos and policy documents. It supports multiple user roles across different departments, ensuring secure and efficient document workflows throughout the healthcare organization.

---

## 🏢 Official FMCJ Department Structure

The following is the **authoritative department list** for Federal Medical Centre, Jalingo. This structure is the single source of truth for all workflow routing, permissions, document assignment, and departmental dashboards.

### Clinical Departments (23)

| # | Department | Code | Description |
|---|------------|------|-------------|
| 1 | Medical Records | MRD | Patient records management and health information |
| 2 | Family Medicine | FAM | Primary healthcare and family practice services |
| 3 | Internal Medicine | INT | Internal medicine and general adult medical care |
| 4 | Paediatrics | PED | Child health and pediatric services |
| 5 | Obstetrics and Gynaecology | OBG | Maternal health, obstetrics and gynecological services |
| 6 | Surgery | SUR | General and specialized surgical services |
| 7 | Anaesthesia | ANA | Anaesthesiology and perioperative medicine |
| 8 | Orthopaedic Surgery | ORT | Musculoskeletal and orthopedic surgical services |
| 9 | Otorhinolaryngology (ENT) | ENT | Ear, Nose and Throat services |
| 10 | Ophthalmology | OPH | Eye care and ophthalmic services |
| 11 | Dentistry | DEN | Dental care and oral health services |
| 12 | Nursing Services | NUR | Nursing care coordination and management |
| 13 | Pharmacy | PHA | Pharmaceutical services and medication management |
| 14 | Radiology | RAD | Medical imaging and diagnostic services |
| 15 | Histopathology | HIS | Histopathology and tissue analysis services |
| 16 | Medical Laboratory Services | MLS | Clinical laboratory and diagnostic services |
| 17 | Physiotherapy | PHY | Physical therapy and rehabilitation services |
| 18 | Public Health | PUB | Public health programs and community health services |
| 19 | Nutrition and Dietetics | NUT | Clinical nutrition and dietary services |
| 20 | Medical Social Services | MSS | Medical social work and patient support services |
| 21 | NEMSAS | NEM | National Emergency Medical System and Ambulance Service |
| 22 | Oncology Unit | ONC | Cancer care and oncology services |
| 23 | Infection Prevention and Control | IPC | Infection prevention and control committee |

### Non-Clinical Departments (9)

| # | Department | Code | Description |
|---|------------|------|-------------|
| 24 | Administration | ADM | General administration and management (14 sub-units) |
| 25 | Internal Audit | AUD | Internal audit and compliance services |
| 26 | Finance and Accounts | FIN | Financial management and accounting services |
| 27 | Procurement | PRO | Procurement and supply chain management |
| 28 | Works and Maintenance | WKS | Facility maintenance and engineering services |
| 29 | Physical Planning | PPL | Physical planning and infrastructure development |
| 30 | ACTU | ACT | Anti-Corruption and Transparency Unit |
| 31 | Health Research and Ethics | HRE | Health Research and Ethics Committee |
| 32 | Security Services | SEC | Security services and safety management |

### Administration Department Sub-Units (14)

| Unit | Description |
|------|-------------|
| General Administration & Support | Core administrative functions |
| Registry Unit | Document registry and correspondence |
| Appointments, Promotion & Discipline | Staff career management |
| Staff Development & Training | Professional development programs |
| Staff Welfare & Relations | Employee welfare services |
| IPPIS & Nominal Roll | Payroll integration management |
| Pension Matters | Retirement and pension processing |
| Insurance Unit | Staff insurance coordination |
| National Health Insurance Authority | NHIA liaison |
| Information and Communication Technology | IT services and support |
| Legal Unit | Legal affairs and compliance |
| Medical Library | Library and information resources |
| Planning, Research & Statistics | Strategic planning and data |
| Public Relations Unit | Communications and PR |

---

## 🏗 Current Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite + TypeScript)              │
├─────────────────────────────────────────────────────────────────────────────┤
│   Authentication    │    Role-Based UI     │    Document Management         │
│   (Supabase Auth)   │    (13 Roles)        │    (CRUD + Workflows)          │
├─────────────────────────────────────────────────────────────────────────────┤
│                          STATE MANAGEMENT                                   │
│          Redux Toolkit + TanStack Query + React Context                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                          SUPABASE BACKEND                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │     users      │  │   user_roles   │  │   documents    │                │
│  │   (profiles)   │  │  (RBAC - RLS)  │  │   (+ shares)   │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │  departments   │  │ department_    │  │  form_        │                │
│  │ (32 official)  │  │    units (14)  │  │  templates    │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │ inter_dept_    │  │   audit_logs   │  │   digital_    │                │
│  │   messages     │  │                │  │  signatures   │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
├─────────────────────────────────────────────────────────────────────────────┤
│                     ROW-LEVEL SECURITY (RLS)                                │
│   Security Definer Functions: has_role(), get_user_role(), is_admin(),     │
│   is_hod(), is_director_admin(), is_executive(), can_route_documents(),    │
│   is_head_of_unit(), get_user_unit()                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Core Tables (19 tables)

| Table | Purpose | RLS |
|-------|---------|-----|
| `users` | User profiles (linked to auth.users) | ✅ |
| `user_roles` | Role assignments (separate from users) | ✅ |
| `departments` | 32 official FMCJ departments (clinical/non-clinical) | ✅ |
| `department_units` | 14 sub-units within Administration | ✅ |
| `documents` | Document records | ✅ |
| `document_shares` | Inter-user/department sharing | ✅ |
| `document_versions` | Version history | ✅ |
| `document_comments` | Comments on documents | ✅ |
| `document_requests` | Access requests workflow | ✅ |
| `document_access_log` | Access audit trail | ✅ |
| `digital_signatures` | E-signatures | ✅ |
| `form_templates` | Form definitions | ✅ |
| `form_fields` | Template field definitions | ✅ |
| `form_submissions` | Submitted forms | ✅ |
| `inter_department_messages` | Department messaging & document routing | ✅ |
| `message_recipients` | Message routing (multi-recipient) | ✅ |
| `message_attachments` | Attached files to messages | ✅ |
| `audit_logs` | System audit trail | ✅ |

### Department Structure

```sql
-- Departments with service type classification
departments (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT,
  description TEXT,
  service_type service_type,  -- 'clinical' | 'non_clinical' | 'administrative'
  level INTEGER,              -- 1=division, 2=department, 3=unit
  parent_id UUID REFERENCES departments(id),
  head_user_id UUID REFERENCES users(id),
  location TEXT,
  staff_count INTEGER,
  is_active BOOLEAN
)

-- Sub-units within departments (e.g., 14 Administration units)
department_units (
  id UUID PRIMARY KEY,
  department_id UUID REFERENCES departments(id),
  name TEXT NOT NULL,
  code TEXT,
  head_user_id UUID REFERENCES users(id),
  description TEXT,
  location TEXT,
  staff_count INTEGER,
  is_active BOOLEAN
)
```

---

## 🔐 Security Model

### Security Definer Functions

The system uses PostgreSQL security definer functions to safely check roles without RLS recursion:

```sql
-- Core role checking functions
has_role(_user_id UUID, _role app_role) RETURNS BOOLEAN
get_user_role(_user_id UUID) RETURNS app_role
is_admin(_user_id UUID) RETURNS BOOLEAN

-- Document routing workflow functions
is_hod(_user_id UUID) RETURNS BOOLEAN
is_director_admin(_user_id UUID) RETURNS BOOLEAN
is_executive(_user_id UUID) RETURNS BOOLEAN
can_route_documents(_user_id UUID) RETURNS BOOLEAN
is_head_of_unit(_user_id UUID, _unit_id UUID) RETURNS BOOLEAN
get_user_unit(_user_id UUID) RETURNS UUID
```

### RLS Policies

All tables have comprehensive RLS policies including:
- User-level access (own documents, profiles)
- Role-based access (HODs see department docs, executives see all)
- Workflow-based access (message routing participants)
- Admin overrides (super admins can manage all)

---

## 👥 User Roles & Hierarchy

### Role Hierarchy (13 Roles)

```typescript
enum UserRole {
  // Executive Level
  CMD = "CMD",                           // Chief Medical Director
  CMAC = "CMAC",                         // Chairman Medical Advisory Council
  
  // Department Heads (Clinical)
  HEAD_OF_NURSING = "HEAD_OF_NURSING",   // Head of Nursing Services
  MEDICAL_RECORDS_OFFICER = "MEDICAL_RECORDS_OFFICER",
  
  // Department Heads (Non-Clinical)
  DIRECTOR_ADMIN = "DIRECTOR_ADMIN",     // Director of Administration
  CHIEF_ACCOUNTANT = "CHIEF_ACCOUNTANT",
  CHIEF_PROCUREMENT_OFFICER = "CHIEF_PROCUREMENT_OFFICER",
  REGISTRY = "REGISTRY",                 // Registry Officer
  
  // Department & Unit Level
  HOD = "HOD",                           // Head of Department
  HEAD_OF_UNIT = "HEAD_OF_UNIT",         // Head of Administrative Unit
  STAFF = "STAFF",                       // Regular Staff
  
  // System Administration
  ADMIN = "ADMIN",                       // System Administrator
  SUPER_ADMIN = "SUPER_ADMIN"            // Super Administrator
}
```

### Role-Based Dashboards

| Role | Dashboard Route | Access Level |
|------|----------------|--------------|
| SUPER_ADMIN | `/dashboard/super-admin` | Full system access |
| ADMIN | `/dashboard/admin` | User management, system config |
| CMD | `/dashboard/cmd` | Hospital-wide oversight |
| CMAC | `/dashboard/cmac` | Clinical oversight, quality control |
| HEAD_OF_NURSING | `/dashboard/head-of-nursing` | Nursing staff management |
| DIRECTOR_ADMIN | `/dashboard/director-admin` | Administrative operations, unit routing |
| CHIEF_ACCOUNTANT | `/dashboard/chief-accountant` | Financial documents |
| CHIEF_PROCUREMENT | `/dashboard/chief-procurement` | Procurement workflows |
| MEDICAL_RECORDS | `/dashboard/medical-records` | Patient records |
| REGISTRY | `/dashboard/registry` | Document registry |
| HOD | `/dashboard/hod` | Department management |
| HEAD_OF_UNIT | `/dashboard/head-of-unit` | Unit management, staff routing |
| STAFF | `/dashboard/staff` | Personal documents |

---

## 📬 Document Routing Workflow

### Administrative Document Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DOCUMENT ROUTING WORKFLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌─────────────┐                                                         │
│    │     CMD     │ ◄─────── Executive Decisions / Hospital-wide Policies   │
│    └──────┬──────┘                                                         │
│           │                                                                 │
│           ▼                                                                 │
│    ┌─────────────────┐                                                     │
│    │ DIRECTOR ADMIN  │ ◄─────── Administrative Oversight                   │
│    └────────┬────────┘                                                     │
│             │                                                               │
│             │  Sends to relevant unit(s)                                   │
│             ▼                                                               │
│    ┌─────────────────┐                                                     │
│    │  HEAD OF UNIT   │ ◄─────── 14 Administrative Units                   │
│    │ (14 Unit Heads) │          • General Admin    • ICT                  │
│    └────────┬────────┘          • Registry         • Legal                │
│             │                   • IPPIS            • Library              │
│             │  Forwards to staff member(s)         • Insurance            │
│             ▼                                       • HR/Training          │
│    ┌─────────────────┐                              • Planning             │
│    │     STAFF       │ ◄─────── Unit Staff Members                        │
│    └─────────────────┘                                                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Workflow Steps:                                                           │
│  1. director_to_unit_head - Director routes to specific unit              │
│  2. unit_head_to_staff - Unit Head forwards to staff for action           │
│  3. Status tracking: sent → received → read → acknowledged → forwarded    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 1. Role-Based Access Control (RBAC)
- ✅ 13 user roles with dedicated dashboards
- ✅ Protected routes with role-specific guards
- ✅ Separate `user_roles` table (security best practice)
- ✅ Security definer functions for RLS

### 2. Department Hierarchy
- ✅ 32 official FMCJ departments
- ✅ Service type classification (clinical/non-clinical)
- ✅ 14 administrative sub-units
- ✅ Department head assignments

### 3. Document Management
- ✅ Document lifecycle: Draft → Submitted → Review → Approved/Rejected
- ✅ Multiple document types (Reports, Memos, Policies, Forms)
- ✅ File upload with validation
- ✅ Multi-step approval chains
- ✅ Confidentiality levels (standard, restricted, confidential)

### 4. Document Routing Workflow
- ✅ Director Admin → Unit Head routing
- ✅ Unit Head → Staff forwarding
- ✅ Message status tracking
- ✅ Priority levels and deadlines

### 5. Digital Form System
- ✅ Template library (Referral Letters, Incident Reports, Memos)
- ✅ Rich text editor (TipTap)
- ✅ Department-specific templates
- ✅ Form submission tracking

### 6. Inter-Department Messaging
- ✅ Multi-recipient messages
- ✅ Message attachments
- ✅ Priority levels
- ✅ Response deadlines

### 7. Version Control & Audit
- ✅ Complete version history
- ✅ Change tracking
- ✅ Comprehensive audit logs
- ✅ Digital signatures

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| Redux Toolkit | Global State |
| TanStack Query | Server State |
| React Router v6 | Routing |
| TipTap | Rich Text Editor |

### Backend (Supabase)
| Feature | Purpose |
|---------|---------|
| PostgreSQL | Database |
| Auth | Authentication |
| Row-Level Security | Data Protection |
| Realtime | Live Updates |
| Storage | File Storage |

### Key Libraries
- React Hook Form + Zod (Form validation)
- Recharts (Charts/Analytics)
- date-fns (Date handling)
- Lucide Icons (Iconography)
- html2canvas + jsPDF (PDF generation)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project (connected)

### Installation

```bash
# Clone and install
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install

# Start development
npm run dev

# Access at http://localhost:5173
```

### Environment Variables

The project uses Supabase environment variables configured in `.env`:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

### Database Seeding

Navigate to `/database-seeding` to seed test users and data.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn base components (40+)
│   ├── *Layout.tsx              # Role-specific layouts (13)
│   ├── *Sidebar.tsx             # Role-specific sidebars (13)
│   ├── *ProtectedRoute.tsx      # Route guards (13)
│   ├── SendToUnitHeadDialog.tsx # Director → Unit Head routing
│   ├── ForwardToStaffDialog.tsx # Unit Head → Staff forwarding
│   ├── DocumentCommunicationHub.tsx
│   ├── InterDepartmentMessaging.tsx
│   ├── DynamicFormBuilder.tsx
│   ├── RichTextEditor.tsx
│   └── ...
├── pages/
│   ├── admin/                   # Admin pages
│   ├── super-admin/             # Super Admin pages
│   ├── cmd/                     # CMD pages
│   ├── cmac/                    # CMAC pages
│   ├── hod/                     # HOD pages
│   ├── head-of-unit/            # Head of Unit pages (NEW)
│   │   ├── HeadOfUnitDashboard.tsx
│   │   ├── HeadOfUnitInbox.tsx
│   │   └── HeadOfUnitMyUnit.tsx
│   ├── staff/                   # Staff pages
│   ├── registry/                # Registry pages
│   ├── director-admin/          # Director Admin pages
│   ├── head-of-nursing/         # Head of Nursing pages
│   ├── chief-accountant/        # Chief Accountant pages
│   ├── chief-procurement/       # Chief Procurement pages
│   ├── medical-records/         # Medical Records pages
│   ├── Auth.tsx                 # Login page
│   ├── Documents.tsx            # Document listing
│   ├── Upload.tsx               # Document upload
│   ├── FormTemplates.tsx        # Form templates
│   └── ...
├── contexts/
│   ├── AuthContext.tsx          # Authentication state
│   └── ThemeContext.tsx         # Theme management
├── store/
│   ├── index.ts                 # Redux store config
│   └── slices/
│       ├── authSlice.ts
│       ├── documentSlice.ts
│       ├── documentSharingSlice.ts
│       ├── dashboardSlice.ts
│       └── usersSlice.ts
├── services/
│   ├── api/                     # API service modules
│   ├── documentCommunicationService.ts
│   ├── documentSharingService.ts
│   ├── interDepartmentService.ts
│   └── formsService.ts
├── hooks/
│   ├── useDocuments.ts
│   ├── useDashboard.ts
│   ├── useDepartmentUnits.ts    # Fetch unit data (NEW)
│   └── use-toast.ts
├── lib/
│   ├── types.ts                 # TypeScript definitions
│   ├── utils.ts                 # Utility functions
│   ├── form-templates.ts        # Form template definitions
│   └── mock/                    # Mock data (dev only)
├── integrations/
│   └── supabase/
│       ├── client.ts            # Supabase client
│       └── types.ts             # Auto-generated types
└── providers/
    └── ReduxProvider.tsx        # Redux provider wrapper
```

---

## 🗺 Development Roadmap

### ✅ Phase 1: Security Foundation (COMPLETE)
- [x] Create `user_roles` table with secure RLS
- [x] Implement `has_role()` security definer function
- [x] Implement `get_user_role()` function
- [x] Implement `is_admin()` function
- [x] Add role-based RLS policies to tables
- [x] Auto-sync roles on user creation
- [x] Add HEAD_OF_UNIT role

### ✅ Phase 2: Head of Unit Dashboard (COMPLETE)
- [x] Create HeadOfUnitLayout component
- [x] Create HeadOfUnitSidebar navigation
- [x] Create HeadOfUnitProtectedRoute
- [x] Implement HeadOfUnitDashboard
- [x] Implement HeadOfUnitInbox
- [x] Implement HeadOfUnitMyUnit

### ✅ Phase 3: Communication Workflow (COMPLETE)
- [x] Create SendToUnitHeadDialog
- [x] Create ForwardToStaffDialog
- [x] Director Admin → Unit Head routing
- [x] Unit Head → Staff forwarding
- [x] Message status tracking

### ✅ Phase 4: RLS & Department Update (COMPLETE)
- [x] Update to 32 official FMCJ departments
- [x] Classify clinical vs non-clinical
- [x] Create workflow security functions
- [x] Implement comprehensive RLS policies
- [x] Update README with official structure

### ⬜ Phase 5: Future Enhancements
- [ ] Department tree UI component
- [ ] Advanced document workflows
- [ ] Notification system
- [ ] Dashboard analytics
- [ ] 2FA authentication
- [ ] Email notifications
- [ ] Mobile app (React Native)

---

## 📄 License

Built for Federal Medical Centre Jalingo. Follows healthcare data handling best practices and HIPAA compliance guidelines.

---

**Built with ❤️ using [Lovable](https://lovable.dev) - AI-powered web application builder**
