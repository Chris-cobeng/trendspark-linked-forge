
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-linkedBlue mb-4">404</h1>
        <p className="text-xl text-grayScale-500 mb-6">Oops! This page doesn't exist</p>
        <p className="text-grayScale-400 mb-8">The page you're looking for isn't available. Return to the dashboard to continue crafting amazing LinkedIn content.</p>
        <Button asChild className="gradient-btn hover-scale">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
