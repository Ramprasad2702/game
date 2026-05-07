import { ReactNode } from "react";

interface TerminalCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "warning";
}

const variantText = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  warning: "text-[hsl(var(--warning))]",
};

const variantBorder = {
  primary: "border-primary/20",
  secondary: "border-secondary/20",
  accent: "border-accent/20",
  warning: "border-[hsl(var(--warning))]/20",
};

export function TerminalCard({
  title,
  children,
  className = "",
  variant = "primary",
}: TerminalCardProps) {
  return (
    <div
      className={`relative bg-card/40 backdrop-blur-md border ${variantBorder[variant]} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glow-cyan group/card ${className}`}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 rounded-tl-sm group-hover/card:border-primary transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/40 rounded-tr-sm group-hover/card:border-primary transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/40 rounded-bl-sm group-hover/card:border-primary transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 rounded-br-sm group-hover/card:border-primary transition-colors" />

      {title && (
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover/card:bg-primary transition-colors" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/10" />
          </div>
          <div className={`text-[10px] uppercase tracking-[0.3em] font-mono font-bold ${variantText[variant]} group-hover/card:text-glow transition-all`}>
            {title}
          </div>
          <div className="flex gap-1">
             <div className="w-6 h-1 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 animate-pulse" style={{ width: '60%' }} />
             </div>
          </div>
        </div>
      )}
      <div className="p-4 relative z-10">{children}</div>
    </div>
  );
}
