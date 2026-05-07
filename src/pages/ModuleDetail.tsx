import { Link, useParams } from "react-router-dom";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { TerminalCard } from "@/components/TerminalCard";
import { findModule } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { ArrowLeft, CheckCircle2, Lock, Zap } from "lucide-react";

const difficultyColor = {
  easy: "text-primary border-primary/40",
  medium: "text-secondary border-secondary/40",
  hard: "text-accent border-accent/40",
  insane: "text-[hsl(var(--warning))] border-[hsl(var(--warning))]/40",
};

export default function ModuleDetail() {
  const { domainId = "", moduleId = "" } = useParams();
  const found = findModule(domainId, moduleId);
  const { isSolved } = useProgress();

  if (!found) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container py-20 text-center">
          <p className="text-destructive">404 // module not found</p>
          <Link to="/modules" className="text-primary underline mt-4 inline-block">back to catalog</Link>
        </main>
      </div>
    );
  }

  const { domain, module } = found;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container py-10 flex-1 space-y-8">
        <Link to="/modules" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary uppercase tracking-widest">
          <ArrowLeft className="h-3 w-3 mr-1" /> back to modules
        </Link>

        <header className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            DOMAIN_{domain.code} / {module.id}
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-primary text-glow">{module.title}</h1>
          <p className="text-muted-foreground">{module.tagline}</p>
        </header>

        <div className="grid gap-4">
          {module.lessons.map((lesson, idx) => {
            const solved = isSolved(lesson.challenge.id);
            return (
              <Link
                key={lesson.id}
                to={`/lesson/${domain.id}/${module.id}/${lesson.id}`}
                className="block group"
              >
                <TerminalCard title={`lesson_${String(idx + 1).padStart(2, "0")}`} variant={module.color}>
                  <div className="flex items-start gap-4">
                    <div className="font-display text-4xl text-muted-foreground/40 group-hover:text-primary transition-colors w-10 text-center">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                          {lesson.title}
                        </h3>
                        <span className={`text-[10px] uppercase tracking-widest border px-1.5 py-0.5 ${difficultyColor[lesson.difficulty]}`}>
                          {lesson.difficulty}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest border border-primary/40 text-primary px-1.5 py-0.5 inline-flex items-center gap-1">
                          <Zap className="h-2.5 w-2.5" /> {lesson.challenge.xp} xp
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{lesson.summary}</p>
                    </div>
                    <div className="self-center">
                      {solved ? (
                        <CheckCircle2 className="h-6 w-6 text-primary text-glow" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </TerminalCard>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
