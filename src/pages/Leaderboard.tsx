import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { useProgress } from "@/hooks/useProgress";
import { Trophy } from "lucide-react";

const MOCK = [
  { handle: "r00tw1zard", xp: 14820, country: "🇩🇪" },
  { handle: "byteflip", xp: 12110, country: "🇯🇵" },
  { handle: "hexqueen", xp: 10870, country: "🇧🇷" },
  { handle: "neoshell", xp: 9240, country: "🇺🇸" },
  { handle: "ph4nt0m", xp: 8120, country: "🇮🇳" },
  { handle: "0xnova", xp: 7430, country: "🇰🇷" },
  { handle: "smolpwn", xp: 6210, country: "🇨🇦" },
  { handle: "subzero", xp: 5390, country: "🇫🇷" },
  { handle: "k4lichain", xp: 4720, country: "🇿🇦" },
  { handle: "midnight", xp: 3990, country: "🇬🇧" },
];

export default function Leaderboard() {
  const { handle, xp, level, rank } = useProgress();
  const youRow = { handle, xp, level, rank: rank.name, you: true };
  const board = [...MOCK, { handle, xp, country: "🏴" }]
    .sort((a, b) => b.xp - a.xp);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container py-10 flex-1 space-y-8">
        <header>
          <h1 className="font-display text-5xl md:text-6xl">
            <span className="text-foreground">Global </span>
            <span className="text-primary text-glow">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground mt-2">Top operators by total XP captured.</p>
        </header>

        <div className="border border-primary/20 bg-card/40 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_120px] gap-4 px-5 py-3 border-b border-primary/10 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
            <span>Rank</span>
            <span>Operator</span>
            <span className="text-right">XP</span>
          </div>
          {board.map((row, i) => {
            const isYou = row.handle === handle;
            return (
              <div
                key={`${row.handle}-${i}`}
                className={`grid grid-cols-[60px_1fr_120px] gap-4 px-5 py-3 border-b border-primary/5 font-mono text-sm transition-colors ${
                  isYou ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                }`}
              >
                <span className="flex items-center gap-1">
                  {i < 3 && <Trophy className={`h-3.5 w-3.5 ${i === 0 ? "text-[hsl(var(--warning))]" : i === 1 ? "text-secondary" : "text-accent"}`} />}
                  #{i + 1}
                </span>
                <span>
                  <span className="mr-2">{(row as any).country ?? "🏴"}</span>
                  @{row.handle}
                  {isYou && <span className="ml-2 text-[10px] uppercase tracking-widest text-primary">// you</span>}
                </span>
                <span className="text-right">{row.xp.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          Note: leaderboard is illustrative. Connect Lovable Cloud to enable real accounts and global ranking.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
