/* Direction A — Innovations- & Digitalisierungs-Check
   6-Schritt-Wizard als Modal-Overlay.
   Trigger:
     - Auto-Open nach 15s (1x pro Browser, via localStorage)
     - Re-Entry über Hero-CTA + Sticky-Pill rechts unten
   Ergebnis:
     - Reifegrad-Score über 4 Dimensionen (Radar/Bars)
     - 90-Tage-Roadmap (3 Schritte)
     - PDF-Download + Mail-Report-Capture
*/

const CHECK_LS_SEEN = "ir_check_seen_v1";
const CHECK_LS_RESULT = "ir_check_result_v1";

/* ---------- Wizard-Konfiguration ---------- */

const ABTEILUNGEN = [
  "Geschäftsführung", "IT", "Marketing / Vertrieb",
  "Produktion / Fertigung", "Forschung & Entwicklung",
  "Personal / HR", "Finanzen / Controlling",
  "Einkauf / Logistik", "Sonstiges"
];

const DIMENSIONEN = [
  { key: "strategy",  label: "Innovations-Strategie", desc: "Wie klar ist Ihr Innovations-Auftrag formuliert?" },
  { key: "process",   label: "Prozess-Reife",         desc: "Wie strukturiert laufen Innovations-Vorhaben heute?" },
  { key: "tech",      label: "Tech & Daten",          desc: "Wie gut ist Ihre digitale Basis aufgestellt?" },
  { key: "people",    label: "Menschen & Kultur",     desc: "Wie offen ist Ihr Team für neue Wege?" },
];

const SKALA = [
  { v: 1, l: "Ad-hoc",       d: "Wir handeln punktuell, ohne System." },
  { v: 2, l: "In Ansätzen",  d: "Erste Ansätze, aber unverbindlich." },
  { v: 3, l: "Strukturiert", d: "Wir haben Routinen, aber Lücken." },
  { v: 4, l: "Systematisch", d: "Klar geregelt und gelebt." },
  { v: 5, l: "Skalierend",   d: "Vorbild im Markt, kontinuierlich verbessert." },
];

const HORIZONTE = [
  { key: "now",   l: "Sofort", d: "Wir wollen in den nächsten 30 Tagen starten." },
  { key: "q",     l: "Dieses Quartal", d: "Innerhalb von 90 Tagen." },
  { key: "year",  l: "Dieses Jahr", d: "Strategisch eingetaktet, kein akuter Druck." },
  { key: "explore", l: "Erst sondieren", d: "Noch unklar, ob & wann." },
];

const BEDARFE = [
  "Bedarf schärfen / Idee strukturieren",
  "Passenden Anbieter finden",
  "PoC oder Pilot starten",
  "Förderung & Finanzierung klären",
  "Bestehendes Vorhaben retten",
  "Mehrere — alles auf einmal",
];

/* ---------- Result-Berechnung ---------- */

