
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STAFF);
  const [department, setDepartment] = useState('Administration');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  
  const departments = [
    'Administration', 'IT', 'Finance', 'HR', 'Radiology', 'Dental',
    'Eye Clinic', 'Accident & Emergency', 'Pharmacy', 'Physiotherapy', 'Antenatal'
  ];

  // Helper function to get dashboard route based on user role
  const getDashboardRoute = (userRole: UserRole) => {
    switch (userRole) {
      case UserRole.CMD:
        return '/dashboard/cmd';
      case UserRole.HOD:
        return '/dashboard/hod';
      case UserRole.ADMIN:
        return '/dashboard/admin';
      case UserRole.SUPER_ADMIN:
        return '/dashboard/super-admin';
      case UserRole.STAFF:
        return '/dashboard/staff';
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    if (user && !isSubmitting) {
      console.log("Already logged in, redirecting user with role:", user.role);
      // If user came from a protected route, go there, otherwise go to their dashboard
      const redirectTo = from !== '/' ? from : getDashboardRoute(user.role);
      navigate(redirectTo, { replace: true });
    }
  }, [user, isSubmitting, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        // Note: The redirect will happen automatically in useEffect when user state updates
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) return;

    // Temporarily commented out organizational email validation for development
    // Allow Gmail addresses for testing
    // if (!email.endsWith('@fmcjalingo.org')) {
    //   toast({
    //     title: "Invalid Email",
    //     description: "Please use your organizational email (@fmcjalingo.org)",
    //     variant: "destructive"
    //   });
    //   return;
    // }

    setIsSubmitting(true);
    try {
      const result = await signup(email, password, {
        firstName,
        lastName,
        role,
        department
      });
      
      if (result.success) {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Signup Failed",
          description: result.error || "Failed to create account",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    // Update quick login to use Gmail addresses for testing
    const gmailEmail = userEmail.replace('@fmcjalingo.org', '@gmail.com');
    setEmail(gmailEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hospital-100 to-hospital-200 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auth Forms */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">FMC Jalingo</CardTitle>
            <CardDescription className="text-center">
              Document Management System
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      placeholder="name@gmail.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
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
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      placeholder="name@gmail.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                        <SelectItem value={UserRole.HOD}>HOD</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                        <SelectItem value={UserRole.CMD}>CMD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-hospital-600 hover:bg-hospital-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Test Users Quick Login */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Test Users (Development)</CardTitle>
            <CardDescription>
              Click any email to auto-fill login form. Password: <strong>password123</strong>
              <br /><small className="text-muted-foreground">Note: Using @gmail.com for testing</small>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h4 className="font-semibold text-red-600 mb-2">CMD</h4>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-auto p-2"
                onClick={() => quickLogin('cmd@fmcjalingo.org')}
              >
                <div className="text-left">
                  <div className="font-medium">cmd@gmail.com</div>
                  <div className="text-xs text-muted-foreground">James Wilson</div>
                </div>
              </Button>
            </div>

            <div>
              <h4 className="font-semibold text-purple-600 mb-2">Super Admin</h4>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-auto p-2"
                onClick={() => quickLogin('superadmin@fmcjalingo.org')}
              >
                <div className="text-left">
                  <div className="font-medium">superadmin@gmail.com</div>
                  <div className="text-xs text-muted-foreground">Robert Martinez</div>
                </div>
              </Button>
            </div>

            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Admin</h4>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-auto p-2"
                onClick={() => quickLogin('admin@fmcjalingo.org')}
              >
                <div className="text-left">
                  <div className="font-medium">admin@gmail.com</div>
                  <div className="text-xs text-muted-foreground">Michael Director</div>
                </div>
              </Button>
            </div>

            <div>
              <h4 className="font-semibold text-green-600 mb-2">HODs</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('radiology.hod@fmcjalingo.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">radiology.hod@gmail.com</div>
                    <div className="text-xs text-muted-foreground">Sarah Johnson - Radiology</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('dental.hod@fmcjalingo.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">dental.hod@gmail.com</div>
                    <div className="text-xs text-muted-foreground">Michael Chen - Dental</div>
                  </div>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-orange-600 mb-2">Staff</h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('radiology.staff@fmcjalingo.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">radiology.staff@gmail.com</div>
                    <div className="text-xs text-muted-foreground">Lisa Garcia - Radiology</div>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => quickLogin('dental.staff@fmcjalingo.org')}
                >
                  <div className="text-left">
                    <div className="font-medium">dental.staff@gmail.com</div>
                    <div className="text-xs text-muted-foreground">Kevin Zhao - Dental</div>
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

export default Auth;
