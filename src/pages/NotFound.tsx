import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <div className="font-display text-[10rem] leading-none text-primary text-glow">404</div>
      <p className="font-mono text-sm text-muted-foreground">
        <span className="text-destructive">[err]</span> segment {location.pathname} not mapped
      </p>
      <a href="/" className="mt-6 border border-primary text-primary px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-primary/10 shadow-glow">
        ← return to base
      </a>
    </div>
  );
};

export default NotFound;