function computeResult(answers) {
  const dimVals = DIMENSIONEN.map(d => ({
    key: d.key, label: d.label, val: answers.scores?.[d.key] ?? 1
  }));
  const sum = dimVals.reduce((a, x) => a + x.val, 0);
  const score = Math.round((sum / (DIMENSIONEN.length * 5)) * 100);

  let stage, stageDesc;
  if (score < 35)      { stage = "Startaufstellung";  stageDesc = "Sie haben Innovations-Druck, aber noch wenig Struktur. Hier zahlt sich ein kuratierter Prozess am stärksten aus."; }
  else if (score < 60) { stage = "Im Anlauf";          stageDesc = "Sie sind unterwegs, aber Tool- und Prozessbrüche bremsen. Best-in-Class pro Phase bringt Sie aufs nächste Level."; }
  else if (score < 80) { stage = "Auf Kurs";           stageDesc = "Solide Basis. Innovation Republic hilft, gezielt Lücken zu schließen — z. B. beim Anbieter-Matching oder Sprint-Format."; }
  else                 { stage = "Vorbild-Niveau";     stageDesc = "Hervorragende Reife. Kommen Sie als Anbieter, Förderer oder Sounding-Board ins Netzwerk."; }

  // Schwächste Dimension finden — bestimmt Roadmap-Akzent
  const weakest = [...dimVals].sort((a, b) => a.val - b.val)[0];

  const roadmapByDim = {
    strategy: [
      { d: "Tag 0–14",   t: "Bedarf schärfen",          b: "Mit Robert den unscharfen Innovations-Auftrag in eine ausschreibungsfähige Bedarfsformulierung übersetzen." },
      { d: "Tag 15–30",  t: "Anbieter-Shortlist",       b: "Konrad kuratiert 3–5 passende Anbieter aus Startup-, Mittelstands- und Forschungs-Welt." },
      { d: "Tag 31–90",  t: "100-Werktage-Sprint",      b: "Strukturierter PoC mit James als virtuellem PMO. Ergebnis: Skalieren oder dokumentierter Abbruch." },
    ],
    process: [
      { d: "Tag 0–14",   t: "Prozess-Diagnose",         b: "Wir mappen Ihre heutigen Innovations-Routinen und identifizieren die größten Brüche." },
      { d: "Tag 15–45",  t: "Sprint-Format etablieren", b: "Standardisierter 100-WT-Vertrag, klare Phasen, dokumentierte Übergaben." },
      { d: "Tag 46–90",  t: "Erst-Vorhaben durchziehen", b: "Pilot-Sprint live — wir begleiten, bis das Format sitzt." },
    ],
    tech: [
      { d: "Tag 0–14",   t: "Tech-Lage aufnehmen",      b: "Bestandsaufnahme Daten, Systeme, Schnittstellen — kein Audit-Theater, fokussiert auf das Vorhaben." },
      { d: "Tag 15–45",  t: "Spezialist matchen",       b: "Konrad findet einen Anbieter, der genau Ihre Tech-Lücke schließt — nicht das nächstgrößte Beratungshaus." },
      { d: "Tag 46–90",  t: "PoC mit klarem KPI",       b: "Datengetriebener Pilot mit messbarem Ergebnis nach 100 Werktagen." },
    ],
    people: [
      { d: "Tag 0–14",   t: "Team-Lesart angleichen",   b: "Innovations-Auftrag wird gemeinsam geschärft — Robert moderiert die Bedarfs-Workshops." },
      { d: "Tag 15–45",  t: "Externe Impulse holen",    b: "Kuratierte Anbieter bringen frische Perspektiven, statt interner Lähmung." },
      { d: "Tag 46–90",  t: "Lernen sichtbar machen",   b: "Strukturierte Doku des Sprints — auch ein Abbruch ist ein wertvolles Ergebnis." },
    ],
  };

  return {
    score, stage, stageDesc,
    dims: dimVals,
    weakest,
    roadmap: roadmapByDim[weakest.key],
    horizon: answers.horizon,
    needs: answers.needs ?? [],
    company: answers.company,
    department: answers.department,
    incognito: answers.incognito,
  };
}

/* ---------- Modal-Shell ---------- */

