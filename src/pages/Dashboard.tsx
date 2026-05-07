import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { TerminalCard } from "@/components/TerminalCard";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { ALL_LESSONS } from "@/data/curriculum";
import { Link } from "react-router-dom";
import { Trophy, Trash2, Award, CheckCircle2, GitBranch, Activity } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const {
    handle, xp, level, intoLevel, neededForNext,
    completedCount, completed, reset,
  } = useProgress();

  const recent = Object.entries(completed)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([cid, ts]) => {
      const item = ALL_LESSONS.find((l) => l.lesson.challenge.id === cid);
      return item ? { ...item, ts } : null;
    })
    .filter(Boolean) as Array<typeof ALL_LESSONS[number] & { ts: number }>;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="hacker-bg opacity-20" />
      <div className="grid-bg absolute inset-0 opacity-10" />
      
      <SiteHeader />
      
      <main className="container py-8 md:py-12 flex-1 max-w-6xl space-y-8 relative z-10">
        
        {/* TOP PROFILE SECTION */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <TerminalCard variant="primary" className="relative border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-8 p-4">
              <div className="relative">
                <div className="h-28 w-28 rounded-full bg-primary/5 border-2 border-primary/40 flex items-center justify-center text-5xl font-display text-primary shadow-glow animate-pulse-glow">
                  {handle.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-background border border-primary/40 rounded-full p-1.5 shadow-lg">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
                  <h1 className="text-4xl font-display text-foreground tracking-tight">{handle}</h1>
                  <span className="text-xs font-mono text-primary/60 mb-1">SEC_LEVEL_{level}</span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Experience Points</span>
                    <span className="text-xl font-display text-primary text-glow">{xp} XP</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Current Rank</span>
                    <span className="text-xl font-display text-foreground">{level >= 10 ? "ELITE" : "INITIATE"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Streak</span>
                    <span className="text-xl font-display text-orange-500">0 DAYS</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 font-mono text-xs w-full">
                  CONFIGURE_PROFILE
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-foreground/40 hover:text-foreground font-mono text-[10px] uppercase tracking-widest w-full"
                  onClick={() => { if (confirm("Terminate session?")) window.location.reload(); }}
                >
                  DISCONNECT
                </Button>
              </div>
            </div>
          </TerminalCard>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox icon={CheckCircle2} label="Nodes Compromised" value={completedCount} />
          <StatBox icon={GitBranch} label="Active Exploits" value={0} />
          <StatBox icon={Trophy} label="Global Standing" value="#9,241" />
          <StatBox icon={Award} label="Achievements" value={0} />
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.4em] font-mono text-primary/60 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Operational_Log
            </h3>
            <TerminalCard variant="primary" className="min-h-[350px]">
              {recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-6">
                  <div className="p-4 rounded-full bg-primary/5 border border-primary/10">
                    <Target className="h-8 w-8 text-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground font-mono text-sm italic opacity-60">No targets neutralized yet.</p>
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 font-mono">Awaiting deployment instructions...</p>
                  </div>
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono px-10 shadow-glow">
                    <Link to="/rooms">INITIALIZE_TRAINING</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 text-[10px] uppercase tracking-widest text-muted-foreground font-mono border-b border-primary/10 pb-2 px-2">
                    <span>Timestamp</span>
                    <span className="col-span-2">Target Node</span>
                    <span className="text-right">Payload</span>
                  </div>
                  <ul className="space-y-1">
                    {recent.map((r, i) => (
                      <li key={i} className="group flex items-center justify-between p-2 rounded hover:bg-primary/5 transition-colors text-xs font-mono">
                        <span className="text-muted-foreground">[{new Date(r.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                        <Link to={`/room/${r.domain.id}/${r.module.id}`} className="col-span-2 text-primary hover:underline truncate mr-4">
                          {r.lesson.title.toUpperCase()}
                        </Link>
                        <span className="text-secondary text-right">+{r.lesson.challenge.xp} XP</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TerminalCard>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.4em] font-mono text-primary/60 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              Trophy_Vault
            </h3>
            <TerminalCard variant="primary" className="min-h-[350px] flex flex-col items-center justify-center p-8 text-center border-secondary/20">
              <div className="opacity-20 flex flex-col items-center gap-4">
                <Award className="h-16 w-16 text-secondary" />
                <div className="space-y-1">
                  <div className="text-sm font-mono uppercase tracking-widest text-foreground">Vault Locked</div>
                  <div className="text-[10px] font-mono text-muted-foreground">Earn badges to display here</div>
                </div>
              </div>
            </TerminalCard>
          </div>

        </div>

        {/* PROGRESS RESET */}
        <div className="pt-12 flex justify-center">
          <Button
            onClick={() => {
              if (confirm("PURGE ALL DATA? This operation is irreversible.")) reset();
            }}
            variant="ghost"
            size="sm"
            className="text-destructive/20 hover:text-destructive hover:bg-destructive/5 font-mono text-[9px] tracking-[0.3em] uppercase"
          >
            <Trash2 className="h-3 w-3 mr-2" /> SYSTEM_PURGE
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function StatBox({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <TerminalCard className="p-5 border-primary/10 group hover:border-primary/30 transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-primary/5 rounded border border-primary/10 group-hover:border-primary/40 transition-colors">
             <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-display text-primary text-glow group-hover:scale-110 transition-transform">
            {value}
          </div>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] leading-tight">
          {label}
        </div>
      </div>
    </TerminalCard>
  );
}
