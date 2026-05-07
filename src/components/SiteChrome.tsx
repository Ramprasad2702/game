import { Link } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { handle } = useProgress();

  return (
    <>
      <div className="scanline-effect" />
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/20 rounded blur group-hover:bg-primary/40 transition duration-300"></div>
              <div className="relative bg-primary px-2 py-1 rounded font-display text-xs text-primary-foreground font-bold">
                NB
              </div>
            </div>
            <span className="font-display text-xl tracking-[0.1em] text-white">
              NULL<span className="text-primary text-glow">BYTE</span>
            </span>
          </Link>

          {/* CENTER NAV */}
          <nav className="hidden md:flex items-center gap-10">
            {["Rooms", "Paths", "Leaderboard"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-[10px] font-bold font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all hover:translate-y-[-1px]"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hidden md:block text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-white transition-all">
              {handle.toUpperCase()}
            </Link>
            <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 font-mono text-[10px] px-6 uppercase tracking-widest shadow-glow-cyan h-8">
              Sign Out
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/10 mt-20 bg-black/20">
      <div className="container py-10 text-[10px] font-mono text-muted-foreground/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="text-primary opacity-50">$</span>
          <span className="animate-pulse">_</span>
          <span>STAY_CURIOUS. STAY_LEGAL.</span>
        </div>
        <div className="uppercase tracking-[0.4em] text-[9px] text-center md:text-right max-w-md leading-relaxed opacity-40">
          // educational simulations only — all targets are virtualized environments //
        </div>
      </div>
    </footer>
  );
}
