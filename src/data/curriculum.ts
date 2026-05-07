import type { LabConfig } from "@/components/LabSandbox";

export type Difficulty = "easy" | "medium" | "hard" | "insane";

export interface Challenge {
  id: string;
  title: string;
  prompt: string;        // scenario text
  hint?: string;
  /** lowercased exact match flag, format nullbyte{...} */
  flag: string;
  xp: number;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;       // markdown-ish (rendered as plain blocks)
  difficulty: Difficulty;
  challenge: Challenge;
  /** Optional interactive lab beginners can use to discover the answer */
  lab?: LabConfig;
}

export interface Module {
  id: string;
  title: string;
  tagline: string;
  icon: string;          // lucide icon name
  color: "primary" | "secondary" | "accent" | "warning";
  lessons: Lesson[];
}

export const CATEGORIES = [
  "All",
  "Offensive Security",
  "Web Security",
  "Networking",
  "Defensive Security",
  "Cryptography",
  "Forensics",
] as const;
export type Category = typeof CATEGORIES[number];

export const DIFFICULTY_LEVELS = ["All Levels", "easy", "medium", "hard", "insane"] as const;

export function moduleCategory(domainId: string): Category {
  switch (domainId) {
    case "recon": return "Offensive Security";
    case "injection": return "Web Security";
    case "auth": return "Web Security";
    case "advanced": return "Web Security";
    default: return "Offensive Security";
  }
}

export function moduleDifficulty(m: Module): Difficulty {
  const order: Difficulty[] = ["easy", "medium", "hard", "insane"];
  const max = m.lessons.reduce((d, l) => Math.max(d, order.indexOf(l.difficulty)), 0);
  return order[max];
}

export function moduleDuration(m: Module): number {
  return m.lessons.length * 20 + 10; // approx minutes
}

export function moduleXp(m: Module): number {
  return m.lessons.reduce((s, l) => s + l.challenge.xp, 0);
}

export interface Domain {
  id: string;
  code: string;          // e.g. "01"
  title: string;
  blurb: string;
  modules: Module[];
}

const f = (s: string) => `nullbyte{${s}}`;

