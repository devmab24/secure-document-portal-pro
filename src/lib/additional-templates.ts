
import { DocumentType, Department } from './types';
import { FormTemplate } from './form-templates';

export const additionalTemplates: FormTemplate[] = [
  {
    id: 'medical-report',
    name: 'Medical Report',
    description: 'Comprehensive medical report template for patient assessments',
    documentType: DocumentType.REPORT,
    department: Department.RADIOLOGY,
    category: 'clinical',
    fields: [
      {
        id: 'patient-details',
        type: 'text',
        label: 'Patient Name',
        required: true
      },
      {
        id: 'patient-id',
        type: 'text',
        label: 'Patient ID',
        required: true
      },
      {
        id: 'date-of-examination',
        type: 'date',
        label: 'Date of Examination',
        required: true
      },
      {
        id: 'referring-physician',
        type: 'text',
        label: 'Referring Physician',
        required: true
      },
      {
        id: 'clinical-indication',
        type: 'richtext',
        label: 'Clinical Indication',
        placeholder: 'Reason for examination...',
        required: true
      },
      {
        id: 'technique',
        type: 'richtext',
        label: 'Technique',
        placeholder: 'Examination technique used...'
      },
      {
        id: 'findings',
        type: 'richtext',
        label: 'Findings',
        placeholder: 'Detailed findings...',
        required: true
      },
      {
        id: 'impression',
        type: 'richtext',
        label: 'Impression',
        placeholder: 'Clinical impression and diagnosis...',
        required: true
      },
      {
        id: 'recommendations',
        type: 'richtext',
        label: 'Recommendations',
        placeholder: 'Further recommendations...'
      }
    ]
  },
  {
    id: 'attendance-log',
    name: 'Staff Attendance Log',
    description: 'Daily attendance tracking for department staff',
    documentType: DocumentType.FORM,
    department: Department.HR,
    category: 'administrative',
    fields: [
      {
        id: 'log-date',
        type: 'date',
        label: 'Date',
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
        id: 'shift',
        type: 'select',
        label: 'Shift',
        options: ['Morning', 'Afternoon', 'Night', 'Weekend'],
        required: true
      },
      {
        id: 'staff-present',
        type: 'textarea',
        label: 'Staff Present',
        placeholder: 'List all staff members present...',
        required: true
      },
      {
        id: 'staff-absent',
        type: 'textarea',
        label: 'Staff Absent',
        placeholder: 'List absent staff with reasons...'
      },
      {
        id: 'late-arrivals',
        type: 'textarea',
        label: 'Late Arrivals',
        placeholder: 'Staff who arrived late with times...'
      },
      {
        id: 'early-departures',
        type: 'textarea',
        label: 'Early Departures',
        placeholder: 'Staff who left early with reasons...'
      },
      {
        id: 'notes',
        type: 'richtext',
        label: 'Additional Notes',
        placeholder: 'Any additional observations or notes...'
      }
    ]
  },
  {
    id: 'policy-document',
    name: 'Policy Document',
    description: 'Template for creating hospital policies and procedures',
    documentType: DocumentType.POLICY,
    category: 'administrative',
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
        id: 'review-date',
        type: 'date',
        label: 'Next Review Date',
        required: true
      },
      {
        id: 'department-scope',
        type: 'select',
        label: 'Applicable Department',
        options: ['All Departments', ...Object.values(Department)],
        required: true
      },
      {
        id: 'policy-owner',
        type: 'text',
        label: 'Policy Owner',
        placeholder: 'Name and title of policy owner',
        required: true
      },
      {
        id: 'purpose',
        type: 'richtext',
        label: 'Purpose',
        placeholder: 'State the purpose of this policy...',
        required: true
      },
      {
        id: 'scope',
        type: 'richtext',
        label: 'Scope',
        placeholder: 'Define the scope and applicability...',
        required: true
      },
      {
        id: 'policy-statement',
        type: 'richtext',
        label: 'Policy Statement',
        placeholder: 'Main policy content...',
        required: true
      },
      {
        id: 'procedures',
        type: 'richtext',
        label: 'Procedures',
        placeholder: 'Step-by-step procedures...'
      },
      {
        id: 'responsibilities',
        type: 'richtext',
        label: 'Roles and Responsibilities',
        placeholder: 'Define who is responsible for what...'
      },
      {
        id: 'references',
        type: 'richtext',
        label: 'References',
        placeholder: 'Related policies, regulations, or guidelines...'
      }
    ]
  },
  {
    id: 'equipment-maintenance',
    name: 'Equipment Maintenance Log',
    description: 'Track equipment maintenance and service records',
    documentType: DocumentType.FORM,
    category: 'operational',
    fields: [
      {
        id: 'equipment-name',
        type: 'text',
        label: 'Equipment Name',
        required: true
      },
      {
        id: 'equipment-id',
        type: 'text',
        label: 'Equipment ID/Serial Number',
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
        id: 'maintenance-date',
        type: 'date',
        label: 'Maintenance Date',
        required: true
      },
      {
        id: 'maintenance-type',
        type: 'select',
        label: 'Maintenance Type',
        options: ['Routine Maintenance', 'Repair', 'Calibration', 'Safety Check', 'Other'],
        required: true
      },
      {
        id: 'technician-name',
        type: 'text',
        label: 'Technician Name',
        required: true
      },
      {
        id: 'work-performed',
        type: 'richtext',
        label: 'Work Performed',
        placeholder: 'Describe the maintenance work performed...',
        required: true
      },
      {
        id: 'parts-replaced',
        type: 'textarea',
        label: 'Parts Replaced',
        placeholder: 'List any parts that were replaced...'
      },
      {
        id: 'equipment-status',
        type: 'select',
        label: 'Equipment Status After Maintenance',
        options: ['Operational', 'Needs Further Attention', 'Out of Service', 'Replaced'],
        required: true
      },
      {
        id: 'next-maintenance',
        type: 'date',
        label: 'Next Scheduled Maintenance'
      },
      {
        id: 'notes',
        type: 'richtext',
        label: 'Additional Notes',
        placeholder: 'Any additional observations or recommendations...'
      }
    ]
  }
];
