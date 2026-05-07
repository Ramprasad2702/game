import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Trophy, Crosshair, Globe, Activity } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { TerminalCard } from "@/components/TerminalCard";
import { Button } from "@/components/ui/button";
import { DOMAINS, ALL_LESSONS, TOTAL_XP_AVAILABLE } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { useEffect, useState } from "react";

const BANNER = String.raw`
 ███▄    █  █    ██  ██▓     ██▓     ▄▄▄▄ ▓██   ██▓▄▄▄█████▓▓█████
 ██ ▀█   █  ██  ▓██▒▓██▒    ▓██▒    ▓█████▄▒██  ██▒▓  ██▒ ▓▒▓█   ▀
▓██  ▀█ ██▒▓██  ▒██░▒██░    ▒██░    ▒██▒ ▄██▒██ ██░▒ ▓██░ ▒░▒███
▓██▒  ▐▌██▒▓▓█  ░██░▒██░    ▒██░    ▒██░█▀  ░ ▐██▓░░ ▓██▓ ░ ▒▓█  ▄
▒██░   ▓██░▒▒█████▓ ░██████▒░██████▒░▓█  ▀█▓░ ██▒▓░  ▒██▒ ░ ░▒████▒
░ ▒░   ▒ ▒ ░▒▓▒ ▒ ▒ ░ ▒░▓  ░░ ▒░▓  ░░▒▓███▀▒ ██▒▒▒   ▒ ░░   ░░ ▒░ ░
`;

export default function Index() {
  const { xp, level, completedCount, totalLessons } = useProgress();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  const stats = [
    { label: "Domains", value: DOMAINS.length },
    { label: "Modules", value: DOMAINS.reduce((s, d) => s + d.modules.length, 0) },
    { label: "Challenges", value: ALL_LESSONS.length },
    { label: "Total XP", value: TOTAL_XP_AVAILABLE },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="hacker-bg opacity-20" />
      <div className="grid-bg absolute inset-0 opacity-10" />
      
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] text-primary font-mono shadow-glow-cyan animate-pulse">
                <Activity className="h-3 w-3" />
                SYSTEM_LIVE // NODE_{tick}
              </div>
              
              <div className="space-y-4">
                <h1 className="font-display text-6xl md:text-8xl leading-none tracking-tighter">
                  <span className="text-foreground">BREAK </span>
                  <span className="text-primary text-glow italic">THE </span>
                  <span className="block text-foreground/90">PERIMETER</span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground max-w-2xl font-mono leading-relaxed">
                  The ultimate playground for offensive security. Master 
                  <span className="text-primary"> {DOMAINS.length} domains</span> and 
                  <span className="text-primary"> {ALL_LESSONS.length}+ challenges </span> 
                  using high-fidelity industry tools.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-mono uppercase tracking-[0.2em] text-xs h-14 px-8">
                  <Link to="/rooms">
                    INITIALIZE_HUNT <ArrowRight className="ml-3 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-black/10 text-foreground/60 hover:border-primary/40 hover:text-foreground font-mono uppercase tracking-[0.2em] text-xs h-14 px-8 bg-black/5">
                  <Link to="/paths">VIEW_PATHWAYS</Link>
                </Button>
              </div>

              {(xp > 0 || completedCount > 0) && (
                <div className="text-[10px] text-primary/60 font-mono uppercase tracking-widest border-l-2 border-primary/40 pl-4 py-1">
                  OPERATOR_IDENTIFIED: <span className="text-foreground">LEVEL_{level}</span> // <span className="text-foreground">{xp}_XP</span> // <span className="text-foreground">{completedCount}/{totalLessons}_FLAGS</span>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-2xl group-hover:bg-primary/30 transition duration-1000"></div>
              <TerminalCard title="kernel_boot.log" variant="primary" className="relative shadow-2xl">
                <pre className="text-[7px] sm:text-[9px] leading-[1.1] text-primary/80 text-glow whitespace-pre overflow-hidden mb-6">
{BANNER}
                </pre>
                <div className="space-y-2 text-[10px] font-mono border-t border-primary/10 pt-4">
                  <div className="flex gap-2"><span className="text-primary/40">$</span><span className="text-foreground">./mount_payloads --target=all</span></div>
                  <div className="text-secondary/80 italic">[SEC] decrypting challenge_vault...</div>
                  <div className="text-secondary/80 italic">[SEC] establishing secure_tunnel...</div>
                  <div className="text-primary font-bold mt-2 flex items-center gap-2">
                     <span className="h-1 w-1 bg-primary rounded-full animate-ping" />
                     SYSTEM_READY. HAPPY_HUNTING.
                  </div>
                </div>
              </TerminalCard>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-primary/10 bg-black/40 backdrop-blur-md relative z-10">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center space-y-1">
              <div className="font-display text-4xl md:text-6xl text-primary text-glow">{s.value}</div>
              <div className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/60 font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DOMAINS SECTION */}
      <section className="container py-24 md:py-32 relative z-10">
        <div className="mb-16 space-y-4">
          <div className="text-[10px] uppercase tracking-[0.4em] text-secondary font-mono flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            Mission_Directives
          </div>
          <h2 className="font-display text-5xl md:text-7xl text-foreground tracking-tighter leading-none">
            CHOOSE YOUR <span className="text-primary italic">VECTOR</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {DOMAINS.map((d, i) => {
            const icons = [Crosshair, Zap, Shield, Globe];
            const Icon = icons[i] ?? Crosshair;
            return (
              <Link key={d.id} to="/paths" className="group">
                <TerminalCard className="h-full hover:translate-y-[-4px] transition-all duration-300">
                  <div className="flex items-start gap-6 p-2">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 group-hover:border-primary/40 transition-colors">
                       <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="font-mono text-[9px] text-primary/60 uppercase tracking-widest mb-1">Vector_0{i+1}</div>
                        <h3 className="font-display text-3xl text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                          {d.title.toUpperCase()}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono leading-relaxed line-clamp-2">
                        {d.blurb}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {d.modules.slice(0, 3).map((m) => (
                          <span key={m.id} className="text-[9px] uppercase tracking-widest bg-black/5 border border-black/10 px-2 py-1 text-foreground/40 rounded">
                            {m.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TerminalCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="container pb-32 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "ACTIVE_LEARNING", body: "Every module concludes with a live flag capture. Practicality is our only metric.", color: "primary" as const },
            { icon: Trophy, title: "HIERARCHY_PROGRESS", body: "Ascend from script-kiddie to zero-day researcher. Build a verified security profile.", color: "primary" as const },
            { icon: Shield, title: "ELITE_CURRICULUM", body: "Designed around real-world bug bounty playbooks and advanced penetration testing.", color: "primary" as const },
          ].map((f) => (
            <TerminalCard key={f.title} className="p-8 text-center space-y-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-2xl text-foreground tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">{f.body}</p>
              </div>
            </TerminalCard>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
