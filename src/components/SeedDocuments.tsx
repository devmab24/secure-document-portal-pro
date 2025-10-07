import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SeedResult {
  documentName: string;
  status: 'created' | 'exists' | 'error';
  message?: string;
}

const mockDocuments = [
  // CMD Documents
  {
    name: "Hospital Strategic Plan 2025-2027",
    document_type: "Policy",
    department: "Administration",
    status: "APPROVED",
    description: "Three-year strategic plan for FMC Jalingo",
    tags: ["strategic", "planning", "policy"],
    priority: "high",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 3500000,
    file_url: "/documents/strategic-plan-2025.pdf"
  },
  {
    name: "Annual Budget Proposal 2025",
    document_type: "Request",
    department: "Finance",
    status: "UNDER_REVIEW",
    description: "Annual budget proposal awaiting CMD approval",
    tags: ["budget", "finance", "annual"],
    priority: "urgent",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 2800000,
    file_url: "/documents/budget-proposal-2025.pdf"
  },
  
  // Radiology Department
  {
    name: "Monthly Radiology Report - June 2025",
    document_type: "Report",
    department: "Radiology",
    status: "SUBMITTED",
    description: "Monthly performance report for Radiology department",
    tags: ["report", "monthly", "radiology", "statistics"],
    priority: "medium",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 2450000,
    file_url: "/documents/radiology-report-june-2025.pdf"
  },
  {
    name: "X-Ray Equipment Maintenance Request",
    document_type: "Request",
    department: "Radiology",
    status: "DRAFT",
    description: "Request for maintenance of X-Ray equipment",
    tags: ["maintenance", "equipment", "radiology"],
    priority: "high",
    file_type: "application/pdf",
    file_size: 1200000,
    file_url: "/documents/xray-maintenance-request.pdf"
  },
  
  // Dental Department
  {
    name: "Dental Clinic Quarterly Report Q2 2025",
    document_type: "Report",
    department: "Dental",
    status: "APPROVED",
    description: "Quarterly performance and patient statistics",
    tags: ["dental", "quarterly", "report"],
    priority: "medium",
    file_type: "application/pdf",
    file_size: 1800000,
    file_url: "/documents/dental-q2-report.pdf"
  },
  {
    name: "Dental Equipment Procurement Request",
    document_type: "Request",
    department: "Dental",
    status: "SUBMITTED",
    description: "Request for new dental chairs and equipment",
    tags: ["procurement", "equipment", "dental"],
    priority: "high",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 2100000,
    file_url: "/documents/dental-procurement.pdf"
  },
  
  // Pharmacy Department
  {
    name: "Pharmacy Stock Level Report",
    document_type: "Report",
    department: "Pharmacy",
    status: "SUBMITTED",
    description: "Current pharmaceutical stock levels and reorder recommendations",
    tags: ["pharmacy", "inventory", "stock"],
    priority: "urgent",
    file_type: "application/pdf",
    file_size: 1500000,
    file_url: "/documents/pharmacy-stock-report.pdf"
  },
  {
    name: "Drug Procurement Request - July 2025",
    document_type: "Request",
    department: "Pharmacy",
    status: "UNDER_REVIEW",
    description: "Monthly drug procurement request",
    tags: ["pharmacy", "procurement", "drugs"],
    priority: "urgent",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 2300000,
    file_url: "/documents/pharmacy-procurement-july.pdf"
  },
  
  // A&E Department
  {
    name: "Emergency Response Protocol Update",
    document_type: "Procedure",
    department: "Accident & Emergency",
    status: "APPROVED",
    description: "Updated emergency response procedures",
    tags: ["emergency", "protocol", "procedures"],
    priority: "urgent",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 2890000,
    file_url: "/documents/emergency-response-protocol.pdf"
  },
  {
    name: "A&E Monthly Activity Report",
    document_type: "Report",
    department: "Accident & Emergency",
    status: "SUBMITTED",
    description: "Monthly emergency cases and statistics",
    tags: ["emergency", "report", "statistics"],
    priority: "medium",
    file_type: "application/pdf",
    file_size: 1900000,
    file_url: "/documents/ae-monthly-report.pdf"
  },
  
  // HR Department
  {
    name: "Staff Training Program 2025",
    document_type: "Policy",
    department: "Human Resources",
    status: "UNDER_REVIEW",
    description: "Annual staff training and development program",
    tags: ["hr", "training", "development"],
    priority: "medium",
    file_type: "application/pdf",
    file_size: 2200000,
    file_url: "/documents/training-program-2025.pdf"
  },
  {
    name: "New Staff Recruitment Request",
    document_type: "Request",
    department: "Human Resources",
    status: "SUBMITTED",
    description: "Request for recruitment of additional staff",
    tags: ["hr", "recruitment", "staffing"],
    priority: "high",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 1700000,
    file_url: "/documents/recruitment-request.pdf"
  },
  
  // Finance Department
  {
    name: "Quarterly Financial Report Q2 2025",
    document_type: "Report",
    department: "Finance",
    status: "APPROVED",
    description: "Quarterly financial performance report",
    tags: ["finance", "quarterly", "report"],
    priority: "high",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 3200000,
    file_url: "/documents/finance-q2-report.pdf"
  },
  {
    name: "Payment Authorization Request",
    document_type: "Request",
    department: "Finance",
    status: "SUBMITTED",
    description: "Request for payment authorization for vendors",
    tags: ["finance", "payment", "authorization"],
    priority: "urgent",
    requires_signature: true,
    file_type: "application/pdf",
    file_size: 1400000,
    file_url: "/documents/payment-authorization.pdf"
  },
  
  // Antenatal Department
  {
    name: "Antenatal Care Guidelines Q3 2025",
    document_type: "Policy",
    department: "Antenatal",
    status: "SUBMITTED",
    description: "Q3 antenatal care guidelines and best practices",
    tags: ["antenatal", "guidelines", "care"],
    priority: "high",
    file_type: "application/pdf",
    file_size: 1780000,
    file_url: "/documents/antenatal-guidelines-q3.pdf"
  },
  {
    name: "Maternal Health Statistics Report",
    document_type: "Report",
    department: "Antenatal",
    status: "DRAFT",
    description: "Monthly maternal health statistics and outcomes",
    tags: ["antenatal", "statistics", "maternal health"],
    priority: "medium",
    file_type: "application/pdf",
    file_size: 1600000,
    file_url: "/documents/maternal-health-stats.pdf"
  },
  
  // Registry Office
  {
    name: "Incoming Correspondence Log - June 2025",
    document_type: "Incoming Correspondence",
    department: "Registry",
    status: "ACTIVE",
    description: "Log of all incoming correspondence for June",
    tags: ["registry", "correspondence", "incoming"],
    priority: "medium",
    reference_number: "REG/IN/06/2025",
    file_type: "application/pdf",
    file_size: 2100000,
    file_url: "/documents/correspondence-log-june.pdf"
  },
  {
    name: "Document Retention Schedule Review",
    document_type: "Policy",
    department: "Registry",
    status: "UNDER_REVIEW",
    description: "Annual review of document retention schedules",
    tags: ["registry", "retention", "compliance"],
    priority: "high",
    file_type: "application/pdf",
    file_size: 1900000,
    file_url: "/documents/retention-schedule-review.pdf"
  },
  
  // Medical Records
  {
    name: "Patient Data Management Policy",
    document_type: "Policy",
    department: "Administration",
    status: "APPROVED",
    description: "Policy for managing patient medical records and data security",
    tags: ["medical records", "policy", "data security"],
    priority: "high",
    requires_signature: true,
    confidentiality_level: "restricted",
    file_type: "application/pdf",
    file_size: 2500000,
    file_url: "/documents/patient-data-policy.pdf"
  },
  {
    name: "Medical Records Audit Report",
    document_type: "Compliance Record",
    department: "Administration",
    status: "SUBMITTED",
    description: "Quarterly audit of medical records compliance",
    tags: ["medical records", "audit", "compliance"],
    priority: "high",
    file_type: "application/pdf",
    file_size: 2200000,
    file_url: "/documents/medical-records-audit.pdf"
  }
];

