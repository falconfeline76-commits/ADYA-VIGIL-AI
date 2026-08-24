import { useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertTriangle, ArrowUpRight, CheckCircle2, ChevronRight, CircleHelp, FileScan,
  History, Info, Link2, Mail, MessageSquareText, QrCode, Radar, ShieldCheck,
  ShieldAlert, Upload, Activity, LockKeyhole, ScanLine
} from "lucide-react";

type ScanType = "url" | "email" | "sms" | "qr";
type Finding = { title: string; detail: string; weight: number; tone: "high" | "medium" | "low" };
type ScanResult = { score: number; verdict: string; summary: string; findings: Finding[]; nextSteps: string[]; label: string };

const nav = [
  { href: "/", label: "Dashboard", icon: Radar },
  { href: "/scan", label: "Scan center", icon: ScanLine },
  { href: "/history", label: "Scan history", icon: History },
  { href: "/about", label: "About model", icon: Info },
];
const scanTypes: { id: ScanType; label: string; icon: typeof Link2; hint: string }[] = [
  { id: "url", label: "URL", icon: Link2, hint: "Paste a link" },
  { id: "email", label: "Email", icon: Mail, hint: "Inspect sender + body" },
  { id: "sms", label: "SMS", icon: MessageSquareText, hint: "Review a message" },
  { id: "qr", label: "QR image", icon: QrCode, hint: "Upload a QR code" },
];

