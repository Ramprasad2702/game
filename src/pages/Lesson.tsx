import { Link, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { TerminalCard } from "@/components/TerminalCard";
import { findLesson } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, Flag, Lightbulb, Zap, X } from "lucide-react";
import { toast } from "sonner";

export default function LessonPage() {
  const { domainId = "", moduleId = "", lessonId = "" } = useParams();
  const found = findLesson(domainId, moduleId, lessonId);
  const { submitFlag, isSolved } = useProgress();
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);

  const solved = found ? isSolved(found.lesson.challenge.id) : false;

  const nextLesson = useMemo(() => {
    if (!found) return null;
    const { module, lesson } = found;
    const idx = module.lessons.findIndex((l) => l.id === lesson.id);
    return module.lessons[idx + 1] ?? null;
  }, [found]);

  if (!found) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container py-20 text-center">
          <p className="text-destructive">404 // lesson not found</p>
          <Link to="/modules" className="text-primary underline mt-4 inline-block">back to catalog</Link>
        </main>
      </div>
    );
  }

  const { domain, module, lesson } = found;
  const challenge = lesson.challenge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const result = submitFlag(challenge.id, input, challenge.flag, challenge.xp);
    if (result.ok) {
      if (result.alreadySolved) {
        toast.success("Flag accepted (already solved).");
      } else {
        toast.success(`+${challenge.xp} XP — flag captured!`, {
          description: "Nice work, operator.",
        });
      }
      setInput("");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error("Incorrect flag.", { description: "Re-read the brief. The hint awaits." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container py-10 flex-1 space-y-6 max-w-4xl">
        <Link
          to={`/modules/${domain.id}/${module.id}`}
          className="inline-flex items-center text-xs text-muted-foreground hover:text-primary uppercase tracking-widest"
        >
          <ArrowLeft className="h-3 w-3 mr-1" /> back to {module.title}
        </Link>

        <header className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            DOMAIN_{domain.code} / {module.title}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl md:text-5xl text-primary text-glow">{lesson.title}</h1>
            {solved && <CheckCircle2 className="h-8 w-8 text-primary text-glow" />}
          </div>
          <p className="text-muted-foreground">{lesson.summary}</p>
        </header>

        <TerminalCard title="briefing.md" variant="secondary">
          <div className="prose-invert space-y-3 text-sm leading-relaxed">
            {lesson.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-foreground/90 whitespace-pre-wrap font-mono">
                {para.split(/(`[^`]+`)/g).map((seg, j) =>
                  seg.startsWith("`") && seg.endsWith("`") ? (
                    <code key={j} className="bg-muted text-primary px-1 py-0.5 rounded-sm border border-primary/20">
                      {seg.slice(1, -1)}
                    </code>
                  ) : (
                    <span key={j}>{seg}</span>
                  )
                )}
              </p>
            ))}
          </div>
        </TerminalCard>

        <TerminalCard title="challenge.exec" variant="accent">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Flag className="h-4 w-4 text-accent" />
              <h2 className="font-display text-2xl text-accent text-glow-magenta">{challenge.title}</h2>
              <span className="ml-auto text-[10px] uppercase tracking-widest border border-primary/40 text-primary px-1.5 py-0.5 inline-flex items-center gap-1">
                <Zap className="h-2.5 w-2.5" /> {challenge.xp} XP
              </span>
            </div>

            <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {challenge.prompt}
            </p>

            <form onSubmit={handleSubmit} className={`space-y-2 ${shake ? "animate-pulse" : ""}`}>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Submit flag
              </label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-input border border-primary/40 focus-within:border-primary focus-within:shadow-glow transition-all">
                  <span className="px-2 text-primary font-mono text-sm">$</span>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="nullbyte{...}"
                    className="border-0 bg-transparent focus-visible:ring-0 font-mono text-primary placeholder:text-muted-foreground/40"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono uppercase tracking-widest shadow-glow"
                >
                  Submit
                </Button>
              </div>
            </form>

            {challenge.hint && (
              <div>
                {showHint ? (
                  <div className="border border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/5 p-3 text-xs flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-[hsl(var(--warning))] shrink-0 mt-0.5" />
                    <div className="flex-1 text-[hsl(var(--warning))] font-mono">
                      <span className="opacity-60">hint &gt;</span> {challenge.hint}
                    </div>
                    <button onClick={() => setShowHint(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-xs uppercase tracking-widest text-muted-foreground hover:text-[hsl(var(--warning))] inline-flex items-center gap-1"
                  >
                    <Lightbulb className="h-3 w-3" /> reveal hint
                  </button>
                )}
              </div>
            )}
          </div>
        </TerminalCard>

        {solved && nextLesson && (
          <div className="text-right">
            <Button asChild variant="outline" className="border-secondary/60 text-secondary hover:bg-secondary/10 hover:text-secondary font-mono uppercase tracking-widest">
              <Link to={`/lesson/${domain.id}/${module.id}/${nextLesson.id}`}>
                Next: {nextLesson.title} →
              </Link>
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