export const SeedDocuments = () => {
  const [seeding, setSeeding] = useState(false);
  const [results, setResults] = useState<SeedResult[]>([]);

  const handleSeed = async () => {
    setSeeding(true);
    setResults([]);
    const seedResults: SeedResult[] = [];

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to seed documents");
        setSeeding(false);
        return;
      }

      // Get all users to assign documents properly
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, role, department');

      if (usersError) {
        toast.error("Failed to fetch users for document assignment");
        console.error(usersError);
        setSeeding(false);
        return;
      }

      // Create documents
      for (const doc of mockDocuments) {
        try {
          // Find appropriate user based on department/role
          const departmentUser = users?.find(u => u.department === doc.department);
          const createdBy = departmentUser?.id || user.id;

          // Assign to CMD or appropriate HOD for review
          const cmdUser = users?.find(u => u.role === 'CMD');
          const hodUser = users?.find(u => u.role === 'HOD' && u.department === doc.department);
          const assignedTo = doc.status === 'SUBMITTED' || doc.status === 'UNDER_REVIEW' 
            ? (cmdUser?.id || hodUser?.id || null)
            : null;

          const { data, error } = await supabase
            .from('documents')
            .insert({
              name: doc.name,
              document_type: doc.document_type,
              status: doc.status,
              description: doc.description,
              tags: doc.tags,
              priority: doc.priority,
              requires_signature: doc.requires_signature || false,
              file_type: doc.file_type,
              file_size: doc.file_size,
              file_url: doc.file_url,
              created_by: createdBy,
              assigned_to: assignedTo,
              current_approver: assignedTo,
              reference_number: doc.reference_number,
              confidentiality_level: doc.confidentiality_level || 'standard',
              version: 1
            })
            .select()
            .single();

          if (error) {
            if (error.code === '23505') { // Unique constraint violation
              seedResults.push({
                documentName: doc.name,
                status: 'exists',
                message: 'Document already exists'
              });
            } else {
              throw error;
            }
          } else {
            seedResults.push({
              documentName: doc.name,
              status: 'created',
              message: `Created in ${doc.department}`
            });
          }
        } catch (error: any) {
          seedResults.push({
            documentName: doc.name,
            status: 'error',
            message: error.message
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setResults(seedResults);
      
      const successCount = seedResults.filter(r => r.status === 'created').length;
      const existsCount = seedResults.filter(r => r.status === 'exists').length;
      const errorCount = seedResults.filter(r => r.status === 'error').length;

      if (successCount > 0) {
        toast.success(`Successfully seeded ${successCount} documents!`);
      }
      if (existsCount > 0) {
        toast.info(`${existsCount} documents already existed`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} documents failed to seed`);
      }

    } catch (error: any) {
      toast.error(`Seeding failed: ${error.message}`);
      console.error('Seeding error:', error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seed Mock Documents</CardTitle>
        <CardDescription>
          Populate the database with realistic mock documents for testing workflows across all departments.
          Documents will be assigned to appropriate users based on department and role.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleSeed} 
          disabled={seeding}
          className="w-full"
        >
          {seeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding Documents...
            </>
          ) : (
            'Seed Documents to Database'
          )}
        </Button>

        {results.length > 0 && (
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            <p className="font-semibold text-sm">Seeding Results:</p>
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm p-2 rounded border"
              >
                {result.status === 'created' && (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                )}
                {result.status === 'exists' && (
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                )}
                {result.status === 'error' && (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.documentName}</p>
                  {result.message && (
                    <p className="text-xs text-muted-foreground">{result.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
          <p className="font-semibold mb-2">Note:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure users are seeded first using the "Seed Auth Users" button</li>
            <li>Documents will be created across all departments</li>
            <li>Various statuses (Draft, Submitted, Under Review, Approved) will be used</li>
            <li>Documents requiring approval will be assigned to CMD or HOD</li>
            <li>This seeds {mockDocuments.length} different documents</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
