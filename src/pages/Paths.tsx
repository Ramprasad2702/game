import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { TerminalCard } from "@/components/TerminalCard";
import { DOMAINS } from "@/data/curriculum";
import { Link } from "react-router-dom";
import { ChevronRight, Target, Shield, Zap, Lock } from "lucide-react";

const pathIcons: Record<string, any> = {
  recon: Target,
  injection: Zap,
  auth: Shield,
  advanced: Lock,
};

export default function Paths() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="hacker-bg opacity-10" />
      <div className="grid-bg absolute inset-0 opacity-5" />
      
      <SiteHeader />
      
      <main className="container py-12 md:py-20 flex-1 space-y-12 relative z-10">
        <header className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-primary/60 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Learning_Pathways
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-tighter leading-none">
            <span className="text-foreground">SKILL </span>
            <span className="text-primary text-glow italic">PATHS</span>
          </h1>
          <p className="text-muted-foreground text-lg font-mono max-w-2xl leading-relaxed">
            Curated sequences of labs designed to take you from zero to domain mastery.
          </p>
        </header>

        <div className="space-y-8">
          {DOMAINS.map((domain) => {
            const Icon = pathIcons[domain.id] || Target;
            return (
              <div key={domain.id} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-lg"></div>
                <TerminalCard className="relative p-0 overflow-hidden group-hover:border-primary/30 transition-all">
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className="md:w-64 bg-primary/5 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                       <div className="p-4 rounded-full bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                          <Icon className="h-10 w-10 text-primary" />
                       </div>
                       <div className="mt-4 text-[10px] font-mono text-primary uppercase tracking-widest font-bold">
                         Domain_{domain.code}
                       </div>
                    </div>
                    
                    <div className="flex-1 p-8 space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-display text-foreground group-hover:text-primary transition-colors tracking-tight">
                          {domain.title.toUpperCase()}
                        </h2>
                        <p className="text-sm text-muted-foreground font-mono leading-relaxed max-w-2xl">
                          {domain.blurb}
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {domain.modules.map((m) => (
                          <Link
                            key={m.id}
                            to={`/room/${domain.id}/${m.id}`}
                            className="flex items-center justify-between p-3 rounded bg-black/5 border border-black/5 hover:border-primary/40 hover:bg-primary/5 transition-all group/item"
                          >
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground group-hover/item:text-foreground truncate">
                              {m.title}
                            </span>
                            <ChevronRight className="h-3 w-3 text-primary/40 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="md:w-48 p-8 flex flex-col justify-center items-center md:items-end bg-primary/[0.02]">
                       <div className="text-right">
                          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Status</div>
                          <div className="text-sm font-mono text-primary font-bold uppercase tracking-widest">Incomplete</div>
                       </div>
                       <Link 
                         to={`/room/${domain.id}/${domain.modules[0].id}`}
                         className="mt-6 px-6 py-2 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-[0.2em] font-bold rounded shadow-glow-cyan hover:translate-y-[-2px] transition-all"
                       >
                         RESUME
                       </Link>
                    </div>
                  </div>
                </TerminalCard>
              </div>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
