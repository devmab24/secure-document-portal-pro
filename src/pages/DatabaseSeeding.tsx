import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeedAuthUsers from '@/components/SeedAuthUsers';
import { SeedDocuments } from '@/components/SeedDocuments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Database, Users, FileText, LogIn, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const testUsers = [
  { email: 'cmd@test.com', role: 'CMD', label: 'CMD', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  { email: 'superadmin@test.com', role: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  { email: 'admin@test.com', role: 'ADMIN', label: 'Admin', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { email: 'ca@test.com', role: 'CHIEF_ACCOUNTANT', label: 'Chief Accountant', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { email: 'cpo@test.com', role: 'CHIEF_PROCUREMENT_OFFICER', label: 'Chief Procurement', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  { email: 'directoradmin@test.com', role: 'DIRECTOR_ADMIN', label: 'Director Admin', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
  { email: 'headnursing@test.com', role: 'HEAD_OF_NURSING', label: 'Head of Nursing', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
  { email: 'cmac@test.com', role: 'CMAC', label: 'CMAC', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
  { email: 'registry@test.com', role: 'REGISTRY', label: 'Registry', color: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200' },
  { email: 'medrecords@test.com', role: 'MEDICAL_RECORDS_OFFICER', label: 'Medical Records', color: 'bg-teal-100 text-teal-800 hover:bg-teal-200' },
  { email: 'hod.radiology@test.com', role: 'HOD', label: 'HOD Radiology', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
  { email: 'staff.radiology@test.com', role: 'STAFF', label: 'Staff Radiology', color: 'bg-slate-100 text-slate-800 hover:bg-slate-200' },
];

const DatabaseSeeding = () => {
  const [loggingIn, setLoggingIn] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuickLogin = async (email: string) => {
    setLoggingIn(email);
    try {
      // Sign out first to clear any existing session
      await supabase.auth.signOut();
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'password123',
      });

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login Successful',
          description: `Logged in as ${email}`,
        });
        // Navigate to home which will auto-redirect to correct dashboard
        navigate('/');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoggingIn(null);
    }
  };

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

      <Tabs defaultValue="quick-login" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-login">
            <LogIn className="h-4 w-4 mr-2" />
            Quick Login
          </TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Seed Users
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Seed Docs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-login" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Quick Login - Test All Roles
              </CardTitle>
              <CardDescription>
                Click any button below to instantly login as that user. Password: <code className="bg-muted px-2 py-1 rounded">password123</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {testUsers.map((user) => (
                  <Button
                    key={user.email}
                    variant="outline"
                    className={`h-auto py-3 flex flex-col items-start gap-1 ${user.color}`}
                    onClick={() => handleQuickLogin(user.email)}
                    disabled={loggingIn !== null}
                  >
                    {loggingIn === user.email ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span className="font-semibold text-sm">{user.label}</span>
                        <span className="text-xs opacity-75 truncate w-full">{user.email}</span>
                      </>
                    )}
                  </Button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Dashboard Routes by Role:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>CMD:</strong> /dashboard/cmd</div>
                  <div><strong>Super Admin:</strong> /dashboard/super-admin</div>
                  <div><strong>Admin:</strong> /dashboard/admin</div>
                  <div><strong>Chief Accountant:</strong> /dashboard/chief-accountant</div>
                  <div><strong>Chief Procurement:</strong> /dashboard/chief-procurement</div>
                  <div><strong>Director Admin:</strong> /dashboard/director-admin</div>
                  <div><strong>Head of Nursing:</strong> /dashboard/head-of-nursing</div>
                  <div><strong>CMAC:</strong> /dashboard/cmac</div>
                  <div><strong>Registry:</strong> /dashboard/registry</div>
                  <div><strong>Medical Records:</strong> /dashboard/medical-records</div>
                  <div><strong>HOD:</strong> /dashboard/hod</div>
                  <div><strong>Staff:</strong> /dashboard/staff</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                <h3 className="font-semibold mb-2">All Test User Credentials</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All seeded users use the password: <code className="bg-muted px-2 py-1 rounded">password123</code>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">CMD:</span> cmd@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Super Admin:</span> superadmin@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Admin:</span> admin@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Chief Accountant:</span> ca@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Chief Procurement:</span> cpo@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Director Admin:</span> directoradmin@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Head of Nursing:</span> headnursing@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">CMAC:</span> cmac@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Registry:</span> registry@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Medical Records:</span> medrecords@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">HOD Radiology:</span> hod.radiology@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">HOD Dental:</span> hod.dental@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">HOD Emergency:</span> hod.emergency@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">HOD Pharmacy:</span> hod.pharmacy@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">HOD Finance:</span> hod.finance@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">HOD HR:</span> hod.hr@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Staff Radiology:</span> staff.radiology@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Staff Dental:</span> staff.dental@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Staff Emergency:</span> staff.emergency@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Staff Pharmacy:</span> staff.pharmacy@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Staff Finance:</span> staff.finance@test.com
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="font-semibold">Staff Registry:</span> staff.registry@test.com
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
