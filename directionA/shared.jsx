/* Direction A — Shared building blocks
 * SEO-Pass: alle href="#" durch echte Hash-Routes ersetzt.
 */

const ALogo = ({ small = false }) => (
  <a href="#/" className="dirA-nav-logo" style={{ textDecoration: "none", color: "inherit" }}>
    <img src="/assets/logo-ir.png" alt="Innovation Republic" style={{ height: small ? 22 : 28 }} />
  </a>
);

const ANav = ({ active = "home" }) => (
  <nav className="dirA-nav">
    <ALogo />
    <div className="dirA-nav-links">
      <a href="#/plattform" style={active === "platform" ? { color: "var(--accent-red)" } : {}}>Prozess</a>
      <a href="#/kmu" style={active === "kmu" ? { color: "var(--accent-red)" } : {}}>Für Bedarfsträger</a>
      <a href="#/anbieter" style={active === "anbieter" ? { color: "var(--accent-red)" } : {}}>Für Anbieter</a>
      <a href="#/foerderung" style={active === "spenden" ? { color: "var(--accent-red)" } : {}}>Förderung</a>
      <a href="#/ueber" style={active === "ueber" ? { color: "var(--accent-red)" } : {}}>Über uns</a>
    </div>
    <div className="dirA-nav-actions">
      <span className="dirA-lang">
        <span className="active">DE</span>
        <span>/</span>
        <span>EN</span>
      </span>
      <a href="#/kmu" className="dirA-btn dirA-btn-ghost">Anmelden</a>
      <a href="#/kmu" className="dirA-btn dirA-btn-primary">Prozess starten <span className="arr">→</span></a>
    </div>
  </nav>
);

const TOOLS = [
  { code: "RB", name: "Robert", desc: "Ideation · Bedarfsformulierung", placeholder: "Partner-Slot offen", status: "soon" },
  { code: "KO", name: "Konrad", desc: "Scouting · Partner-Matching", placeholder: "Partner-Slot offen", status: "soon" },
  { code: "SP", name: "SpinIn", desc: "Competition · Marktplatz", placeholder: "Live · betrieben von SpinIn", status: "live" },
  { code: "JA", name: "James", desc: "Cooperation · Virtuelles PMO", placeholder: "Partner-Slot offen", status: "soon" },
  { code: "RO", name: "Roland", desc: "Berater-Marktplatz", placeholder: "Partner-Slot offen", status: "soon" },
  { code: "FÖ", name: "Fördergeld-Check", desc: "Risiko & Finanzierung", placeholder: "Partner-Slot offen", status: "soon" },
];

const APhases = [
  { num: "01", name: "Ideation", desc: "KI-gestützte Strukturierung von Bedarfen.", tool: "Robert", status: "soon" },
  { num: "02", name: "Scouting", desc: "Kuratiertes Matching passender Anbieter.", tool: "Konrad", status: "soon" },
  { num: "03", name: "Competition", desc: "14-Tage Ausschreibung. Vergabekonform.", tool: "SpinIn", status: "live" },
  { num: "04", name: "Cooperation", desc: "Begleitung des PoC in 100 Werktagen.", tool: "James", status: "soon" },
  { num: "05", name: "Erkenntnis", desc: "Skalierung oder dokumentierter Abbruch.", tool: "Dokumentation", status: "live" },
];

const AChevron = () => (
  <span className="dirA-chevron" aria-hidden>
    <span></span><span></span><span></span>
  </span>
);

const AFooter = () => (
  <footer className="dirA-footer">
    <div className="top">
      <div className="brand-block">
        <img src="/assets/logo-ir.png" alt="Innovation Republic" />
        <p>Gemeinnütziger Innovations-Kurator. Best-in-Class pro Phase — statt Eigenbau und Tool-Wildwuchs.</p>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <a href="#" style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "var(--f-mono)", textDecoration: "none" }}>LinkedIn ↗</a>
          <a href="#" style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "var(--f-mono)", textDecoration: "none" }}>Newsletter ↗</a>
        </div>
      </div>
      <div>
        <h5>Prozess</h5>
        <ul>
          <li><a href="#/plattform">Wie es funktioniert</a></li>
          <li><a href="#/plattform">App-Store</a></li>
          <li><a href="#/plattform">SpinIn Marktplatz</a></li>
          <li><a href="#/plattform">Roadmap</a></li>
        </ul>
      </div>
      <div>
        <h5>Mitwirken</h5>
        <ul>
          <li><a href="#/kmu">Bedarf einreichen</a></li>
          <li><a href="#/anbieter">Anbieter werden</a></li>
          <li><a href="#/foerderung">Spenden & Fördern</a></li>
          <li><a href="#/foerderung">Partner werden</a></li>
        </ul>
      </div>
      <div>
        <h5>Initiative</h5>
        <ul>
          <li><a href="#/ueber">Über uns</a></li>
          <li><a href="#/ueber">Vorstand</a></li>
          <li><a href="#/foerderung">Transparenz</a></li>
          <li><a href="#/ueber">Kontakt</a></li>
        </ul>
      </div>
    </div>
    <div className="bottom">
      <span>© 2026 Innovation Republic · Gemeinnützige Initiative von Unternehmern (in Gründung)</span>
      <span>
        <a href="#/impressum">Impressum</a>
        <a href="#/datenschutz">Datenschutz</a>
        <a href="#/ueber">Satzung</a>
      </span>
    </div>
  </footer>
);

const ACTAStrip = () => (
  <section style={{ padding: "0 0 96px", background: "var(--bg)" }}>
    <div className="dirA-cta-strip">
      <div>
        <h2>Sie spüren Innovations-<br />Druck — wissen aber<br />nicht wie weiter?</h2>
        <p style={{ marginTop: 16 }}>Sprechen Sie uns an. Wir kuratieren mit Ihnen den passenden Prozess — von der Bedarfsschärfung bis zum dokumentierten Sprint-Ergebnis. Kostenfrei, unverbindlich, gemeinnützig.</p>
      </div>
      <div className="actions">
        <a href="#/plattform" className="dirA-btn dirA-btn-ghost">Demo ansehen</a>
        <a href="#/kmu" className="dirA-btn dirA-btn-primary">Prozess starten <span className="arr">→</span></a>
      </div>
    </div>
  </section>
);

Object.assign(window, {
  ALogo, ANav, AFooter, ACTAStrip, AChevron, TOOLS, APhases
});
