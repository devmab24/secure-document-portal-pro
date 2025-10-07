import SeedAuthUsers from '@/components/SeedAuthUsers';
import { SeedDocuments } from '@/components/SeedDocuments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Users, FileText } from 'lucide-react';

const DatabaseSeeding = () => {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-8 w-8" />
          Database Seeding & Testing
        </h1>
        <p className="text-muted-foreground mt-2">
          Seed the database with test data to evaluate FMC Jalingo File Management workflows
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Database Seeding</CardTitle>
              <CardDescription>
                Follow these steps to populate your database with test data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Seed Authentication Users</h3>
                    <p className="text-sm text-muted-foreground">
                      Create test users for all roles: CMD, HOD, CMAC, Admin, Staff, Chief Accountant, 
                      Chief Procurement Officer, Registry, Medical Records, Head of Nursing, etc.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Seed Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      Populate the database with realistic documents from various departments in different 
                      workflow states (Draft, Submitted, Under Review, Approved).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Test Workflows</h3>
                    <p className="text-sm text-muted-foreground">
                      Login with different test users to test document communication, approvals, 
                      and inter-department messaging workflows.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold mb-2">Test User Credentials</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All seeded users use the password: <code className="bg-muted px-2 py-1 rounded">Test@1234</code>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">CMD:</span> cmd@fmcjalingo.gov.ng
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">HOD (Radiology):</span> hod.radiology@fmcjalingo.gov.ng
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">CMAC:</span> cmac@fmcjalingo.gov.ng
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Admin:</span> admin@fmcjalingo.gov.ng
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Chief Accountant:</span> ca@fmcjalingo.gov.ng
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Chief Procurement:</span> cpo@fmcjalingo.gov.ng
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Registry:</span> registry@fmcjalingo.gov.ng
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Medical Records:</span> medrecords@fmcjalingo.gov.ng
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <SeedAuthUsers />
        </TabsContent>

        <TabsContent value="documents">
          <SeedDocuments />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseSeeding;
