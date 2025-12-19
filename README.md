# Hospital Document Management System - FMC Jalingo

A comprehensive web-based document management system designed specifically for Federal Medical Centre Jalingo, built with modern React technologies and a focus on role-based access control, document workflows, and clinical documentation standards.

## 📋 Table of Contents

1. [Application Overview](#-application-overview)
2. [Current Architecture](#-current-architecture)
3. [Database Schema](#-database-schema)
4. [Security Model](#-security-model)
5. [User Roles & Hierarchy](#-user-roles--hierarchy)
6. [Key Features](#-key-features)
7. [Technology Stack](#-technology-stack)
8. [Getting Started](#-getting-started)
9. [Project Structure](#-project-structure)
10. [Development Roadmap](#-development-roadmap)

---

## 🏥 Application Overview

This system serves as a centralized platform for managing all types of hospital documents, from clinical reports and patient referrals to administrative memos and policy documents. It supports multiple user roles across different departments, ensuring secure and efficient document workflows throughout the healthcare organization.

---

## 🏗 Current Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite + TypeScript)              │
├─────────────────────────────────────────────────────────────────────────────┤
│   Authentication    │    Role-Based UI     │    Document Management         │
│   (Supabase Auth)   │    (12 Roles)        │    (CRUD + Workflows)          │
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
│  │ (hierarchical) │  │    units       │  │  templates    │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │ inter_dept_    │  │   audit_logs   │  │   digital_    │                │
│  │   messages     │  │                │  │  signatures   │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
├─────────────────────────────────────────────────────────────────────────────┤
│                     ROW-LEVEL SECURITY (RLS)                                │
│    Security Definer Functions: has_role(), get_user_role(), is_admin()     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Core Tables (19 tables)

| Table | Purpose | RLS |
|-------|---------|-----|
| `users` | User profiles (linked to auth.users) | ✅ |
| `user_roles` | Role assignments (separate from users) | ✅ |
| `departments` | Hierarchical department structure | ✅ |
| `department_units` | Sub-units/sections within departments | ✅ |
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
| `inter_department_messages` | Department messaging | ✅ |
| `message_recipients` | Message routing (multi-recipient) | ✅ |
| `message_attachments` | Attached files to messages | ✅ |
| `audit_logs` | System audit trail | ✅ |

### Department Hierarchy Structure

```sql
-- Departments with hierarchical support
departments (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  parent_id UUID REFERENCES departments(id),  -- Hierarchy
  service_type service_type,                   -- 'clinical' | 'non_clinical' | 'administrative'
  level INTEGER,                               -- 1=division, 2=department, 3=unit
  head_user_id UUID REFERENCES users(id),
  description TEXT,
  location TEXT,
  staff_count INTEGER,
  is_active BOOLEAN
)

-- Sub-units within departments
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

### User Roles Table (Security-First Design)

```sql
-- Roles stored separately from user profiles
user_roles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,           -- enum type
  assigned_by UUID,
  assigned_at TIMESTAMPTZ,
  UNIQUE(user_id, role)
)

-- app_role enum values
CREATE TYPE app_role AS ENUM (
  'CMD', 'CMAC', 'HEAD_OF_NURSING', 'REGISTRY',
  'DIRECTOR_ADMIN', 'CHIEF_ACCOUNTANT', 'CHIEF_PROCUREMENT_OFFICER',
  'MEDICAL_RECORDS_OFFICER', 'HOD', 'STAFF', 'ADMIN', 'SUPER_ADMIN'
);
```

---

## 🔐 Security Model

### Security Definer Functions

The system uses PostgreSQL security definer functions to safely check roles without RLS recursion:

```sql
-- Check if user has a specific role
has_role(_user_id UUID, _role app_role) RETURNS BOOLEAN

-- Get user's highest priority role
get_user_role(_user_id UUID) RETURNS app_role

-- Check if user is admin (SUPER_ADMIN, ADMIN, or CMD)
is_admin(_user_id UUID) RETURNS BOOLEAN
```

### RLS Policy Examples

```sql
-- Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT USING (auth.uid() = id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles" 
  ON user_roles FOR SELECT USING (is_admin(auth.uid()));

-- Users can view their own roles
CREATE POLICY "Users can view their own roles" 
  ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- Super admins can manage roles
CREATE POLICY "Super admins can insert/update/delete roles" 
  ON user_roles USING (has_role(auth.uid(), 'SUPER_ADMIN'));
```

### Triggers

```sql
-- Auto-create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-sync role to user_roles table
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_role_on_create();
```

---

## 👥 User Roles & Hierarchy

### Role Hierarchy (12 Roles)

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
  
  // Department Level
  HOD = "HOD",                           // Head of Department
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
| DIRECTOR_ADMIN | `/dashboard/director-admin` | Administrative operations |
| CHIEF_ACCOUNTANT | `/dashboard/chief-accountant` | Financial documents |
| CHIEF_PROCUREMENT | `/dashboard/chief-procurement` | Procurement workflows |
| MEDICAL_RECORDS | `/dashboard/medical-records` | Patient records |
| REGISTRY | `/dashboard/registry` | Document registry |
| HOD | `/dashboard/hod` | Department management |
| STAFF | `/dashboard/staff` | Personal documents |

---

## ✨ Key Features

### 1. Role-Based Access Control (RBAC)
- ✅ 12 user roles with dedicated dashboards
- ✅ Protected routes with role-specific guards
- ✅ Separate `user_roles` table (security best practice)
- ✅ Security definer functions for RLS

### 2. Department Hierarchy
- ✅ Hierarchical department structure (parent_id)
- ✅ Service type classification (clinical/non-clinical/administrative)
- ✅ Department levels (division/department/unit)
- ✅ Department units/sub-sections

### 3. Document Management
- ✅ Document lifecycle: Draft → Submitted → Review → Approved/Rejected
- ✅ Multiple document types (Reports, Memos, Policies, Forms)
- ✅ File upload with validation
- ✅ Multi-step approval chains
- ✅ Confidentiality levels (standard, restricted, confidential)

### 4. Digital Form System
- ✅ Template library (Referral Letters, Incident Reports, Memos)
- ✅ Rich text editor (TipTap)
- ✅ Department-specific templates
- ✅ Form submission tracking

### 5. Document Sharing & Collaboration
- ✅ Inter-department sharing
- ✅ User-to-user sharing
- ✅ Status tracking (Sent → Received → Seen → Acknowledged)
- ✅ Comment threads

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
│   ├── *Layout.tsx              # Role-specific layouts (12)
│   ├── *Sidebar.tsx             # Role-specific sidebars (12)
│   ├── *ProtectedRoute.tsx      # Route guards (12)
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

### ✅ Phase 2: Department Hierarchy (COMPLETE)
- [x] Add hierarchy fields (parent_id, level, service_type)
- [x] Create department_units table
- [x] Implement service type enum (clinical/non_clinical/administrative)
- [x] Add department head assignments

### 🟡 Phase 3: Enhanced Features (In Progress)
- [ ] Department tree UI component
- [ ] Advanced document workflows
- [ ] Notification system
- [ ] Dashboard analytics

### ⬜ Phase 4: Future Enhancements
- [ ] 2FA authentication
- [ ] SSO integration
- [ ] Email notifications
- [ ] HR system sync
- [ ] Mobile app (React Native)

---

## 📄 License

Built for Federal Medical Centre Jalingo. Follows healthcare data handling best practices and HIPAA compliance guidelines.

---

**Built with ❤️ using [Lovable](https://lovable.dev) - AI-powered web application builder**
