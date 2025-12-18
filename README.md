
# Hospital Document Management System - FMC Jalingo

A comprehensive web-based document management system designed specifically for Federal Medical Centre Jalingo, built with modern React technologies and a focus on role-based access control, document workflows, and clinical documentation standards.

## 📋 Table of Contents

1. [Application Overview](#-application-overview)
2. [Current Architecture Status](#-current-architecture-status)
3. [FMC Jalingo Target Architecture](#-fmc-jalingo-target-architecture)
4. [Gap Analysis](#-gap-analysis)
5. [Key Features Implemented](#-key-features-implemented)
6. [Technology Stack](#-technology-stack)
7. [Database Schema](#-database-schema)
8. [User Roles & Hierarchy](#-user-roles--hierarchy)
9. [Getting Started](#-getting-started)
10. [Development Roadmap](#-development-roadmap)

---

## 🏥 Application Overview

This system serves as a centralized platform for managing all types of hospital documents, from clinical reports and patient referrals to administrative memos and policy documents. It supports multiple user roles across different departments, ensuring secure and efficient document workflows throughout the healthcare organization.

---

## 🏗 Current Architecture Status

### What We Have (MVP v1.0)

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                     │
├─────────────────────────────────────────────────────────────────┤
│  Authentication   │  Role-Based UI  │  Document Management      │
│  (Supabase Auth)  │  (12 Roles)     │  (CRUD + Workflows)       │
├─────────────────────────────────────────────────────────────────┤
│                     STATE MANAGEMENT                            │
│  Redux Toolkit + TanStack Query + React Context                 │
├─────────────────────────────────────────────────────────────────┤
│                     SUPABASE BACKEND                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │    users     │ │  departments │ │  documents   │            │
│  │  (+ roles)   │ │   (flat)     │ │              │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ form_templs  │ │  doc_shares  │ │  audit_logs  │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Current Database Tables (17 tables)

| Table | Purpose | Status |
|-------|---------|--------|
| `users` | User profiles + roles | ⚠️ Roles should be separate table |
| `departments` | Department list (flat) | ⚠️ No hierarchy |
| `documents` | Document records | ✅ Complete |
| `document_shares` | Inter-user sharing | ✅ Complete |
| `document_versions` | Version history | ✅ Complete |
| `document_comments` | Comments on docs | ✅ Complete |
| `document_requests` | Access requests | ✅ Complete |
| `document_access_log` | Access audit | ✅ Complete |
| `digital_signatures` | E-signatures | ✅ Complete |
| `form_templates` | Form definitions | ✅ Complete |
| `form_fields` | Template fields | ✅ Complete |
| `form_submissions` | Submitted forms | ✅ Complete |
| `inter_department_messages` | Dept messaging | ✅ Complete |
| `message_recipients` | Message routing | ✅ Complete |
| `message_attachments` | Attached files | ✅ Complete |
| `audit_logs` | System audit trail | ✅ Complete |

### Current User Roles (12 roles)

```typescript
enum UserRole {
  CMD = "CMD",                           // Chief Medical Director
  CMAC = "CMAC",                         // Chairman Medical Advisory Council
  HEAD_OF_NURSING = "HEAD_OF_NURSING",   // Head of Nursing Services
  REGISTRY = "REGISTRY",                 // Registry Officer
  DIRECTOR_ADMIN = "DIRECTOR_ADMIN",     // Director of Administration
  CHIEF_ACCOUNTANT = "CHIEF_ACCOUNTANT", // Chief Accountant
  CHIEF_PROCUREMENT_OFFICER = "CHIEF_PROCUREMENT_OFFICER",
  MEDICAL_RECORDS_OFFICER = "MEDICAL_RECORDS_OFFICER",
  HOD = "HOD",                           // Head of Department
  STAFF = "STAFF",                       // Regular Staff
  ADMIN = "ADMIN",                       // System Administrator
  SUPER_ADMIN = "SUPER_ADMIN"            // Super Administrator
}
```

### Current Departments (13 departments - flat structure)

| Department | Code | Type |
|------------|------|------|
| Radiology | RAD | Clinical |
| Dental | DEN | Clinical |
| Eye Clinic | EYE | Clinical |
| Antenatal | ANT | Clinical |
| Accident & Emergency | A&E | Clinical |
| Physiotherapy | PHY | Clinical |
| Pharmacy | PHA | Clinical |
| Human Resources | HR | Non-Clinical |
| Finance | FIN | Non-Clinical |
| Information Technology | IT | Non-Clinical |
| Administration | ADM | Non-Clinical |
| Registry | REG | Non-Clinical |
| Director of Administration | DOA | Non-Clinical |

---

## 🎯 FMC Jalingo Target Architecture

### A. CORE PLATFORM MODULES (Foundation)

#### A1. Authentication & User Management

| Sub-Module | Description | MVP Status |
|------------|-------------|------------|
| User accounts | Create, manage user identities | ✅ Done |
| Password reset / 2FA | Secure authentication | 🟡 Partial (no 2FA) |
| Session management | Token refresh, logout | ✅ Done |
| SSO | Single Sign-On integration | ⬜ Future |
| Staff directory sync | HR system integration | 🔴 Missing |

#### A2. RBAC & Permissions Module

| Sub-Module | Description | MVP Status |
|------------|-------------|------------|
| Roles | User role definitions | 🔴 Needs separate table |
| Department hierarchy mapping | Org structure | 🔴 Missing |
| Confidentiality levels | Internal/Restricted/Secret | ✅ Done |
| ABAC | Attribute-based access | 🔴 Missing |

#### A3. Department Hierarchy Module

| Sub-Module | Description | MVP Status |
|------------|-------------|------------|
| Clinical Services | Surgery, Medicine, etc. | 🔴 Missing grouping |
| Non-Clinical Services | Admin, Finance, etc. | 🔴 Missing grouping |
| Sub-units & sections | Dept sub-divisions | 🔴 Missing |
| Dynamic routing rules | Dept-based routing | 🟡 Partial |
| Department metadata | Extended dept info | 🟡 Partial |

---

## 📊 Gap Analysis

### Critical Gaps (Must Fix)

| Issue | Risk | Solution |
|-------|------|----------|
| Roles in `users` table | Privilege escalation | Create `user_roles` table with RLS |
| Flat department structure | No sub-unit routing | Add `parent_id` + hierarchy table |
| Client-side only RBAC | Bypass via API | Implement RLS policies per role |

### Target Database Schema

```sql
-- MISSING: user_roles table (CRITICAL)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- MISSING: Department hierarchy
ALTER TABLE departments ADD COLUMN parent_id UUID REFERENCES departments(id);
ALTER TABLE departments ADD COLUMN service_type TEXT; -- 'clinical' | 'non-clinical'
ALTER TABLE departments ADD COLUMN level INT; -- 1=division, 2=department, 3=unit

-- MISSING: Sub-units table
CREATE TABLE department_units (
  id UUID PRIMARY KEY,
  department_id UUID REFERENCES departments(id),
  name TEXT NOT NULL,
  code TEXT,
  head_user_id UUID REFERENCES users(id)
);
```

---

## ✨ Key Features Implemented

### 1. Role-Based Access Control (RBAC)
- 12 user roles with dedicated dashboards
- Protected routes per role
- Role-specific sidebar navigation

### 2. Document Management & Workflows
- Document lifecycle: Draft → Submitted → Review → Approved/Rejected
- Multiple document types (Reports, Memos, Policies, Forms)
- File upload with validation
- Multi-step approval chains

### 3. Digital Form System
- Template library (Referral Letters, Incident Reports, Memos)
- Rich text editor (TipTap)
- Department-specific templates
- Form submission tracking

### 4. Document Sharing & Collaboration
- Inter-department sharing
- User-to-user sharing
- Status tracking (Sent → Received → Seen → Acknowledged)
- Comment threads

### 5. Version Control
- Complete version history
- Change tracking
- Rollback capability (admin only)

### 6. Audit & Compliance
- Comprehensive audit logs
- User activity tracking
- Timestamp accountability

---

## 🛠 Technology Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Redux Toolkit** + **TanStack Query**
- **TipTap** (Rich Text Editor)

### Backend
- **Supabase** (PostgreSQL + Auth + RLS)
- **Row-Level Security** for data protection

### Libraries
- React Router DOM, React Hook Form, Zod
- Recharts, date-fns, Lucide Icons
- html2canvas, jsPDF

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
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

### Quick Login (Test Users)

Navigate to `/database-seeding` and use the Quick Login tab to test any role:

| Role | Email | Password |
|------|-------|----------|
| CMD | cmd@test.com | password123 |
| CMAC | cmac@test.com | password123 |
| Head of Nursing | nursing@test.com | password123 |
| Registry | registry@test.com | password123 |
| Director Admin | director@test.com | password123 |
| Chief Accountant | accountant@test.com | password123 |
| Chief Procurement | procurement@test.com | password123 |
| Medical Records | medrecords@test.com | password123 |
| HOD | hod@test.com | password123 |
| Staff | staff@test.com | password123 |
| Admin | admin@test.com | password123 |
| Super Admin | superadmin@test.com | password123 |

---

## 🗺 Development Roadmap

### Phase 1: Security Foundation (Priority)
- [ ] Create `user_roles` table with secure RLS
- [ ] Migrate roles from users table
- [ ] Implement `has_role()` security definer function
- [ ] Add role-based RLS policies to all tables

### Phase 2: Department Hierarchy
- [ ] Add hierarchy fields to departments table
- [ ] Create department_units table for sub-units
- [ ] Implement Clinical/Non-Clinical service grouping
- [ ] Build department tree UI component

### Phase 3: Enhanced Permissions
- [ ] Implement ABAC (Attribute-Based Access Control)
- [ ] Add 2FA authentication
- [ ] Create permission policy editor (admin)

### Phase 4: Integrations
- [ ] HR system sync for staff directory
- [ ] Email notifications for workflows
- [ ] SSO integration (optional)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn base components
│   ├── *Layout.tsx      # Role-specific layouts
│   ├── *Sidebar.tsx     # Role-specific sidebars
│   └── *ProtectedRoute.tsx
├── pages/
│   ├── admin/           # Admin pages
│   ├── cmd/             # CMD pages
│   ├── hod/             # HOD pages
│   ├── staff/           # Staff pages
│   ├── registry/        # Registry pages
│   └── ...              # Other role pages
├── contexts/
│   ├── AuthContext.tsx  # Auth state management
│   └── ThemeContext.tsx # Theme management
├── store/
│   └── slices/          # Redux slices
├── lib/
│   ├── types.ts         # TypeScript definitions
│   └── form-templates.ts
├── services/            # API services
└── hooks/               # Custom hooks
```

---

## 📄 License

Built for Federal Medical Centre Jalingo. Follows healthcare data handling best practices.

---

**Built with ❤️ using Lovable - AI-powered web application builder**