const CheckModal = ({ open, onClose, jumpToResult = false }) => {
  const [step, setStep] = React.useState(jumpToResult ? 6 : 0);
  const [answers, setAnswers] = React.useState({
    company: "", department: "", incognito: false,
    scores: { strategy: 3, process: 3, tech: 3, people: 3 },
    needs: [], horizon: "q",
    email: "",
  });
  const [submitted, setSubmitted] = React.useState(false);

  // Reset bei Re-Open (außer beim direkten Result-Sprung)
  React.useEffect(() => {
    if (open && !jumpToResult) {
      setStep(0);
      setSubmitted(false);
    }
    if (open && jumpToResult) {
      const stored = localStorage.getItem(CHECK_LS_RESULT);
      if (stored) {
        try {
          const a = JSON.parse(stored);
          setAnswers(a);
          setStep(6);
        } catch (e) {}
      }
    }
  }, [open, jumpToResult]);

  // ESC zu schließen
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const upd = (patch) => setAnswers(a => ({ ...a, ...patch }));
  const updScore = (key, v) => setAnswers(a => ({ ...a, scores: { ...a.scores, [key]: v } }));

  const TOTAL = 6; // 0..5 Wizard, 6 = Ergebnis
  const canNext = () => {
    if (step === 0) return answers.incognito || answers.company.trim().length > 0;
    if (step === 1) return answers.department.length > 0;
    if (step === 2) return true; // Slider haben Defaults
    if (step === 3) return answers.needs.length > 0;
    if (step === 4) return !!answers.horizon;
    if (step === 5) return true; // Mail optional auf Ergebnisseite
    return true;
  };

  const next = () => {
    if (step < 5) setStep(s => s + 1);
    else if (step === 5) {
      // Ergebnis berechnen + lokal sichern
      try { localStorage.setItem(CHECK_LS_RESULT, JSON.stringify(answers)); } catch (e) {}
      setStep(6);
    }
  };
  const back = () => setStep(s => Math.max(0, s - 1));

  if (!open) return null;

  const result = step === 6 ? computeResult(answers) : null;

  return (
    <div className="dirA-check-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="dirA-check-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="dirA-check-head">
          <div className="dirA-check-brand">
            <span className="dirA-chevron"><span></span><span></span><span></span></span>
            <span className="mono" style={{ color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 11 }}>
              Innovations- & Digitalisierungs-Check
            </span>
          </div>
          <button className="dirA-check-close" onClick={onClose} aria-label="Schließen">×</button>
        </div>

        {/* Progress */}
        {step < 6 && (
          <div className="dirA-check-progress">
            <div className="dirA-check-progress-text">
              <span>Schritt {step + 1} von {TOTAL}</span>
              <span>·</span>
              <span>{["Unternehmen","Abteilung","Reifegrad","Bedarf","Horizont","Kontakt"][step]}</span>
            </div>
            <div className="dirA-check-progress-bar">
              {Array.from({length: TOTAL}).map((_, i) => (
                <span key={i} className={i <= step ? "fill" : ""}></span>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="dirA-check-body">
          {step === 0 && <Step0 answers={answers} upd={upd} />}
          {step === 1 && <Step1 answers={answers} upd={upd} />}
          {step === 2 && <Step2 answers={answers} updScore={updScore} />}
          {step === 3 && <Step3 answers={answers} upd={upd} />}
          {step === 4 && <Step4 answers={answers} upd={upd} />}
          {step === 5 && <Step5 answers={answers} upd={upd} />}
          {step === 6 && <CheckResult result={result} answers={answers} upd={upd} submitted={submitted} setSubmitted={setSubmitted} />}
        </div>

        {/* Footer */}
        {step < 6 && (
          <div className="dirA-check-foot">
            <div className="dirA-check-foot-meta">
              <span>Ihre Daten werden ausschließlich für die Analyse verwendet — keine Speicherung ohne Einwilligung.</span>
            </div>
            <div className="dirA-check-foot-actions">
              {step > 0 && <button className="dirA-btn dirA-btn-ghost" onClick={back}>Zurück</button>}
              <button
                className="dirA-btn dirA-btn-primary"
                onClick={next}
                disabled={!canNext()}
                style={!canNext() ? { opacity: 0.4, cursor: "not-allowed" } : {}}
              >
                {step === 5 ? "Auswertung anzeigen" : "Weiter"} <span className="arr">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- Steps ---------- */

const Step0 = ({ answers, upd }) => (
  <div className="dirA-check-step">
    <h2 className="dirA-check-q">Wie heißt dein Unternehmen?</h2>
    <p className="dirA-check-sub">Der Name hilft uns, branchenspezifische Empfehlungen zu geben.</p>
    <div className="dirA-field" style={{ maxWidth: 480 }}>
      <label>Unternehmensname</label>
      <input
        type="text"
        value={answers.company}
        onChange={e => upd({ company: e.target.value })}
        placeholder="z. B. Müller Maschinenbau GmbH"
        disabled={answers.incognito}
        style={answers.incognito ? { opacity: 0.4 } : {}}
      />
    </div>
    <label className="dirA-check-toggle">
      <input
        type="checkbox"
        checked={answers.incognito}
        onChange={e => upd({ incognito: e.target.checked })}
      />
      <span>Incognito-Modus (Analyse ohne Unternehmensname)</span>
    </label>
  </div>
);

const Step1 = ({ answers, upd }) => (
  <div className="dirA-check-step">
    <h2 className="dirA-check-q">In welcher Abteilung arbeitest du?</h2>
    <p className="dirA-check-sub">So passen wir die Beispiele und Empfehlungen auf Ihre Perspektive an.</p>
    <div className="dirA-check-grid">
      {ABTEILUNGEN.map(d => (
        <button
          key={d}
          className={`dirA-check-chip ${answers.department === d ? "active" : ""}`}
          onClick={() => upd({ department: d })}
        >{d}</button>
      ))}
    </div>
  </div>
);

const Step2 = ({ answers, updScore }) => (
  <div className="dirA-check-step">
    <h2 className="dirA-check-q">Wo stehen Sie heute?</h2>
    <p className="dirA-check-sub">Vier Dimensionen — kurze Selbstauskunft. Es gibt keine richtige Antwort, nur eine ehrliche.</p>
    <div className="dirA-check-dims">
      {DIMENSIONEN.map(dim => {
        const val = answers.scores[dim.key];
        const lbl = SKALA.find(s => s.v === val);
        return (
          <div key={dim.key} className="dirA-check-dim">
            <div className="dirA-check-dim-head">
              <div>
                <div className="dirA-check-dim-label">{dim.label}</div>
                <div className="dirA-check-dim-desc">{dim.desc}</div>
              </div>
              <div className="dirA-check-dim-val">
                <span className="num">{val}</span>
                <span className="sep">/</span>
                <span className="max">5</span>
              </div>
            </div>
            <div className="dirA-check-scale">
              {SKALA.map(s => (
                <button
                  key={s.v}
                  className={`dirA-check-tick ${val === s.v ? "active" : ""}`}
                  onClick={() => updScore(dim.key, s.v)}
                  title={`${s.l} — ${s.d}`}
                >
                  <span className="dot"></span>
                  <span className="lbl">{s.l}</span>
                </button>
              ))}
            </div>
            {lbl && <div className="dirA-check-dim-hint">→ {lbl.d}</div>}
          </div>
        );
      })}
    </div>
  </div>
);

const Step3 = ({ answers, upd }) => {
  const toggle = (b) => {
    const has = answers.needs.includes(b);
    upd({ needs: has ? answers.needs.filter(x => x !== b) : [...answers.needs, b] });
  };
  return (
    <div className="dirA-check-step">
      <h2 className="dirA-check-q">Wo brennt's am stärksten?</h2>
      <p className="dirA-check-sub">Mehrfachauswahl möglich.</p>
      <div className="dirA-check-grid">
        {BEDARFE.map(b => (
          <button
            key={b}
            className={`dirA-check-chip ${answers.needs.includes(b) ? "active" : ""}`}
            onClick={() => toggle(b)}
          >{b}</button>
        ))}
      </div>
    </div>
  );
};

const Step4 = ({ answers, upd }) => (
  <div className="dirA-check-step">
    <h2 className="dirA-check-q">Wann soll's losgehen?</h2>
    <p className="dirA-check-sub">Wir passen Roadmap und Anbieter-Vorschläge an Ihren Zeithorizont an.</p>
    <div className="dirA-check-options">
      {HORIZONTE.map(h => (
        <button
          key={h.key}
          className={`dirA-check-option ${answers.horizon === h.key ? "active" : ""}`}
          onClick={() => upd({ horizon: h.key })}
        >
          <div className="t">{h.l}</div>
          <div className="d">{h.d}</div>
        </button>
      ))}
    </div>
  </div>
);

const Step5 = ({ answers, upd }) => (
  <div className="dirA-check-step">
    <h2 className="dirA-check-q">Wohin schicken wir Ihren Report?</h2>
    <p className="dirA-check-sub">Optional. Sie sehen das Ergebnis in jedem Fall direkt im Anschluss — ein Mail-Report enthält zusätzlich konkrete Anbieter-Profile und Förder-Hinweise.</p>
    <div className="dirA-field" style={{ maxWidth: 480 }}>
      <label>E-Mail (optional)</label>
      <input
        type="email"
        value={answers.email}
        onChange={e => upd({ email: e.target.value })}
        placeholder="ihr.name@firma.de"
      />
    </div>
    <p className="dirA-check-fineprint">
      Wir senden Ihnen einmalig den Report. Kein Newsletter ohne Zustimmung. Datenschutz nach DSGVO.
    </p>
  </div>
);

/* ---------- Result Screen ---------- */

const CheckResult = ({ result, answers, upd, submitted, setSubmitted }) => {
  const submitMail = (e) => {
    e.preventDefault();
    if (!answers.email || !answers.email.includes("@")) return;
    setSubmitted(true);
  };

  const downloadPdf = () => {
    // Stub: in echtem Build würden wir hier eine PDF generieren.
    // Für den Prototypen: ein .txt mit dem Report — zeigt das Verhalten.
    const lines = [
      "INNOVATION REPUBLIC — Innovations- & Digitalisierungs-Check",
      "============================================================",
      "",
      `Unternehmen: ${answers.incognito ? "(Incognito)" : answers.company || "—"}`,
      `Abteilung:   ${answers.department || "—"}`,
      "",
      `Reifegrad-Score: ${result.score}/100 — ${result.stage}`,
      "",
      "Dimensionen:",
      ...result.dims.map(d => `  · ${d.label}: ${d.val}/5`),
      "",
      "Schwerpunkt für die nächsten 90 Tage:",
      `  → ${result.weakest.label}`,
      "",
      "90-Tage-Roadmap:",
      ...result.roadmap.map(r => `  ${r.d} — ${r.t}: ${r.b}`),
      "",
      "Bedarf:",
      ...result.needs.map(n => `  · ${n}`),
      "",
      `Zeit-Horizont: ${HORIZONTE.find(h => h.key === result.horizon)?.l || "—"}`,
      "",
      "© Innovation Republic — gemeinnützig (i.Gr.)",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IR-Check-Report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dirA-check-result">
      {/* Header */}
      <div className="dirA-check-result-head">
        <div className="dirA-check-result-eyebrow">
          <span className="mono">Auswertung · {answers.incognito ? "Incognito-Modus" : (answers.company || "Ihr Unternehmen")}</span>
        </div>
        <h2 className="dirA-check-result-stage">{result.stage}.</h2>
        <p className="dirA-check-result-stagedesc">{result.stageDesc}</p>
      </div>

      {/* Score + Radar */}
      <div className="dirA-check-result-score">
        <div className="dirA-check-result-score-big">
          <div className="circle">
            <ScoreRing score={result.score} />
            <div className="num-overlay">
              <div className="num">{result.score}</div>
              <div className="of">/ 100</div>
              <div className="lab mono">Reifegrad-Score</div>
            </div>
          </div>
        </div>
        <div className="dirA-check-result-bars">
          <div className="mono lbl" style={{ marginBottom: 14 }}>Profil je Dimension</div>
          {result.dims.map(d => (
            <div key={d.key} className="dirA-check-bar">
              <div className="bar-head">
                <span className="lbl-d">{d.label}</span>
                <span className="mono val">{d.val}/5</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(d.val / 5) * 100}%`, background: d.key === result.weakest.key ? "var(--accent-red)" : "var(--ink)" }}></div>
              </div>
              {d.key === result.weakest.key && (
                <div className="bar-hint mono">↑ Schwerpunkt für die nächsten 90 Tage</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="dirA-check-result-roadmap">
        <div className="dirA-check-result-section-head">
          <div className="dirA-secno">90-Tage-Roadmap · 01</div>
          <h3>Ihr nächster Sprint — kuratiert von Innovation Republic.</h3>
        </div>
        <div className="dirA-check-roadmap-grid">
          {result.roadmap.map((r, i) => (
            <div key={i} className="dirA-check-roadmap-card">
              <div className="mono dirA-check-roadmap-when">{r.d}</div>
              <div className="dirA-check-roadmap-title">{r.t}</div>
              <p className="dirA-check-roadmap-body">{r.b}</p>
              <div className="mono dirA-check-roadmap-tool">
                {i === 0 && "→ Robert · Bedarfsformulierung"}
                {i === 1 && "→ Konrad · Anbieter-Matching"}
                {i === 2 && "→ James · Sprint-Begleitung"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capture */}
      <div className="dirA-check-result-capture">
        <div className="dirA-check-result-capture-text">
          <div className="dirA-secno">Report · 02</div>
          <h3>Mitnehmen oder zumailen lassen.</h3>
          <p className="body">Wir generieren ein PDF mit Score, Roadmap, passenden Anbieter-Profilen und einer Förder-Übersicht für Ihre Branche. Wahlweise Download oder Mail-Versand.</p>
        </div>
        <div className="dirA-check-result-capture-actions">
          <button className="dirA-btn dirA-btn-primary" onClick={downloadPdf}>
            PDF herunterladen <span className="arr">↓</span>
          </button>
          {!submitted ? (
            <form className="dirA-check-mail" onSubmit={submitMail}>
              <input
                type="email"
                value={answers.email}
                onChange={e => upd({ email: e.target.value })}
                placeholder="ihr.name@firma.de"
                required
              />
              <button type="submit" className="dirA-btn dirA-btn-ghost">
                Per Mail senden <span className="arr">→</span>
              </button>
            </form>
          ) : (
            <div className="dirA-check-mail-sent mono">
              ✓ Wird an <strong>{answers.email}</strong> gesendet.
            </div>
          )}
        </div>
      </div>

      {/* Next steps */}
      <div className="dirA-check-result-next">
        <div className="dirA-check-result-next-head">
          <div className="dirA-secno">Direkt weiter · 03</div>
          <h3>Möchten Sie loslegen?</h3>
        </div>
        <div className="dirA-check-result-next-grid">
          <a href="#" className="dirA-check-result-next-card">
            <div className="t">Bedarfs-Workshop buchen</div>
            <p>30 Min mit unserem Kurator. Kostenfrei, unverbindlich.</p>
            <span className="mono arr">Termin wählen →</span>
          </a>
          <a href="#" className="dirA-check-result-next-card">
            <div className="t">Anbieter-Vorschläge ansehen</div>
            <p>3–5 vorausgewählte Anbieter aus dem kuratierten Pool.</p>
            <span className="mono arr">Liste öffnen →</span>
          </a>
          <a href="#" className="dirA-check-result-next-card">
            <div className="t">Förder-Kompass öffnen</div>
            <p>Welche Programme greifen für Ihre Branche und Region?</p>
            <span className="mono arr">Kompass starten →</span>
          </a>
        </div>
      </div>
    </div>
  );
};

/* ---------- ScoreRing (SVG) ---------- */

const ScoreRing = ({ score }) => {
  const r = 76, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
      <circle
        cx="100" cy="100" r={r}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="10"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
        style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.2,.8,.2,1)" }}
      />
      {/* tick marks */}
      {[0,1,2,3,4].map(i => {
        const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
        const x1 = 100 + Math.cos(a) * (r + 12);
        const y1 = 100 + Math.sin(a) * (r + 12);
        const x2 = 100 + Math.cos(a) * (r + 18);
        const y2 = 100 + Math.sin(a) * (r + 18);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line-2)" strokeWidth="1" />;
      })}
    </svg>
  );
};

/* ---------- Sticky-Pill (Re-Entry) ---------- */

const CheckStickyPill = ({ onOpen, onResume, hasResult }) => (
  <div className="dirA-check-pill-wrap">
    {hasResult && (
      <button className="dirA-check-pill secondary" onClick={onResume}>
        <span className="mono">Ergebnis ansehen</span>
      </button>
    )}
    <button className="dirA-check-pill primary" onClick={onOpen}>
      <span className="dirA-chevron"><span></span><span></span><span></span></span>
      <span>Innovations-Check</span>
      <span className="mono small">3 Min</span>
    </button>
  </div>
);

Object.assign(window, {
  CheckModal, CheckStickyPill, CHECK_LS_SEEN, CHECK_LS_RESULT
});
