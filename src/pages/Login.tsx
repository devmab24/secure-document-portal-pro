
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // Get the redirect path from location state or default to root
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    // Redirect only after login completes and user is available
    if (user && !isSubmitting) {
      console.log("Already logged in, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, isSubmitting, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        console.log("Login successful, redirecting to:", from);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hospital-100 to-hospital-200 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@hospital.org"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-hospital-600 px-0 h-auto"
                    onClick={() => alert('This is a demo app. Use password: password')}
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-hospital-600 hover:bg-hospital-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Accounts */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>
              Click any email to auto-fill login form. All accounts use password: <strong>"password"</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {/* CMD */}
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Chief Medical Director (CMD)</h4>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-auto p-2"
                onClick={() => quickLogin('cmd@hospital.org')}
              >
                <div className="text-left">
                  <div className="font-medium">cmd@hospital.org</div>
                  <div className="text-xs text-muted-foreground">James Wilson - Admin Dept</div>
                </div>
              </Button>
            </div>

            <Separator />

            {/* Super Admin */}
            <div>
              <h4 className="font-semibold text-purple-600 mb-2">Super Administrator</h4>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-auto p-2"
                onClick={() => quickLogin('superadmin@hospital.org')}
              >
                <div className="text-left">
                  <div className="font-medium">superadmin@hospital.org</div>
                  <div className="text-xs text-muted-foreground">Robert Martinez - IT Dept</div>
                </div>
              </Button>
            </div>

            <Separator />

            {/* System Administrators */}
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">System Administrators</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('admin-general@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">admin-general@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Michael Director - Admin Dept</div>
                  </div>
                </Button>
              </div>
            </div>

            <Separator />

            {/* HODs */}
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Heads of Departments (HODs)</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('radiology-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">radiology-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Sarah Johnson - Radiology</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('dental-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">dental-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Michael Chen - Dental</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('eyeclinic-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">eyeclinic-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Emily Patel - Eye Clinic</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('ae-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">ae-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Grace Thompson - A&E</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('pharmacy-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">pharmacy-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Victoria Adekunle - Pharmacy</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('physio-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">physio-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Sophia Lee - Physiotherapy</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('antenatal-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">antenatal-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Omar Hassan - Antenatal</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('hr-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">hr-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Jennifer Clarke - HR</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('finance-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">finance-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">David Williams - Finance</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('it-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">it-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Lisa Brown - IT</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('admin-hod@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">admin-hod@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Mark Davis - Admin</div>
                  </div>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Staff (Sample) */}
            <div>
              <h4 className="font-semibold text-orange-600 mb-2">Department Staff (Sample)</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('radiology-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">radiology-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Lisa Garcia - Radiology Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('dental-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">dental-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Kevin Zhao - Dental Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('eyeclinic-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">eyeclinic-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Priya Sharma - Eye Clinic Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('ae-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">ae-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Marcus Wilson - A&E Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('pharmacy-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">pharmacy-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Nathan Bakare - Pharmacy Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('physio-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">physio-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">David Okafor - Physiotherapy Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('antenatal-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">antenatal-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Robert Taylor - Antenatal Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('hr-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">hr-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Thomas Anderson - HR Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('finance-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">finance-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">John Miller - Finance Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('it-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">it-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">James Wright - IT Staff</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('admin-staff@hospital.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">admin-staff@hospital.org</div>
                    <div className="text-xs text-muted-foreground">Peter Thompson - Admin Staff</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;



{/* <Button
  variant="ghost"
  className="w-full justify-start text-sm h-auto p-2"
  onClick={() => quickLogin('admin@hospital.org')}
>
  <div className="text-left">
    <div className="font-medium">admin@hospital.org</div>
    <div className="text-xs text-muted-foreground">Alex Morgan - IT Dept</div>
  </div>
</Button> 
<Button
  variant="ghost"
  className="w-full justify-start text-sm h-auto p-2"
  onClick={() => quickLogin('admin-finance@hospital.org')}
>
  <div className="text-left">
    <div className="font-medium">admin-finance@hospital.org</div>
    <div className="text-xs text-muted-foreground">Sarah Tech - Finance Dept</div>
  </div>
</Button> */}
  
  // // Get the redirect path from location state or default to root
  // const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  
  // useEffect(() => {
  //   // If already logged in, redirect
  //   if (user) {
  //     navigate(from, { replace: true });
  //   }
  // }, [user, navigate, from]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!email || !password) {
  //     return;
  //   }
    
  //   setIsSubmitting(true);
  //   try {
  //     const success = await login(email, password);
      
  //     if (success) {
  //       // Added console log for debugging
  //       console.log("Login successful, redirecting to:", from);
  //       navigate(from, { replace: true });
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const quickLogin = (userEmail: string) => {
  //   setEmail(userEmail);
  //   setPassword('password');
  // };