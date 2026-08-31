import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardRoute } from "@/lib/roleRoutes";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const homeTo = user ? getDashboardRoute(user.role) : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        <p className="text-sm text-muted-foreground break-all">
          {location.pathname}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild>
            <Link to={homeTo}>{user ? "Go to my dashboard" : "Go to login"}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
