
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { UserRole } from '@/lib/types';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); 

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
        case UserRole.CMAC:
            return '/dashboard/cmac';
        case UserRole.HEAD_OF_NURSING:
            return '/dashboard/head-of-nursing';
        case UserRole.REGISTRY:
            return '/dashboard/registry';
        case UserRole.DIRECTOR_ADMIN:
            return '/dashboard/director-admin';
        case UserRole.CHIEF_ACCOUNTANT:
            return '/dashboard/chief-accountant';
        case UserRole.CHIEF_PROCUREMENT_OFFICER:
            return '/dashboard/chief-procurement';
        case UserRole.MEDICAL_RECORDS_OFFICER:
            return '/dashboard/medical-records';
        default:
            return '/dashboard/staff';
        }
    };

    // Get the redirect path from location state or default to root
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    useEffect(() => {
        if (user && !isSubmitting) {
        console.log("User authenticated, redirecting user with role:", user.role);
        // If user came from a protected route, go there, otherwise go to their dashboard
        const redirectTo = from !== '/' ? from : getDashboardRoute(user.role);
        console.log("Redirecting to:", redirectTo);
        navigate(redirectTo, { replace: true });
        }
    }, [user, navigate, isSubmitting, from]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
        return;
        }

        setIsSubmitting(true);
        try {
            const success = await login(email, password);
            if (success) {
                // console.log("Login successful, redirecting to:", from);
                // navigate(from, { replace: true });
                console.log("Login successful. Waiting for AuthContext to set user...");
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
            <div className="w-full max-w-md mx-auto">
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

                {/* Demo Accounts Removed*/}
            </div>
        </div>
    );
};

export default Login;