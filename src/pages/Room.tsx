import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { findModule, moduleDifficulty, moduleXp } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, Trophy, Lightbulb, BookOpen, FlaskConical, Flag } from "lucide-react";
import { LabSandbox } from "@/components/LabSandbox";
import { toast } from "sonner";

export default function Room() {
  const { domainId = "", moduleId = "" } = useParams();
  const found = findModule(domainId, moduleId);
  const { submitFlag, isSolved } = useProgress();
  const [hintOpen, setHintOpen] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  if (!found) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container py-20 text-center">
          <p className="text-destructive">404 // room not found</p>
          <Link to="/rooms" className="text-primary underline mt-4 inline-block">back to rooms</Link>
        </main>
      </div>
    );
  }

  const { module } = found;
  const diff = moduleDifficulty(module);
  const totalXp = moduleXp(module);

  const handleSubmit = (lessonId: string, challengeId: string, expected: string, xp: number) => {
    const value = inputs[lessonId] ?? "";
    if (!value.trim()) return;
    const r = submitFlag(challengeId, value, expected, xp);
    if (r.ok) {
      toast.success(r.alreadySolved ? "Already solved." : `+${xp} XP — flag captured!`);
      setInputs((s) => ({ ...s, [lessonId]: "" }));
    } else {
      toast.error("Incorrect flag.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container py-8 flex-1 space-y-6 max-w-5xl">
        <Link to="/rooms" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary font-mono">
          <ArrowLeft className="h-4 w-4 mr-1" /> All rooms
        </Link>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
              {module.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-primary text-glow">{module.title.split(" ").slice(-1)}</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-mono">{module.tagline}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full border border-primary/40 text-primary text-sm font-mono capitalize">
              {diff}
            </span>
            <span className="px-3 py-1 rounded-full border border-secondary/40 text-secondary text-sm font-mono inline-flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> {totalXp} pts
            </span>
          </div>
        </header>

        <div className="text-xs font-mono text-muted-foreground border border-primary/20 bg-card/40 rounded p-3">
          How this room works → <span className="text-primary">1. Learn</span> the concept ·{" "}
          <span className="text-primary">2. Practice</span> in the lab below ·{" "}
          <span className="text-primary">3. Submit</span> the flag.
        </div>

        <div className="space-y-6">
          {module.lessons.map((lesson, idx) => {
            const solved = isSolved(lesson.challenge.id);
            return (
              <article
                key={lesson.id}
                className={`border rounded-lg bg-card/40 transition-all ${
                  solved ? "border-primary/60 bg-primary/5" : "border-primary/20"
                }`}
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-primary/10 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">Task {idx + 1} · {lesson.difficulty}</div>
                    <h3 className="font-display text-2xl text-foreground flex items-center gap-2 mt-0.5">
                      {lesson.title}
                      {solved && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">{lesson.summary}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-[11px] font-mono text-secondary border border-secondary/40 shrink-0">
                    {lesson.challenge.xp} XP
                  </span>
                </div>

                {/* Learn */}
                <section className="px-5 py-4 border-b border-primary/10">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary mb-2">
                    <BookOpen className="h-3.5 w-3.5" /> Learn
                  </div>
                  <pre className="text-sm text-foreground/85 whitespace-pre-wrap font-mono leading-relaxed">
                    {lesson.content}
                  </pre>
                </section>

                {/* Practice */}
                {lesson.lab && (
                  <section className="px-5 py-4 border-b border-primary/10">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary mb-2">
                      <FlaskConical className="h-3.5 w-3.5" /> Practice
                    </div>
                    <LabSandbox config={lesson.lab} />
                  </section>
                )}

                {/* Submit */}
                <section className="px-5 py-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary mb-2">
                    <Flag className="h-3.5 w-3.5" /> Challenge
                  </div>
                  <p className="text-sm text-foreground/85 font-mono leading-relaxed whitespace-pre-wrap">
                    {lesson.challenge.prompt}
                  </p>

                  {lesson.challenge.hint && (
                    <>
                      <button
                        onClick={() => setHintOpen((s) => ({ ...s, [lesson.id]: !s[lesson.id] }))}
                        className="mt-2 text-xs text-[hsl(var(--warning))] hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <Lightbulb className="h-3 w-3" />
                        {hintOpen[lesson.id] ? "Hide" : "Show"} hint
                      </button>
                      {hintOpen[lesson.id] && (
                        <div className="mt-1 text-xs text-[hsl(var(--warning))] font-mono opacity-80">
                          Hint: {lesson.challenge.hint}
                        </div>
                      )}
                    </>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(lesson.id, lesson.challenge.id, lesson.challenge.flag, lesson.challenge.xp);
                    }}
                    className="mt-3 flex gap-2"
                  >
                    <Input
                      placeholder="nullbyte{...}"
                      value={inputs[lesson.id] ?? ""}
                      onChange={(e) => setInputs((s) => ({ ...s, [lesson.id]: e.target.value }))}
                      className="bg-input border-primary/30 font-mono text-sm"
                      disabled={solved}
                    />
                    <Button
                      type="submit"
                      disabled={solved}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono shadow-glow"
                    >
                      {solved ? "Solved" : "Submit"}
                    </Button>
                  </form>
                </section>
              </article>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
