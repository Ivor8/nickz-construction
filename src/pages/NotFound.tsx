import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BRAND } from "@/lib/constants";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A]">
      <div className="text-center p-8">
        <img src={BRAND.logo} alt={BRAND.name} className="h-16 mx-auto mb-6 rounded-lg" />
        <h1 className="text-8xl font-bold text-[#F5A623] mb-4">404</h1>
        <p className="text-xl text-white mb-2">Page Not Found</p>
        <p className="text-blue-200 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