export const DOMAINS: Domain[] = [
  {
    id: "recon",
    code: "01",
    title: "Recon, Enumeration & Attack Surface",
    blurb: "Map the unknown. From OSINT whispers to full automated pipelines.",
    modules: [
      {
        id: "passive-recon", title: "Passive Recon", tagline: "OSINT, Google dorks, Shodan, Censys, FOFA",
        icon: "Search", color: "primary",
        lessons: [
          {
            id: "google-dorks", title: "Google Dorking 101", difficulty: "easy",
            summary: "Use Google's search operators to find files & pages a site owner forgot to hide.",
            content:
              "Google Dorking just means using special search operators to filter results.\n\n" +
              "The four you'll use most:\n" +
              "  • site:example.com   → only show pages on that domain\n" +
              "  • filetype:pdf       → only show files of that type\n" +
              "  • inurl:admin        → URL must contain the word\n" +
              "  • intitle:login      → page title must contain the word\n\n" +
              "You can combine them. A `.env` file is a configuration file that often holds passwords and API keys — developers sometimes upload them by accident.\n\n" +
              "Try the lab below: search for the leaked .env on target.com.",
            challenge: {
              id: "c-dork-1", title: "Find the leaked config",
              prompt:
                "Use the lab to find the .env file leaked on target.com.\n\n" +
                "Inside the file, you'll find the secret flag. Submit it here.",
              hint: "Combine site: and filetype: operators to locate .env files.",
              flag: f("d0rk_m4st3r_99"), xp: 50,
            },
            lab: { kind: "google-dorks", brief: "A simulated search engine indexing target.com. Try operators." },
          },
          {
            id: "shodan-basics", title: "Shodan Basics", difficulty: "easy",
            summary: "Shodan is like Google, but for internet-connected devices and servers.",
            content:
              "Where Google indexes web pages, Shodan indexes the *banners* that servers send when you connect.\n\n" +
              "Useful filters:\n" +
              "  • port:8080           → only show services on port 8080\n" +
              "  • country:US          → filter by country\n" +
              "  • product:nginx       → match the software name\n" +
              "  • http.title:\"Jenkins\" → match the HTML <title>\n\n" +
              "Jenkins is an automation tool. When exposed to the internet without auth, it's a common target. Find one in the lab.",
            challenge: {
              id: "c-shodan-1", title: "Locate the open Jenkins",
              prompt: 'Find the open Jenkins server in the lab. The flag is hidden in the page title.',
              hint: "Use the filter http.title:\"Jenkins\" to narrow your search.",
              flag: f("shodan_king"), xp: 60,
            },
            lab: { kind: "shodan", brief: "A simulated Shodan index. Use filters to narrow results." },
          },
        ],
      },
      {
        id: "dns-enum", title: "DNS Enumeration", tagline: "Discover subdomains and misconfigurations",
        icon: "Network", color: "secondary",
        lessons: [
          {
            id: "axfr", title: "Zone Transfer (AXFR)", difficulty: "easy",
            summary: "When a DNS server is misconfigured, you can ask it for the entire list of records.",
            content:
              "DNS is the phonebook of the internet. Servers called *nameservers* answer questions like \"what's the IP of www.target.com?\".\n\n" +
              "A *zone transfer* (AXFR) was designed for nameservers to copy records to each other. If a nameserver isn't locked down, anyone can ask for the full zone — exposing every subdomain.\n\n" +
              "The command looks like:  `dig axfr target.com`\n\n" +
              "Try it in the lab. Look at the records you get back.",
            challenge: {
              id: "c-axfr", title: "Name the query type",
              prompt:
                "In the lab, perform a zone transfer (AXFR) against target.com.\n\n" +
                "Look for the hidden subdomain entry containing the flag.",
              hint: "Select AXFR from the dropdown and target.com as the domain.",
              flag: f("zone_transfer_win"), xp: 40,
            },
            lab: { kind: "dns", brief: "A mini-dig. Try queries like `a target.com` or `axfr target.com`." },
          },
          {
            id: "takeover", title: "Subdomain Takeover", difficulty: "medium",
            summary: "When a subdomain points at a service that no longer exists, anyone can claim it.",
            content:
              "A *CNAME* record makes one domain an alias of another. Example:\n" +
              "   blog.target.com → target.github.io\n\n" +
              "If the company stops using GitHub Pages but forgets to remove the CNAME, an attacker can register `target.github.io` themselves and serve their own content under blog.target.com.\n\n" +
              "Use the lab to find a dangling CNAME on target.com.",
            challenge: {
              id: "c-takeover", title: "Dangling pointer",
              prompt: "Identify the dangling CNAME in the DNS records. The associated TXT record holds the flag.",
              hint: "Check the TXT records for target.com after identifying the CNAME.",
              flag: f("dns_text_record"), xp: 80,
            },
            lab: { kind: "dns", brief: "Try `axfr target.com` to list everything, then `cname blog.target.com`." },
          },
        ],
      },
      {
        id: "js-analysis", title: "JavaScript Analysis", tagline: "Hidden endpoints, secrets, leaked tokens",
        icon: "FileCode", color: "accent",
        lessons: [
          {
            id: "secret-hunt", title: "Hunting Secrets in JS", difficulty: "easy",
            summary: "Frontend JavaScript bundles often leak API keys and internal URLs.",
            content:
              "When a website ships JavaScript to your browser, you can read every line of it. Developers sometimes leave secrets in there by accident — API keys, internal endpoints, debug routes.\n\n" +
              "AWS access keys always start with the letters `AKIA` (long-lived) or `ASIA` (temporary). That fixed prefix makes them easy to grep for.\n\n" +
              "Use the lab to search the bundle. Type `AKIA` and see what lights up.",
            challenge: {
              id: "c-aws", title: "Spot the AWS key",
              prompt: "Grep the JS bundle for secrets. Find the hardcoded flag variable.",
              hint: "The flag follows the standard format nullbyte{...}.",
              flag: f("js_leak_detected"), xp: 50,
            },
            lab: { kind: "js-inspect", brief: "A leaked production bundle. Grep it." },
          },
        ],
      },
      {
        id: "content-discovery", title: "Content Discovery", tagline: "Find hidden pages and directories",
        icon: "FolderSearch", color: "warning",
        lessons: [
          {
            id: "ffuf-basics", title: "Directory Fuzzing with FFUF", difficulty: "easy",
            summary: "Brute-force common paths to find pages that aren't linked anywhere.",
            content:
              "FFUF takes a wordlist (a list of common path names like `admin`, `login`, `backup`) and tries each one against the target. Pages that return HTTP 200 exist; 404 means not found.\n\n" +
              "The command: `ffuf -u https://target.com/FUZZ -w wordlist.txt`\n\n" +
              "The literal word `FUZZ` is the placeholder ffuf swaps each wordlist entry into.\n\n" +
              "Run the lab and see which paths exist on target.com.",
            challenge: {
              id: "c-ffuf", title: "FFUF placeholder",
              prompt: "Fuzz the target for hidden directories. One of the discovered paths contains the flag.",
              hint: "Try adding .secret_flag to your wordlist.",
              flag: f("fuzzing_master"), xp: 40,
            },
            lab: { kind: "ffuf", brief: "Edit the wordlist, then run ffuf to see which paths return 200." },
          },
        ],
      },
      {
        id: "fingerprint", title: "Tech Fingerprinting & WAF", tagline: "Identify the tech stack and defenses",
        icon: "Fingerprint", color: "secondary",
        lessons: [
          {
            id: "waf-detect", title: "Detecting a WAF", difficulty: "easy",
            summary: "A WAF (Web Application Firewall) sits in front of a site to block attacks. Its presence is often visible in the response headers.",
            content:
              "When you make an HTTP request you also get response headers back. WAFs and CDNs love to brag — they add their own headers.\n\n" +
              "Cloudflare is the most popular CDN+WAF on the internet. Every Cloudflare response includes a header named `cf-ray` containing a request ID.\n\n" +
              "Use the lab to send `curl -I` against the target sites and look at the headers.",
            challenge: {
              id: "c-waf", title: "Cloudflare's tell",
              prompt: "Scan the target headers. One of the response headers leaks the system flag.",
              hint: "Look for headers starting with 'X-'.",
              flag: f("header_hunting_pro"), xp: 50,
            },
            lab: { kind: "headers", brief: "curl -I against a few hostnames and inspect the headers." },
          },
        ],
      },
      {
        id: "automated-recon", title: "Automated Pipelines", tagline: "Subfinder, httpx, Nuclei",
        icon: "Workflow", color: "primary",
        lessons: [
          {
            id: "pipeline", title: "Subfinder → httpx → Nuclei", difficulty: "easy",
            summary: "Chain three popular tools into one recon pipeline.",
            content:
              "Real bug-hunters chain three tools:\n\n" +
              "  1. subfinder -d target.com  → discovers subdomains from public sources\n" +
              "  2. httpx -silent            → checks which ones actually serve a website\n" +
              "  3. nuclei -t cves/          → scans the live ones for known vulnerabilities using YAML templates\n\n" +
              "The lab walks through the output of each step. Click through them.",
            challenge: {
              id: "c-nuclei", title: "Template scanner",
              prompt: "Run the automated recon pipeline. The Nuclei scan results will reveal a vulnerability flag.",
              hint: "Click through the steps and look for the [CVE-2023-1234] output.",
              flag: f("cve_2023_1234"), xp: 50,
            },
            lab: { kind: "recon-pipeline", brief: "Walk through the three stages of a real recon chain." },
          },
        ],
      },
    ],
  },
  {
    id: "injection",
    code: "02",
    title: "Advanced Injection Attacks",
    blurb: "When user input becomes code, you become god.",
    modules: [
      {
        id: "sqli", title: "SQL Injection", tagline: "Union, blind, time-based, OOB",
        icon: "Database", color: "primary",
        lessons: [
          {
            id: "sqli-time", title: "Time-Based Blind SQLi", difficulty: "hard",
            summary: "No errors, no output — only the clock tells you the truth.",
            content: "SQL injection happens when user input gets pasted directly into a database query.\n\nA login query usually looks like:\n  SELECT * FROM users WHERE user='$u' AND pass='$p'\n\nIf the app does not sanitise $u, you can inject SQL of your own. Classic payload:\n  username:  admin' OR 1=1-- -\n  password:  anything\n\nThe -- starts a SQL comment so the password check is ignored.\n\nIn time-based blind SQLi (no visible output), you ask the database to SLEEP(5) only when a condition is true and watch the response time. The MySQL function used as a stopwatch is SLEEP.\n\nTry the lab below — log in without knowing the password.",
            challenge: {
              id: "c-sqli-1", title: "MySQL delay function",
              prompt: "Bypass the login form using SQL injection. The successful login message will contain the flag.",
              hint: "Try the classic ' OR 1=1-- payload.",
              flag: f("sqli_bypass_win"), xp: 80,
            },
          lab: { kind: "sqli-login", brief: "Vulnerable login form. Try ' OR 1=1-- as the username." },
          },
          {
            id: "sqli-2order", title: "Second-Order SQLi", difficulty: "insane",
            summary: "Payload stored now, executed later — bypasses input filters that only run at write time.",
            content: "Some apps sanitise input on the way IN but not on the way OUT.\n\nExample: you register the username  admin'-- -  . The signup query escapes it. But later a different feature (say, password reset) builds:\n  SELECT * FROM users WHERE name = 'admin\'-- -'\nand executes the stored, un-escaped value. The injection fires the SECOND time the data is used.\n\nThis class of bug is called second-order SQL injection.",
            challenge: {
              id: "c-sqli-2", title: "What kind of injection",
              prompt: "Stored payload, deferred execution: what is this attack class called? Submit nullbyte{name} (two words, hyphenated).",
              flag: f("second-order"), xp: 120,
            },
          lab: { kind: "sqli-login", brief: "Same form — but imagine the payload is stored in your username and triggers later." },
          },
        ],
      },
      {
        id: "xxe", title: "XXE", tagline: "File read, SSRF, blind OOB",
        icon: "FileX", color: "accent",
        lessons: [
          {
            id: "xxe-read", title: "Classic File Read", difficulty: "medium",
            summary: "Define an external entity, watch /etc/passwd come home.",
            content: "XML parsers can be told to load files from the server. If the parser is old or misconfigured it will follow that pointer.\n\nMinimal payload:\n  <?xml version=\"1.0\"?>\n  <!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]>\n  <foo>&xxe;</foo>\n\nThe parser sees ENTITY xxe pointing at file:///etc/passwd, fetches the file, and substitutes its content for &xxe; — printing /etc/passwd back to you.\n\nThe DTD keyword that pulls in external content is SYSTEM.\n\nIn the lab, edit the XML body to read /etc/passwd.",
            challenge: {
              id: "c-xxe-1", title: "External entity keyword",
              prompt: "Exploit the XML parser to read /etc/passwd. The flag is stored within the password file.",
              hint: "Define an ENTITY using SYSTEM 'file:///etc/passwd'.",
              flag: f("xxe_file_read"), xp: 70,
            },
          lab: { kind: "xxe", brief: "Edit the XML body to inject an external entity." },
          },
        ],
      },
      {
        id: "ssti", title: "Server-Side Template Injection", tagline: "Jinja2, Twig, Freemarker, Smarty",
        icon: "Braces", color: "secondary",
        lessons: [
          {
            id: "jinja", title: "Jinja2 RCE", difficulty: "hard",
            summary: "From `{{7*7}}` to remote shell via Python's class hierarchy.",
            content: "Server-Side Template Injection happens when user input is concatenated into a template string before it is rendered.\n\nProbe: enter  {{7*7}}  in a parameter. If the page replies with  49  the server is evaluating the template (likely Jinja2/Twig).\n\nFrom there you can climb Python's class tree —  __class__ → __mro__ → __subclasses__()  — until you reach subprocess.Popen and run shell commands.\n\nThe canonical 5-character probe is {{7*7}}.",
            challenge: {
              id: "c-ssti-1", title: "Detection probe",
              prompt: "Inject a template payload to leak the server configuration. The flag is hidden in the config object.",
              hint: "Try {{config}} or {{7*7}} to detect the engine first.",
              flag: f("ssti_config_leak"), xp: 85,
            },
          lab: { kind: "ssti", brief: "The page reflects ?name= straight into the template." },
          },
        ],
      },
      {
        id: "cmdi", title: "Command Injection", tagline: "Blind, time-based, filter bypass",
        icon: "Terminal", color: "warning",
        lessons: [
          {
            id: "cmdi-blind", title: "Blind Command Injection", difficulty: "medium",
            summary: "No output? Make the server sleep or call home.",
            content: "When the app passes your input straight to a shell command without escaping, you can append your own commands.\n\nExample backend:  ping -c 1 $host\n\nIf you submit  8.8.8.8; sleep 10  the shell runs both commands. No output? Use timing — sleep 10 makes the response visibly slower. The unix command used as a stopwatch is sleep.\n\nTry it in the lab.",
            challenge: {
              id: "c-cmdi-1", title: "Timing oracle",
              prompt: "Use command injection to run 'id' on the server. The output will reveal the flag.",
              hint: "Chain the command with a semicolon: ; id",
              flag: f("cmdi_id_found"), xp: 60,
            },
          lab: { kind: "cmdi", brief: "Network ping form — server runs `ping -c 1 $host` unsanitized." },
          },
        ],
      },
    ],
  },
  {
    id: "auth",
    code: "03",
    title: "Auth, Session & Access Control",
    blurb: "Every login is a permission boundary waiting to be broken.",
    modules: [
      {
        id: "jwt", title: "JWT Attacks", tagline: "alg confusion, weak secrets, kid injection",
        icon: "KeyRound", color: "primary",
        lessons: [
          {
            id: "jwt-none", title: "alg=none Bypass", difficulty: "easy",
            summary: "Tell the server you signed nothing — and it believes you.",
            content: "A JWT has three parts separated by dots:  header.payload.signature\n\nThe header looks like  {\"alg\":\"HS256\",\"typ\":\"JWT\"} . Old/buggy JWT libraries accept  {\"alg\":\"none\"}  which means: trust this token without checking the signature.\n\nAttack: change alg to none, change the payload to make yourself admin, drop the signature, send it. If the library is vulnerable you are in.\n\nIn the lab, edit the token directly.",
            challenge: {
              id: "c-jwt-1", title: "The magic alg",
              prompt: "Manipulate the JWT to bypass authentication. The server will reveal the flag upon successful login.",
              hint: "Change the 'alg' header to 'none' and 'admin' to true.",
              flag: f("jwt_none_alg"), xp: 50,
            },
          lab: { kind: "jwt", brief: "Live JWT editor — change alg to 'none' and admin to true." },
          },
          {
            id: "jwt-confuse", title: "RS256 → HS256 Confusion", difficulty: "hard",
            summary: "Trick the verifier into using the public key as an HMAC secret.",
            content: "RS256 uses a public/private key pair. The server has the private key; you only get the public one (often at /.well-known/jwks.json).\n\nIf the server's code says  jwt.verify(token, publicKey)  without enforcing the alg, you can:\n  1. take the public key bytes,\n  2. re-sign your tampered payload with HS256 using those bytes as the HMAC secret,\n  3. set alg=HS256 in the header.\n\nThe server, expecting RS256, will use the public key as a string secret and verify your forged signature.\n\nThe flipped algorithm is HS256.",
            challenge: {
              id: "c-jwt-2", title: "Confused algorithm",
              prompt: "What symmetric alg do you switch to in an RS256→? confusion attack? Submit nullbyte{alg} uppercase, then lowercase the whole thing.",
              flag: f("hs256"), xp: 100,
            },
          lab: { kind: "jwt-confuse", brief: "Walkthrough of an RS256→HS256 algorithm-confusion attack." },
          },
        ],
      },
      {
        id: "idor", title: "IDOR & BOLA", tagline: "Horizontal & vertical privesc",
        icon: "ShieldOff", color: "accent",
        lessons: [
          {
            id: "idor-1", title: "Sequential ID Trap", difficulty: "easy",
            summary: "`/api/invoice/1042` → `/api/invoice/1043` and you read someone else's data.",
            content: "Insecure Direct Object Reference: the URL contains an ID, and the server forgets to check whether YOU are allowed to see THAT id.\n\n  GET /api/invoice/1042  → your invoice\n  GET /api/invoice/1043  → someone else's invoice\n\nIn the API world this is the #1 risk in the OWASP API Security Top 10, where it goes by the 4-letter acronym BOLA (Broken Object Level Authorization).\n\nTry browsing other invoice IDs in the lab.",
            challenge: {
              id: "c-idor-1", title: "Acronym time",
              prompt: "Browse through sequential IDs to find the CEO's invoice. The flag is stored in the invoice details.",
              hint: "Try incrementing the invoice ID beyond 1042.",
              flag: f("ceo_pay_leak"), xp: 45,
            },
          lab: { kind: "idor", brief: "Browse invoice IDs. Sequential integers are an attacker's dream." },
          },
        ],
      },
      {
        id: "oauth", title: "OAuth 2.0 Attacks", tagline: "Open redirect, state bypass, token leakage",
        icon: "LogIn", color: "secondary",
        lessons: [
          {
            id: "oauth-state", title: "Missing State Parameter", difficulty: "medium",
            summary: "No state = no CSRF protection on the auth callback.",
            content: "OAuth flows hand the user off to a login server, then redirect back with a code. Without protection, an attacker can start the flow themselves and trick a victim into completing it on their account.\n\nThe defence is the state parameter — a random value the client puts in the request and checks when the redirect comes back. No state, no CSRF protection.\n\nIn the lab, add or remove state= and watch the verdict change.",
            challenge: {
              id: "c-oauth-1", title: "CSRF guard param",
              prompt: "Which OAuth 2.0 parameter prevents CSRF on the redirect_uri callback? Submit nullbyte{param}",
              flag: f("state"), xp: 65,
            },
          lab: { kind: "oauth", brief: "Edit the authorize URL parameters." },
          },
        ],
      },
      {
        id: "mfa", title: "MFA Bypass", tagline: "OTP prediction, response tampering, backup abuse",
        icon: "Smartphone", color: "warning",
        lessons: [
          {
            id: "mfa-resp", title: "Response Manipulation", difficulty: "medium",
            summary: "Flip `\"verified\":false` to `true` in the response and watch the client trust it.",
            content: "Some apps check MFA on the CLIENT side: server returns  {\"verified\": false}  and the JS hides the dashboard until that flips.\n\nIf you intercept the response (Burp / browser DevTools) and change verified to true before forwarding it, the client unlocks. The server never re-checked.\n\nThe boolean key to flip is usually verified.",
            challenge: {
              id: "c-mfa-1", title: "Trust the wrong side",
              prompt: "Intercept and tamper with the MFA response. The flag will be displayed once the dashboard unlocks.",
              hint: "Change 'verified': false to true in the intercepted JSON.",
              flag: f("mfa_logic_bypass"), xp: 70,
            },
          lab: { kind: "mfa", brief: "Intercepted server response — flip a boolean before forwarding." },
          },
        ],
      },
    ],
  },
  {
    id: "advanced",
    code: "04",
    title: "Advanced Web Vulnerabilities",
    blurb: "The frontier: desync, deserialize, poison, pollute.",
    modules: [
      {
        id: "ssrf", title: "SSRF", tagline: "Cloud metadata, internal pivot, blind",
        icon: "Cloud", color: "primary",
        lessons: [
          {
            id: "ssrf-meta", title: "AWS Metadata Endpoint", difficulty: "medium",
            summary: "The most famous IP in cloud security.",
            content: "Server-Side Request Forgery: you make the SERVER fetch a URL of your choice. Useful because the server sits inside a private network you can't reach.\n\nOn AWS EC2 every instance has a magic local URL only reachable from itself:\n  http://169.254.169.254/latest/meta-data/\n\nThat URL exposes IAM credentials. Stealing them gives you the role the server runs as.\n\nThe magic IP is 169.254.169.254. Try it in the lab.",
            challenge: {
              id: "c-ssrf-1", title: "Magic IP",
              prompt: "Fetch the AWS metadata endpoint through the SSRF vulnerability. The IAM token response holds the flag.",
              hint: "Target the IP 169.254.169.254.",
              flag: f("ssrf_aws_metadata_leak"), xp: 80,
            },
          lab: { kind: "ssrf", brief: "URL-preview tool. Try the AWS metadata IP." },
          },
        ],
      },
      {
        id: "xss", title: "XSS Mastery", tagline: "DOM, mXSS, CSP bypass",
        icon: "Code2", color: "accent",
        lessons: [
          {
            id: "dom-xss", title: "DOM Sinks", difficulty: "medium",
            summary: "Source → sink. Find the path from URL to `innerHTML`.",
            content: "DOM-based XSS happens when client-side JS takes data from a SOURCE (URL, location.hash, document.cookie) and writes it to a SINK (innerHTML, eval, document.write).\n\nClassic payload in a comment:\n  <img src=x onerror=alert(1)>\n\nThe browser tries to load the bad src, fails, then runs onerror — running your JS in the victim's session.\n\nThe most dangerous DOM sink for HTML injection is innerHTML.",
            challenge: {
              id: "c-xss-1", title: "Name the sink",
              prompt: "Inject an XSS payload into the comment field. The flag is contained within the alert box.",
              hint: "Use <img src=x onerror=alert(...)>.",
              flag: f("xss_injection_win"), xp: 60,
            },
          lab: { kind: "xss", brief: "Comment box that drops user input straight into innerHTML." },
          },
        ],
      },
      {
        id: "smuggling", title: "HTTP Request Smuggling", tagline: "CL.TE, TE.CL, server desync",
        icon: "Split", color: "secondary",
        lessons: [
          {
            id: "smug-clte", title: "CL.TE Desync", difficulty: "insane",
            summary: "Front-end believes Content-Length, back-end believes Transfer-Encoding. Chaos ensues.",
            content: "Two HTTP headers can describe the body length:\n  Content-Length: 13\n  Transfer-Encoding: chunked\n\nThey should never both be present, but real-world stacks often have a CDN that picks one and an origin server that picks the other. Result: bytes you put after the 'end' of one parser become a NEW request to the other.\n\nIn chunked encoding, the body ends with a single character: 0 followed by CRLF CRLF.",
            challenge: {
              id: "c-smug-1", title: "Terminator chunk",
              prompt: "Smuggle a request to the backend server. The response will contain the hidden flag.",
              hint: "Use a CL.TE desync payload.",
              flag: f("smuggl3r_p0is0n_win"), xp: 130,
            },
          lab: { kind: "smuggling", brief: "Diagram of a CL.TE desync between front-end and back-end." },
          },
        ],
      },
      {
        id: "deser", title: "Insecure Deserialization", tagline: "Java, PHP, Python pickle, .NET",
        icon: "PackageOpen", color: "warning",
        lessons: [
          {
            id: "pickle", title: "Python Pickle RCE", difficulty: "hard",
            summary: "`__reduce__` is the gift that keeps on giving.",
            content: "Python's pickle is for serialising objects, but unpickling runs code. A class can define __reduce__ to control what happens when it is unpickled:\n\n  class P:\n      def __reduce__(self):\n          return (os.system, (\"id\",))\n\nUnpickling P() calls os.system(\"id\"). If a server does pickle.loads(user_input), you have remote code execution.\n\nThe dunder method to abuse is __reduce__.",
            challenge: {
              id: "c-deser-1", title: "Magic method",
              prompt: "Craft a malicious pickle blob to achieve RCE. The flag is revealed when the server executes 'cat /flag.txt'.",
              hint: "Define a class with a __reduce__ method returning (os.system, ...).",
              flag: f("pickle_reduce_rce"), xp: 110,
            },
          lab: { kind: "pickle", brief: "Server-side pickle.loads() on attacker-controlled data." },
          },
        ],
      },
      {
        id: "proto", title: "Prototype Pollution", tagline: "Client + server-side (Node.js)",
        icon: "GitBranch", color: "primary",
        lessons: [
          {
            id: "proto-1", title: "The Polluted Property", difficulty: "hard",
            summary: "Recursive merges that don't blacklist the magic key end in tears.",
            content: "In JavaScript, every object inherits from Object.prototype. If a deep-merge function copies a key called __proto__ from attacker JSON into a target object, you can add properties to Object.prototype itself — affecting every object created afterwards.\n\n  POST /api/profile  { \"__proto__\": { \"isAdmin\": true } }\n\nNow {} .isAdmin === true everywhere.\n\nThe forbidden key in any deep-merge is __proto__.",
            challenge: {
              id: "c-proto-1", title: "The cursed key",
              prompt: "Pollute the global object prototype to gain administrative access. The flag will be revealed in the success message.",
              hint: "Use the __proto__ key to inject new properties.",
              flag: f("proto_pollution_win"), xp: 100,
            },
          lab: { kind: "proto-pollution", brief: "Profile updater that does a recursive merge." },
          },
        ],
      },
    ],
  },
];

export const ALL_LESSONS: { domain: Domain; module: Module; lesson: Lesson }[] =
  DOMAINS.flatMap((domain) =>
    domain.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({ domain, module, lesson }))
    )
  );

export function findLesson(domainId: string, moduleId: string, lessonId: string) {
  const domain = DOMAINS.find((d) => d.id === domainId);
  const module = domain?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  if (!domain || !module || !lesson) return null;
  return { domain, module, lesson };
}

export function findModule(domainId: string, moduleId: string) {
  const domain = DOMAINS.find((d) => d.id === domainId);
  const module = domain?.modules.find((m) => m.id === moduleId);
  if (!domain || !module) return null;
  return { domain, module };
}

export const TOTAL_XP_AVAILABLE = ALL_LESSONS.reduce(
  (sum, { lesson }) => sum + lesson.challenge.xp,
  0
);
