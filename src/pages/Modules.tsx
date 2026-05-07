import { Link } from "react-router-dom";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { TerminalCard } from "@/components/TerminalCard";
import { DOMAINS } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { CheckCircle2, ChevronRight } from "lucide-react";

const variantText = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  warning: "text-[hsl(var(--warning))]",
};

export default function Modules() {
  const { isSolved } = useProgress();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container py-12 flex-1 space-y-16">
        <header>
          <div className="text-xs uppercase tracking-[0.3em] text-secondary text-glow-cyan">// catalog</div>
          <h1 className="font-display text-5xl md:text-6xl text-primary text-glow mt-1">ATTACK MODULES</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Pick your weapon. Each module is a focused capability — drill it until the flag falls.
          </p>
        </header>

        {DOMAINS.map((domain) => (
          <section key={domain.id} id={domain.id} className="space-y-5">
            <div className="flex items-end justify-between border-b border-primary/20 pb-2">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  DOMAIN_{domain.code}
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-foreground">{domain.title}</h2>
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">{domain.blurb}</div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domain.modules.map((m) => {
                const solvedCount = m.lessons.filter((l) => isSolved(l.challenge.id)).length;
                const total = m.lessons.length;
                const pct = (solvedCount / total) * 100;
                return (
                  <Link key={m.id} to={`/modules/${domain.id}/${m.id}`} className="block group">
                    <TerminalCard title={m.id} variant={m.color} className="h-full">
                      <div className="space-y-3">
                        <div>
                          <h3 className={`font-display text-2xl ${variantText[m.color]} group-hover:text-glow transition-all`}>
                            {m.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{m.tagline}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                            <span className="text-muted-foreground">Progress</span>
                            <span className={variantText[m.color]}>{solvedCount}/{total}</span>
                          </div>
                          <div className="h-1 bg-muted overflow-hidden">
                            <div
                              className={`h-full ${
                                m.color === "primary" ? "bg-primary" :
                                m.color === "secondary" ? "bg-secondary" :
                                m.color === "accent" ? "bg-accent" : "bg-[hsl(var(--warning))]"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <ul className="space-y-1 text-xs">
                          {m.lessons.map((l) => (
                            <li key={l.id} className="flex items-center gap-1.5">
                              {isSolved(l.challenge.id) ? (
                                <CheckCircle2 className="h-3 w-3 text-primary" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              )}
                              <span className={isSolved(l.challenge.id) ? "text-primary line-through" : "text-muted-foreground"}>
                                {l.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TerminalCard>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
