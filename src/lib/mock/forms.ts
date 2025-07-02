
import { FormTemplate, DocumentType, Department, UserRole } from '../types';

// Mock database for forms with role-based access
export interface FormAccess {
  roles: UserRole[];
  departments?: Department[];
}

export interface FormTemplateWithAccess extends FormTemplate {
  access: FormAccess;
}

export const mockFormTemplates: FormTemplateWithAccess[] = [
  // CMD-specific forms
  {
    id: 'hospital-policy',
    name: 'Hospital Policy Document',
    description: 'Create and manage hospital-wide policies',
    documentType: DocumentType.POLICY,
    category: 'administrative',
    access: {
      roles: [UserRole.CMD]
    },
    fields: [
      {
        id: 'policy-title',
        type: 'text',
        label: 'Policy Title',
        required: true
      },
      {
        id: 'policy-number',
        type: 'text',
        label: 'Policy Number',
        required: true
      },
      {
        id: 'effective-date',
        type: 'date',
        label: 'Effective Date',
        required: true
      },
      {
        id: 'policy-content',
        type: 'richtext',
        label: 'Policy Content',
        required: true
      },
      {
        id: 'review-date',
        type: 'date',
        label: 'Next Review Date',
        required: true
      }
    ]
  },
  {
    id: 'executive-directive',
    name: 'Executive Directive',
    description: 'Issue executive directives to departments',
    documentType: DocumentType.DIRECTIVE,
    category: 'administrative',
    access: {
      roles: [UserRole.CMD]
    },
    fields: [
      {
        id: 'directive-title',
        type: 'text',
        label: 'Directive Title',
        required: true
      },
      {
        id: 'target-departments',
        type: 'select',
        label: 'Target Departments',
        options: Object.values(Department),
        required: true
      },
      {
        id: 'directive-content',
        type: 'richtext',
        label: 'Directive Content',
        required: true
      },
      {
        id: 'implementation-deadline',
        type: 'date',
        label: 'Implementation Deadline',
        required: true
      }
    ]
  },
  // HOD-specific forms
  {
    id: 'department-budget-request',
    name: 'Department Budget Request',
    description: 'Submit budget requests for your department',
    documentType: DocumentType.REQUEST,
    category: 'financial',
    access: {
      roles: [UserRole.HOD]
    },
    fields: [
      {
        id: 'request-department',
        type: 'select',
        label: 'Department',
        options: Object.values(Department),
        required: true
      },
      {
        id: 'budget-period',
        type: 'text',
        label: 'Budget Period',
        placeholder: 'e.g., Q1 2024',
        required: true
      },
      {
        id: 'requested-amount',
        type: 'number',
        label: 'Requested Amount (₦)',
        required: true
      },
      {
        id: 'justification',
        type: 'richtext',
        label: 'Budget Justification',
        required: true
      },
      {
        id: 'priority-level',
        type: 'select',
        label: 'Priority Level',
        options: ['Low', 'Medium', 'High', 'Critical'],
        required: true
      }
    ]
  },
  {
    id: 'staff-performance-review',
    name: 'Staff Performance Review',
    description: 'Conduct performance reviews for department staff',
    documentType: DocumentType.EVALUATION,
    category: 'administrative',
    access: {
      roles: [UserRole.HOD]
    },
    fields: [
      {
        id: 'staff-name',
        type: 'text',
        label: 'Staff Name',
        required: true
      },
      {
        id: 'staff-id',
        type: 'text',
        label: 'Staff ID',
        required: true
      },
      {
        id: 'review-period',
        type: 'text',
        label: 'Review Period',
        required: true
      },
      {
        id: 'performance-rating',
        type: 'select',
        label: 'Overall Performance Rating',
        options: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Poor'],
        required: true
      },
      {
        id: 'achievements',
        type: 'richtext',
        label: 'Key Achievements',
        required: true
      },
      {
        id: 'areas-for-improvement',
        type: 'richtext',
        label: 'Areas for Improvement'
      },
      {
        id: 'goals-next-period',
        type: 'richtext',
        label: 'Goals for Next Period'
      }
    ]
  },
  // Staff-specific forms
  {
    id: 'leave-application',
    name: 'Leave Application',
    description: 'Apply for leave from work',
    documentType: DocumentType.APPLICATION,
    category: 'administrative',
    access: {
      roles: [UserRole.STAFF, UserRole.HOD]
    },
    fields: [
      {
        id: 'applicant-name',
        type: 'text',
        label: 'Applicant Name',
        required: true
      },
      {
        id: 'employee-id',
        type: 'text',
        label: 'Employee ID',
        required: true
      },
      {
        id: 'leave-type',
        type: 'select',
        label: 'Type of Leave',
        options: ['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Emergency Leave', 'Study Leave'],
        required: true
      },
      {
        id: 'start-date',
        type: 'date',
        label: 'Start Date',
        required: true
      },
      {
        id: 'end-date',
        type: 'date',
        label: 'End Date',
        required: true
      },
      {
        id: 'reason',
        type: 'textarea',
        label: 'Reason for Leave',
        required: true
      },
      {
        id: 'emergency-contact',
        type: 'text',
        label: 'Emergency Contact',
        placeholder: 'Name and phone number'
      }
    ]
  },
  // Admin-specific forms
  {
    id: 'user-account-request',
    name: 'User Account Request',
    description: 'Request new user accounts for staff',
    documentType: DocumentType.REQUEST,
    category: 'administrative',
    access: {
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    fields: [
      {
        id: 'requested-for',
        type: 'text',
        label: 'Account Requested For',
        required: true
      },
      {
        id: 'department',
        type: 'select',
        label: 'Department',
        options: Object.values(Department),
        required: true
      },
      {
        id: 'role',
        type: 'select',
        label: 'User Role',
        options: Object.values(UserRole),
        required: true
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email Address',
        required: true
      },
      {
        id: 'access-level',
        type: 'select',
        label: 'Access Level',
        options: ['Basic', 'Standard', 'Advanced', 'Full'],
        required: true
      },
      {
        id: 'justification',
        type: 'textarea',
        label: 'Justification for Account',
        required: true
      }
    ]
  },
  // Shared forms (available to multiple roles)
  {
    id: 'patient-referral',
    name: 'Patient Referral Letter',
    description: 'Digital form for patient referrals between departments',
    documentType: DocumentType.FORM,
    category: 'clinical',
    access: {
      roles: [UserRole.HOD, UserRole.STAFF],
      departments: [Department.RADIOLOGY, Department.DENTAL, Department.EYE_CLINIC, Department.AE, Department.ANTENATAL]
    },
    fields: [
      {
        id: 'patient-name',
        type: 'text',
        label: 'Patient Name',
        placeholder: 'Enter patient full name',
        required: true
      },
      {
        id: 'patient-id',
        type: 'text',
        label: 'Patient ID/Hospital Number',
        placeholder: 'Enter patient ID',
        required: true
      },
      {
        id: 'patient-age',
        type: 'number',
        label: 'Age',
        placeholder: 'Enter age',
        required: true
      },
      {
        id: 'patient-gender',
        type: 'select',
        label: 'Gender',
        options: ['Male', 'Female', 'Other'],
        required: true
      },
      {
        id: 'referring-department',
        type: 'select',
        label: 'Referring Department',
        options: Object.values(Department),
        required: true
      },
      {
        id: 'referred-to-department',
        type: 'select',
        label: 'Referred To Department',
        options: Object.values(Department),
        required: true
      },
      {
        id: 'chief-complaint',
        type: 'richtext',
        label: 'Chief Complaint',
        placeholder: 'Describe the patient\'s main complaint',
        required: true
      },
      {
        id: 'provisional-diagnosis',
        type: 'richtext',
        label: 'Provisional Diagnosis',
        placeholder: 'Enter provisional diagnosis',
        required: true
      },
      {
        id: 'reason-for-referral',
        type: 'richtext',
        label: 'Reason for Referral',
        placeholder: 'Explain why the patient is being referred',
        required: true
      }
    ]
  },
  {
    id: 'incident-report',
    name: 'Incident Report',
    description: 'Report workplace incidents and safety concerns',
    documentType: DocumentType.REPORT,
    category: 'operational',
    access: {
      roles: [UserRole.STAFF, UserRole.HOD, UserRole.ADMIN]
    },
    fields: [
      {
        id: 'incident-date',
        type: 'date',
        label: 'Incident Date',
        required: true
      },
      {
        id: 'incident-time',
        type: 'text',
        label: 'Time of Incident',
        placeholder: 'HH:MM',
        required: true
      },
      {
        id: 'location',
        type: 'text',
        label: 'Location',
        placeholder: 'Where did the incident occur?',
        required: true
      },
      {
        id: 'department',
        type: 'select',
        label: 'Department',
        options: Object.values(Department),
        required: true
      },
      {
        id: 'incident-type',
        type: 'select',
        label: 'Type of Incident',
        options: ['Patient Fall', 'Medication Error', 'Equipment Failure', 'Workplace Injury', 'Security Issue', 'Other'],
        required: true
      },
      {
        id: 'incident-description',
        type: 'richtext',
        label: 'Incident Description',
        placeholder: 'Provide detailed description of what happened',
        required: true
      }
    ]
  }
];

// Helper functions for role-based access
export const getFormsByRole = (userRole: UserRole, userDepartment?: Department): FormTemplateWithAccess[] => {
  return mockFormTemplates.filter(form => {
    // Check if user's role is allowed
    if (!form.access.roles.includes(userRole)) {
      return false;
    }

    // If form has department restrictions, check user's department
    if (form.access.departments && userDepartment) {
      return form.access.departments.includes(userDepartment);
    }

    return true;
  });
};

export const getFormsByCategory = (category: string, userRole: UserRole, userDepartment?: Department): FormTemplateWithAccess[] => {
  const userForms = getFormsByRole(userRole, userDepartment);
  return userForms.filter(form => form.category === category);
};

export const getFormById = (id: string): FormTemplateWithAccess | undefined => {
  return mockFormTemplates.find(form => form.id === id);
};

export const canUserAccessForm = (formId: string, userRole: UserRole, userDepartment?: Department): boolean => {
  const form = getFormById(formId);
  if (!form) return false;

  if (!form.access.roles.includes(userRole)) {
    return false;
  }

  if (form.access.departments && userDepartment) {
    return form.access.departments.includes(userDepartment);
  }

  return true;
};
