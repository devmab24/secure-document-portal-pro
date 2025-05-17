
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-hospital-100 to-hospital-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-hospital-200 text-hospital-800">
                  <span className="font-medium">Healthcare Document Management</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Secure Document Portal for Healthcare Institutions
              </h1>
              
              <p className="text-lg text-gray-600">
                A centralized platform for managing clinical documentation, policies, and administrative files with role-based access control and approval workflows.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="text-md bg-hospital-600 hover:bg-hospital-700"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-md border-hospital-600 text-hospital-600 hover:bg-hospital-50"
                  onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
                >
                  Learn More
                </Button>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  Demo credentials: Use any email from the list below with any password:
                </p>
                <ul className="text-sm text-gray-500 list-disc list-inside mt-1">
                  <li>cmd@hospital.org (Chief Medical Director)</li>
                  <li>clinical-hod@hospital.org (Head of Clinical Department)</li>
                  <li>hr-hod@hospital.org (Head of HR)</li>
                  <li>clinical-staff@hospital.org (Clinical Staff)</li>
                  <li>finance-staff@hospital.org (Finance Staff)</li>
                </ul>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-white p-6">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                  alt="Healthcare Document Management"
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center">
                        <span className="text-sm font-medium">1</span>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">Role-based access control for different hospital staff</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center">
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">Document approval workflows with audit trails</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center">
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">Department-specific document organization</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-hospital-100 text-hospital-600 flex items-center justify-center">
                        <span className="text-sm font-medium">4</span>
                      </div>
                      <p className="ml-3 text-sm text-gray-600">Advanced search and filtering capabilities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
