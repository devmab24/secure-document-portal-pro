
# Mock Database

This folder contains JSON files that simulate a backend database for testing the hospital document management system. Each file represents a different entity/table in the system.

## Files Overview

### users.json
Contains mock user data with different roles:
- CMD (Chief Medical Director)
- HOD (Head of Department)
- STAFF (Regular Staff)
- ADMIN (System Administrator)
- SUPER_ADMIN (Super Administrator)

### departments.json
Contains hospital departments with their details:
- Department information
- Head of Department assignments
- Staff counts and locations

### formTemplates.json
Contains form templates with role-based access:
- Different forms for different roles
- Access control by role and department
- Form field definitions

### formSubmissions.json
Contains submitted forms with workflow status:
- Form data and metadata
- Approval workflows
- Status tracking

### documents.json
Contains uploaded documents and files:
- Document metadata
- File information
- Approval status and workflows

### digitalSignatures.json
Contains digital signature records:
- Signature data and metadata
- Signer information
- Verification status

### auditLogs.json
Contains audit trail records:
- User actions and timestamps
- Document access logs
- System activity tracking

## Usage

Import the mock database in your components:

```typescript
import { mockDatabase, getUserById, getUsersByRole } from './mock-db';

// Get all users
const users = mockDatabase.users;

// Get specific user
const user = getUserById('user-cmd-1');

// Get users by role
const hodUsers = getUsersByRole('HOD');
```

## Testing Scenarios

This mock data supports testing:
- Role-based access control
- Form template filtering
- Document approval workflows
- Digital signature verification
- Audit trail functionality
- Department-specific access

## Data Relationships

- Users belong to departments
- Form templates have role/department access rules
- Form submissions link to templates and users
- Documents have approval chains
- Digital signatures link to documents
- Audit logs track all user actions

## Future Enhancements

When implementing a real backend:
1. Replace JSON files with database tables
2. Add proper relationships/foreign keys
3. Implement real authentication
4. Add data validation
5. Set up proper indexes for performance
