
import { DocumentType, Department } from './types';

export interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'richtext' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  documentType: DocumentType;
  department?: Department;
  fields: FormField[];
  category: 'clinical' | 'administrative' | 'financial' | 'operational';
}

export const formTemplates: FormTemplate[] = [
  {
    id: 'patient-referral',
    name: 'Patient Referral Letter',
    description: 'Digital form for patient referrals between departments',
    documentType: DocumentType.FORM,
    category: 'clinical',
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
        id: 'clinical-history',
        type: 'richtext',
        label: 'Clinical History',
        placeholder: 'Provide relevant clinical history',
        required: true
      },
      {
        id: 'examination-findings',
        type: 'richtext',
        label: 'Examination Findings',
        placeholder: 'Document examination findings'
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
      },
      {
        id: 'urgent',
        type: 'checkbox',
        label: 'Urgent Referral',
        description: 'Check if this is an urgent referral'
      }
    ]
  },
  {
    id: 'incident-report',
    name: 'Incident Report',
    description: 'Report workplace incidents and safety concerns',
    documentType: DocumentType.REPORT,
    category: 'operational',
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
        id: 'persons-involved',
        type: 'textarea',
        label: 'Persons Involved',
        placeholder: 'List all persons involved in the incident',
        required: true
      },
      {
        id: 'incident-description',
        type: 'richtext',
        label: 'Incident Description',
        placeholder: 'Provide detailed description of what happened',
        required: true
      },
      {
        id: 'immediate-action',
        type: 'richtext',
        label: 'Immediate Action Taken',
        placeholder: 'Describe actions taken immediately after the incident'
      },
      {
        id: 'injury-sustained',
        type: 'checkbox',
        label: 'Injury Sustained',
        description: 'Check if anyone was injured'
      },
      {
        id: 'injury-details',
        type: 'richtext',
        label: 'Injury Details',
        placeholder: 'Describe any injuries sustained'
      }
    ]
  },
  {
    id: 'department-memo',
    name: 'Department Memo',
    description: 'Internal departmental communication memo',
    documentType: DocumentType.MEMO,
    category: 'administrative',
    fields: [
      {
        id: 'memo-to',
        type: 'text',
        label: 'To',
        placeholder: 'Recipient(s)',
        required: true
      },
      {
        id: 'memo-from',
        type: 'text',
        label: 'From',
        placeholder: 'Sender',
        required: true
      },
      {
        id: 'memo-subject',
        type: 'text',
        label: 'Subject',
        placeholder: 'Memo subject',
        required: true
      },
      {
        id: 'memo-date',
        type: 'date',
        label: 'Date',
        required: true
      },
      {
        id: 'memo-priority',
        type: 'select',
        label: 'Priority',
        options: ['Low', 'Normal', 'High', 'Urgent'],
        required: true
      },
      {
        id: 'memo-content',
        type: 'richtext',
        label: 'Memo Content',
        placeholder: 'Enter the memo content here...',
        required: true
      },
      {
        id: 'action-required',
        type: 'checkbox',
        label: 'Action Required',
        description: 'Check if action is required from recipients'
      },
      {
        id: 'action-deadline',
        type: 'date',
        label: 'Action Deadline',
        description: 'When should the action be completed by?'
      }
    ]
  },
  {
    id: 'monthly-report',
    name: 'Monthly Department Report',
    description: 'Monthly departmental performance and activity report',
    documentType: DocumentType.REPORT,
    category: 'administrative',
    fields: [
      {
        id: 'report-month',
        type: 'text',
        label: 'Reporting Month',
        placeholder: 'e.g., January 2024',
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
        id: 'prepared-by',
        type: 'text',
        label: 'Prepared By',
        placeholder: 'Name and title',
        required: true
      },
      {
        id: 'executive-summary',
        type: 'richtext',
        label: 'Executive Summary',
        placeholder: 'Brief overview of key highlights and achievements',
        required: true
      },
      {
        id: 'key-activities',
        type: 'richtext',
        label: 'Key Activities',
        placeholder: 'Detail the main activities and projects undertaken',
        required: true
      },
      {
        id: 'performance-metrics',
        type: 'richtext',
        label: 'Performance Metrics',
        placeholder: 'Include relevant statistics and KPIs'
      },
      {
        id: 'challenges',
        type: 'richtext',
        label: 'Challenges Faced',
        placeholder: 'Describe any challenges encountered'
      },
      {
        id: 'achievements',
        type: 'richtext',
        label: 'Achievements',
        placeholder: 'Highlight key achievements and successes'
      },
      {
        id: 'recommendations',
        type: 'richtext',
        label: 'Recommendations',
        placeholder: 'Provide recommendations for improvement'
      },
      {
        id: 'next-month-goals',
        type: 'richtext',
        label: 'Next Month Goals',
        placeholder: 'Outline goals and objectives for the coming month'
      }
    ]
  }
];

export const getTemplatesByCategory = (category: string) => {
  return formTemplates.filter(template => template.category === category);
};

export const getTemplatesByDepartment = (department: Department) => {
  return formTemplates.filter(template => 
    !template.department || template.department === department
  );
};

export const getTemplateById = (id: string) => {
  return formTemplates.find(template => template.id === id);
};