function analyze(type: ScanType, raw: string, label: string): ScanResult {
  const value = raw.trim();
  const lower = value.toLowerCase();
  const findings: Finding[] = [];
  const add = (title: string, detail: string, weight: number, tone: Finding["tone"] = "medium") => findings.push({ title, detail, weight, tone });
  if (!value) add("No signal provided", "Add a URL, message, or sender content so the model can inspect it.", 0, "low");
  if (type === "url") {
    try {
      const url = new URL(value.includes("://") ? value : `https://${value}`);
      if (url.protocol !== "https:") add("Unencrypted destination", "The link does not use HTTPS, so traffic can be exposed or altered.", 22, "high");
      if (url.hostname.split(".").length > 3) add("Deep subdomain chain", "Multiple subdomains can make a lookalike destination harder to spot.", 14);
      if (/xn--|%[0-9a-f]{2}|@/.test(value)) add("Obfuscation marker", "Encoded characters or an @ symbol can hide the real destination.", 24, "high");
      if (/\.(zip|mov|top|click|work|support|gq|tk)(\/|$)/.test(url.hostname + url.pathname)) add("Higher-risk link pattern", "This domain or path uses a pattern frequently seen in disposable campaigns.", 18, "high");
      if (/(login|verify|secure|update|wallet|invoice|refund|payment|gift)/.test(lower)) add("Credential or payment lure", "The wording points toward a sensitive action that attackers commonly imitate.", 18, "high");
      if (!findings.length) add("No strong heuristic flags", "The URL structure does not match the strongest local warning patterns. Still verify the domain before proceeding.", 4, "low");
    } catch { add("Malformed URL", "This does not parse as a normal web address. Do not open it until the destination is verified.", 28, "high"); }
  } else {
    if (/(urgent|immediately|within \d+ hours|last chance|final notice|act now)/.test(lower)) add("Urgency pressure", "The message tries to compress your decision window and discourage careful verification.", 20, "high");
    if (/(password|passcode|otp|one[- ]time|verification code|social security|bank|card|payment)/.test(lower)) add("Sensitive-data request", "The message references credentials, financial details, or codes that should not be shared from an unsolicited message.", 26, "high");
    if (/(click|tap|open|download|confirm|verify|sign in|login)/.test(lower)) add("Action request", "It asks you to follow a link, open a file, or confirm an account action.", 16, "medium");
    if (/(bit\.ly|tinyurl|t\.co|goo\.gl|is\.gd|\.zip|\.html?)/.test(lower)) add("Redirect or attachment marker", "Short links and executable-looking attachments hide where the action leads.", 18, "high");
    if (/@[a-z0-9.-]+\.[a-z]{2,}/.test(value) && type === "email") add("Sender context needs verification", "The sender address is present, but visual familiarity is not proof of authenticity.", 9, "medium");
    if (!findings.length) add("Low-signal content", "No common pressure, payment, credential, or link indicators were found in this sample.", 5, "low");
  }
  const score = Math.min(99, Math.max(3, findings.reduce((sum, item) => sum + item.weight, 0)));
  const verdict = score >= 70 ? "High risk" : score >= 40 ? "Needs caution" : "Low signal";
  const summary = score >= 70 ? "Multiple indicators suggest you should treat this as a likely phishing attempt." : score >= 40 ? "The sample contains warning signals that merit independent verification." : "The local model found limited warning signals, but no heuristic scan can prove a message is safe.";
  const nextSteps = score >= 70
    ? ["Do not click, reply, download, or scan again.", "Verify through a known-good website, app, or phone number.", "Report the message to your provider and delete it."]
    : score >= 40
      ? ["Pause before taking the requested action.", "Check the sender and destination using a trusted channel.", "Do not share credentials, codes, or payment details."]
      : ["Confirm the domain or sender independently before proceeding.", "Keep software and browser protections enabled.", "If the context feels unexpected, treat it as suspicious."];
  return { score, verdict, summary, findings, nextSteps, label: label || `${type.toUpperCase()} sample` };
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#d95d46" : score >= 40 ? "#d6a33d" : "#8aa33b";
  return <div className="score-ring" style={{ "--score": `${score * 3.6}deg`, "--score-color": color } as React.CSSProperties}><div><strong>{score}</strong><span>/100</span></div></div>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const active = location === "/" ? "/" : `/${location.split("/")[1]}`;
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href="/" className="brand"><img src="/manus-storage/adya-vigil-mark_f6e1ffca.png" alt="" /><span><b>ADYA</b><em>VIGIL AI</em></span></Link>
      <div className="rail-label">Security desk</div>
      <nav className="nav-stack">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-item ${active === href ? "active" : ""}`}><Icon size={17} /><span>{label}</span>{active === href && <ChevronRight size={15} />}</Link>)}</nav>
      <div className="sidebar-spacer" />
      <div className="rail-status"><span className="status-dot" /> Local model online<div className="mono">RULESET 0.9.4 · READY</div></div>
      <div className="sidebar-foot"><LockKeyhole size={14} /> Your content stays in this workspace</div>
    </aside>
    <main className="workspace">{children}</main>
  </div>;
}

function ScanCenter() {
  const [type, setType] = useState<ScanType>("url");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const createScan = trpc.scans.create.useMutation();
  const uploadFile = trpc.files.upload.useMutation();
  const linkFile = trpc.files.linkToScan.useMutation();
  const utils = trpc.useUtils();

  const run = async () => {
    if (!value.trim()) { toast.error("Add something to inspect first"); return; }
    const next = analyze(type, value, label);
    setResult(next);
    try {
      const saved = await createScan.mutateAsync({ inputType: type, inputLabel: next.label, inputContent: value, score: next.score, verdict: next.verdict, summary: next.summary, evidence: next.findings.map(f => `${f.title}: ${f.detail}`), nextSteps: next.nextSteps });
      if (type === "qr" && uploadedFileId) {
        await linkFile.mutateAsync({ fileId: uploadedFileId, scanId: saved.id });
        await utils.files.list.invalidate();
      }
      await utils.scans.list.invalidate();
      await utils.scans.stats.invalidate();
      toast.success("Scan saved to history");
    } catch { toast.error("Result shown locally, but the scan could not be saved"); }
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const data = String(reader.result);
      try {
        const uploaded = await uploadFile.mutateAsync({
          originalName: file.name,
          mimeType: file.type as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
          dataBase64: data,
        });
        setUploadedFileId(uploaded.id);
        toast.success("QR image stored securely", {
          description: `${uploaded.sizeBytes.toLocaleString()} bytes · ${uploaded.url}`,
        });
        const image = new Image();
        image.onload = async () => {
          const Detector = (window as any).BarcodeDetector;
          if (!Detector) return;
          try {
            const detector = new Detector({ formats: ["qr_code"] });
            const codes = await detector.detect(image);
            if (codes[0]?.rawValue) {
              setValue(codes[0].rawValue);
              toast.success("QR payload decoded");
            }
          } catch {
            // The uploaded image remains available even when browser decoding is unavailable.
          }
        };
        image.src = data;
        setLabel(file.name);
      } catch {
        toast.error("Upload failed. Check the file type and size.");
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return <section className="page-wrap">
    <header className="page-header"><div><div className="eyebrow"><span className="signal-line" /> SCAN CENTER / LIVE ANALYSIS</div><h1>Check the signal<br /><i>before you follow it.</i></h1><p>Paste a suspicious URL, email, SMS, or QR payload. ADYA VIGIL AI turns raw content into an explainable risk posture.</p></div><div className="header-meta"><span className="online-pill"><span className="status-dot" /> Engine ready</span><span className="mono">LAST UPDATED · JUST NOW</span></div></header>
    <div className="scan-layout">
      <div className="scan-panel paper-card">
        <div className="panel-head"><div><span className="mono">01 / INPUT SIGNAL</span><h2>What do you want to inspect?</h2></div><FileScan size={20} /></div>
        <div className="type-tabs">{scanTypes.map(({ id, label: tabLabel, icon: Icon }) => <button key={id} className={type === id ? "selected" : ""} onClick={() => { setType(id); setResult(null); }}><Icon size={16} />{tabLabel}</button>)}</div>
        <div className="field-label">Optional label <span>for scan history</span></div><Input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Invoice email from unknown sender" className="input" />
        {type === "qr" && <div className="upload-zone" onClick={() => fileRef.current?.click()}><Upload size={22} /><div><b>{uploading ? "Uploading to secure storage…" : "Drop a QR image or browse"}</b><span>PNG, JPG, WEBP, or GIF · max 5 MB</span></div><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" aria-label="Choose QR image" className="qr-file-input" onChange={e => handleFile(e.target.files?.[0])} /></div>}
        <div className="field-label">{type === "url" ? "URL or domain" : type === "email" ? "Sender, subject, and body" : type === "sms" ? "Message content" : "Decoded QR payload or context"}</div>
        <Textarea value={value} onChange={e => setValue(e.target.value)} placeholder={type === "url" ? "https://example.com/account/verify" : "Paste the complete content here…"} className="textarea" />
        <div className="scan-actions"><Button onClick={run} disabled={createScan.isPending || !value.trim()} className="scan-button"><ScanLine size={17} />{createScan.isPending ? "Analyzing…" : "Analyze signal"}<ArrowUpRight size={17} /></Button><span className="mono">LOCAL HEURISTICS · EXPLAINABLE</span></div>
      </div>
      <div className="signal-board">
        <div className="board-visual"><img src="/manus-storage/adya-vigil-hero_37ec0d65.png" alt="QR code on a security analysis desk" /><div className="visual-stamp"><span className="status-dot" /> evidence-led</div></div>
        <div className="board-copy"><span className="mono">02 / HOW IT WORKS</span><h3>Evidence, not a black box.</h3><p>The local model checks pressure language, credential requests, obfuscated destinations, sender context, and risky URL structure.</p><div className="check-row"><CheckCircle2 size={16} /> Every signal gets a plain-language reason</div><div className="check-row"><CheckCircle2 size={16} /> Every result ends with a safer next step</div></div>
      </div>
    </div>
    {result && <ResultCard result={result} />}
  </section>;
}

function ResultCard({ result }: { result: ScanResult }) {
  const riskClass = result.score >= 70 ? "danger" : result.score >= 40 ? "caution" : "safe";
  return <section className={`result-card ${riskClass}`}><div className="result-top"><div><span className="mono">03 / MODEL VERDICT</span><div className="verdict-row">{riskClass === "danger" ? <ShieldAlert /> : riskClass === "caution" ? <AlertTriangle /> : <ShieldCheck />}<h2>{result.verdict}</h2></div><p>{result.summary}</p></div><ScoreRing score={result.score} /></div><div className="result-columns"><div><span className="mono">DETECTION REASONS</span>{result.findings.map((f, i) => <div className="finding" key={i}><span className={`finding-dot ${f.tone}`} /><div><b>{f.title}</b><p>{f.detail}</p></div><strong>+{f.weight}</strong></div>)}</div><div className="next-steps"><span className="mono">WHAT TO DO NEXT</span>{result.nextSteps.map((step, i) => <div className="step" key={i}><span>0{i + 1}</span><p>{step}</p></div>)}</div></div></section>;
}

function Dashboard() {
  const { data: stats, isLoading } = trpc.scans.stats.useQuery();
  const { data: scans } = trpc.scans.list.useQuery({ limit: 5 });
  return <section className="page-wrap"><header className="page-header compact"><div><div className="eyebrow"><span className="signal-line" /> DASHBOARD / SECURITY POSTURE</div><h1>Your signal desk.</h1><p>A concise view of what ADYA VIGIL AI has seen across this workspace.</p></div><Link href="/scan"><Button className="scan-button"><ScanLine size={17} /> New scan <ArrowUpRight size={17} /></Button></Link></header><div className="posture-grid"><div className="posture-card navy"><div><span className="mono">CURRENT WORKSPACE POSTURE</span><h2>{isLoading ? "—" : stats?.averageScore ?? 0}<small>/100 avg risk</small></h2><p>{stats?.highRisk ? `${stats.highRisk} high-risk signal${stats.highRisk === 1 ? "" : "s"} need attention.` : "No high-risk signals recorded yet."}</p></div><Activity size={36} /></div><div className="stat-card"><span className="mono">TOTAL SCANS</span><strong>{stats?.total ?? 0}</strong><span className="stat-note">Saved to database</span></div><div className="stat-card red"><span className="mono">HIGH RISK</span><strong>{stats?.highRisk ?? 0}</strong><span className="stat-note">Review before acting</span></div><div className="stat-card amber"><span className="mono">CAUTION</span><strong>{stats?.mediumRisk ?? 0}</strong><span className="stat-note">Verify independently</span></div></div><div className="dashboard-columns"><div className="paper-card activity-card"><div className="panel-head"><div><span className="mono">RECENT ACTIVITY</span><h2>Latest scans</h2></div><Link href="/history" className="text-link">View all <ArrowUpRight size={15} /></Link></div>{scans?.length ? scans.map(scan => <div className="activity-row" key={scan.id}><div className={`activity-icon ${scan.score >= 70 ? "danger" : scan.score >= 40 ? "caution" : "safe"}`}>{scan.inputType === "url" ? <Link2 size={16} /> : scan.inputType === "email" ? <Mail size={16} /> : scan.inputType === "sms" ? <MessageSquareText size={16} /> : <QrCode size={16} />}</div><div><b>{scan.inputLabel}</b><span>{scan.inputType.toUpperCase()} · {new Date(scan.createdAt).toLocaleString()}</span></div><strong className={scan.score >= 70 ? "danger-text" : scan.score >= 40 ? "caution-text" : "safe-text"}>{scan.score}</strong></div>) : <div className="empty-state"><Radar size={25} /><p>No scans yet. Start by checking a suspicious signal.</p><Link href="/scan" className="text-link">Open scan center <ArrowUpRight size={15} /></Link></div>}</div><div className="evidence-card"><img src="/manus-storage/adya-vigil-evidence_8a34263b.png" alt="Abstract phishing evidence" /><div><span className="mono">MODEL NOTE</span><h3>Fast answers deserve visible evidence.</h3><p>Risk scores are guidance, not proof. Use trusted channels to verify any unexpected request.</p></div></div></div></section>;
}

function HistoryPage() {
  const { data: scans, isLoading } = trpc.scans.list.useQuery({ limit: 100 });
  return <section className="page-wrap"><header className="page-header compact"><div><div className="eyebrow"><span className="signal-line" /> HISTORY / PERSISTED RECORDS</div><h1>Every signal, kept clear.</h1><p>Review stored results and the reasoning behind each model verdict.</p></div></header><div className="paper-card table-card"><div className="table-head"><span className="mono">{scans?.length ?? 0} SAVED RECORDS</span><span className="mono">UTC → LOCAL DISPLAY</span></div>{isLoading ? <div className="empty-state"><Radar className="spin" size={25} /><p>Loading scan history…</p></div> : scans?.length ? scans.map(scan => <div className="history-row" key={scan.id}><div className={`activity-icon ${scan.score >= 70 ? "danger" : scan.score >= 40 ? "caution" : "safe"}`}>{scan.inputType === "url" ? <Link2 size={16} /> : scan.inputType === "email" ? <Mail size={16} /> : scan.inputType === "sms" ? <MessageSquareText size={16} /> : <QrCode size={16} />}</div><div className="history-main"><b>{scan.inputLabel}</b><p>{scan.summary}</p><span className="mono">{scan.inputType.toUpperCase()} · {new Date(scan.createdAt).toLocaleString()}</span></div><div className={`history-score ${scan.score >= 70 ? "danger-text" : scan.score >= 40 ? "caution-text" : "safe-text"}`}><strong>{scan.score}</strong><span>{scan.verdict}</span></div></div>) : <div className="empty-state"><History size={25} /><p>Your persisted scan history will appear here.</p></div>}</div></section>;
}

function AboutPage() {
  return <section className="page-wrap"><header className="page-header compact"><div><div className="eyebrow"><span className="signal-line" /> ABOUT / ADYA VIGIL AI</div><h1>A clearer moment<br /><i>before the click.</i></h1><p>ADYA VIGIL AI is an explainable phishing-signal desk for URLs, emails, SMS messages, and QR payloads.</p></div></header><div className="about-grid"><div className="paper-card about-copy"><span className="mono">THE MODEL IN PLAIN LANGUAGE</span><h2>Watchful, lucid, grounded.</h2><p>The working model uses deterministic local heuristics to inspect content for common phishing signals: urgency pressure, requests for sensitive data, action prompts, redirect patterns, obfuscated URLs, and suspicious domain structures.</p><p>It is intentionally transparent. A score is never presented alone: each result includes the reasons that moved the score and practical next steps to reduce exposure.</p><div className="principles"><div><b>01</b><span><strong>Explainable</strong>Every finding is readable and tied to a visible input signal.</span></div><div><b>02</b><span><strong>Persistent</strong>Results and uploaded QR metadata are saved to the workspace database and storage.</span></div><div><b>03</b><span><strong>Practical</strong>Guidance focuses on what to do next, not just what went wrong.</span></div></div></div><div className="about-side"><div className="pattern-card"><img src="/manus-storage/adya-vigil-pattern_f877bdd0.png" alt="Abstract signal pattern" /><div className="pattern-overlay"><img src="/manus-storage/adya-vigil-mark_f6e1ffca.png" alt="ADYA VIGIL AI mark" /><span className="mono">SIGNAL CITRON · #D8F23F</span></div></div><div className="quote-card"><CircleHelp size={20} /><p>“A suspicious sender is not proof of harm. Here is the evidence we found.”</p></div></div></div></section>;
}

export default function Home() {
  const [location] = useLocation();
  return <Shell>{location === "/scan" ? <ScanCenter /> : location === "/history" ? <HistoryPage /> : location === "/about" ? <AboutPage /> : <Dashboard />}</Shell>;
}
