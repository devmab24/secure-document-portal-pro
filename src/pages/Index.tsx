
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Shield, Users, Zap } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect authenticated users to their appropriate dashboard
      switch (user.role) {
        case 'SUPER_ADMIN':
          navigate('/dashboard/super-admin');
          break;
        case 'ADMIN':
          navigate('/dashboard/admin');
          break;
        case 'CMD':
          navigate('/dashboard/cmd');
          break;
        case 'HOD':
          navigate('/dashboard/hod');
          break;
        case 'STAFF':
          navigate('/dashboard/staff');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hospital-50 to-hospital-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-hospital-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FMC Jalingo</h1>
                <p className="text-sm text-gray-600">Document Management System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-hospital-600 hover:bg-hospital-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your
            <span className="text-hospital-600 block">Document Workflow</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive document management system designed for Federal Medical Centre Jalingo. 
            Manage forms, track approvals, and enhance collaboration across all departments.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-hospital-600 hover:bg-hospital-700 text-lg px-8 py-3"
          >
            Start Managing Documents
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Document Management
            </h3>
            <p className="text-lg text-gray-600">
              Built specifically for healthcare institutions with role-based access and workflow automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-hospital-200 transition-colors">
              <CardHeader>
                <FileText className="h-12 w-12 text-hospital-600 mb-4" />
                <CardTitle>Digital Forms</CardTitle>
                <CardDescription>
                  Create, fill, and submit digital forms with automated routing and approval workflows.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-hospital-200 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-hospital-600 mb-4" />
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Secure access control with different permission levels for CMD, HODs, Staff, and Administrators.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-hospital-200 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-hospital-600 mb-4" />
                <CardTitle>Department Collaboration</CardTitle>
                <CardDescription>
                  Seamless communication and document sharing between departments with tracking and notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-hospital-200 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-hospital-600 mb-4" />
                <CardTitle>Automated Workflows</CardTitle>
                <CardDescription>
                  Streamlined approval processes with automatic routing based on document type and department.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-hospital-200 transition-colors">
              <CardHeader>
                <FileText className="h-12 w-12 text-hospital-600 mb-4" />
                <CardTitle>Document Tracking</CardTitle>
                <CardDescription>
                  Real-time status updates and audit trails for all document movements and approvals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-hospital-200 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-hospital-600 mb-4" />
                <CardTitle>Secure Storage</CardTitle>
                <CardDescription>
                  Enterprise-grade security with encrypted storage and backup for all your important documents.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hospital-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Document Management?
          </h3>
          <p className="text-xl text-hospital-100 mb-8 max-w-2xl mx-auto">
            Join FMC Jalingo's digital transformation with our comprehensive document management solution.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="text-lg px-8 py-3"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Federal Medical Centre Jalingo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
