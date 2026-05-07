import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Input } from "@/components/ui/input";
import {
  DOMAINS, CATEGORIES, DIFFICULTY_LEVELS,
  moduleCategory, moduleDifficulty, moduleDuration, moduleXp,
  type Category, type Difficulty,
} from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { Trophy, Users, Search, Filter } from "lucide-react";
import { TerminalCard } from "@/components/TerminalCard";

const diffColor: Record<Difficulty, string> = {
  easy: "text-primary border-primary/20 bg-primary/5",
  medium: "text-secondary border-secondary/20 bg-secondary/5",
  hard: "text-accent border-accent/20 bg-accent/5",
  insane: "text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20 bg-[hsl(var(--warning))]/5",
};

export default function Rooms() {
  const { isSolved } = useProgress();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category>("All");
  const [lvl, setLvl] = useState<string>("All Levels");

  const rooms = useMemo(() => {
    return DOMAINS.flatMap((d) =>
      d.modules.map((m) => ({
        domain: d,
        module: m,
        category: moduleCategory(d.id),
        difficulty: moduleDifficulty(m),
        duration: moduleDuration(m),
        xp: moduleXp(m),
        enrolled: 12000 + (m.id.charCodeAt(0) * 137) % 40000,
        solved: m.lessons.filter((l) => isSolved(l.challenge.id)).length,
        total: m.lessons.length,
      }))
    ).filter((r) => {
      if (cat !== "All" && r.category !== cat) return false;
      if (lvl !== "All Levels" && r.difficulty !== lvl) return false;
      if (q && !(`${r.module.title} ${r.module.tagline}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, cat, lvl, isSolved]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="hacker-bg opacity-10" />
      <div className="grid-bg absolute inset-0 opacity-5" />
      
      <SiteHeader />
      
      <main className="container py-12 md:py-20 flex-1 space-y-12 relative z-10">
        <header className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-primary/60 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Training_Modules
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-tighter leading-none">
            <span className="text-foreground">CYBER </span>
            <span className="text-primary text-glow italic">ARENA</span>
          </h1>
          <p className="text-muted-foreground text-lg font-mono max-w-2xl leading-relaxed">
            Deploy into high-fidelity simulated environments and master the offensive & defensive arts.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="SEARCH_FOR_TARGETS..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-primary/5 border-primary/20 focus-visible:border-primary/60 rounded-lg h-12 pl-12 font-mono uppercase tracking-widest text-[11px]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <Filter className="h-4 w-4 text-primary/40 shrink-0" />
             <div className="flex gap-2">
                {CATEGORIES.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`px-4 py-1.5 text-[9px] font-mono rounded border uppercase tracking-widest transition-all shrink-0 ${
                      cat === c
                        ? "bg-primary text-primary-foreground border-primary shadow-glow-cyan"
                        : "bg-black/5 border-black/10 text-foreground/40 hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <Link
              key={r.module.id}
              to={`/room/${r.domain.id}/${r.module.id}`}
              className="group block relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
              <TerminalCard className="relative h-full flex flex-col p-6 group-hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex items-start justify-between gap-4 mb-6">
                   <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg group-hover:border-primary/40 transition-colors">
                      {/* Using domain-specific icons would be nice, but for now generic icons work */}
                      <Activity className="h-6 w-6 text-primary" />
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] uppercase tracking-widest border px-2 py-0.5 rounded font-mono ${diffColor[r.difficulty]}`}>
                        {r.difficulty}
                      </span>
                   </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                    {r.module.title.toUpperCase()}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed line-clamp-3">
                    {r.module.tagline}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-primary/40" />{Math.floor(r.enrolled / 1000)}K</span>
                    <span className="flex items-center gap-1.5"><Trophy className="h-3 w-3 text-primary/40" />{r.xp} XP</span>
                  </div>
                  <div className="text-[10px] font-mono text-primary group-hover:translate-x-1 transition-transform">
                    DEPLOY_&gt;
                  </div>
                </div>
                
                {r.solved > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-xl overflow-hidden">
                    <div className="h-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" style={{ width: `${(r.solved / r.total) * 100}%` }} />
                  </div>
                )}
              </TerminalCard>
            </Link>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="text-primary/20 text-4xl font-display uppercase tracking-widest">No Results</div>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Refine your search parameters and try again.</p>
          </div>
        )}
      </main>
      
      <SiteFooter />
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}
