import { useEffect, useRef, useState } from "react";

interface Props {
  /** Map of command -> output. Use exact match (trim/lower). */
  commands: Record<string, string>;
  /** Welcome banner */
  banner?: string;
  prompt?: string;
}

export function SimulatedTerminal({
  commands,
  banner = "Welcome to the simulated Kali terminal.\nType `help` to list available commands.",
  prompt = "kali@kali:/home/kali$",
}: Props) {
  const [history, setHistory] = useState<{ cmd?: string; out: string }[]>([
    { out: banner },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    let out = "";
    const lower = cmd.toLowerCase();
    if (lower === "clear") {
      setHistory([]);
      return;
    }
    if (lower === "help") {
      out = "Available commands:\n  " + Object.keys(commands).join("\n  ") + "\n  clear, help";
    } else if (commands[lower]) {
      out = commands[lower];
    } else if (commands[cmd]) {
      out = commands[cmd];
    } else {
      out = `bash: ${cmd.split(" ")[0]}: command not found`;
    }
    setHistory((h) => [...h, { cmd, out }]);
  };

  return (
    <div
      className="bg-[hsl(150_30%_3%)] border border-primary/30 rounded-lg p-4 font-mono text-sm h-[460px] overflow-y-auto cursor-text"
      onClick={() => (document.getElementById("sim-term-input") as HTMLInputElement)?.focus()}
    >
      <div className="text-primary mb-2 leading-snug">
        ┌──(<span className="text-secondary">kali㉿kali</span>)-[<span className="text-foreground">~</span>]<br />
        └─$ <span className="text-foreground/90 whitespace-pre-wrap">{banner}</span>
      </div>
      {history.slice(1).map((h, i) => (
        <div key={i} className="mb-1">
          {h.cmd && (
            <div>
              <span className="text-primary font-bold">{prompt}</span>{" "}
              <span className="text-foreground">{h.cmd}</span>
            </div>
          )}
          <pre className="text-foreground/90 whitespace-pre-wrap">{h.out}</pre>
        </div>
      ))}
      <form
        onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }}
        className="flex items-center"
      >
        <span className="text-primary font-bold shrink-0">{prompt}</span>
        <input
          id="sim-term-input"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 ml-2 bg-transparent outline-none text-foreground caret-primary"
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}
