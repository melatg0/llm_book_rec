import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-tl from-amber-warm/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="text-center relative z-10 animate-fade-in">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-scale-in">
            404
          </h1>
        </div>

        {/* Main content */}
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The page you're looking for doesn't exist. Let's get you back to discovering amazing books!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-hero hover:shadow-glow transition-all duration-300 button-press"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="hover-lift transition-smooth"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Books
            </Button>
          </div>

          {/* Additional help */}
          <div className="pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for something specific?
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/'}
              className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
              <Search className="w-4 h-4 mr-2" />
              Search for books
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
