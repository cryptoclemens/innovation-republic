/* Direction B — Shared */

const BLogo = () => (
  <a href="#" className="dirB-nav-logo" style={{ textDecoration: "none", color: "inherit" }}>
    <img src="assets/logo-ir.png" alt="Innovation Republic" />
  </a>
);

const BNav = ({ active = "home" }) => (
  <nav className="dirB-nav">
    <BLogo />
    <div className="dirB-nav-links">
      <a href="#" className={active === "platform" ? "active" : ""}>Plattform</a>
      <a href="#" className={active === "kmu" ? "active" : ""}>Auftraggeber</a>
      <a href="#" className={active === "anbieter" ? "active" : ""}>Anbieter</a>
      <a href="#" className={active === "spenden" ? "active" : ""}>Förderung</a>
      <a href="#" className={active === "ueber" ? "active" : ""}>Initiative</a>
    </div>
    <div className="dirB-nav-actions">
      <span className="dirB-lang"><span className="a">DE</span> · EN</span>
      <a href="#" className="dirB-btn dirB-btn-primary">Bedarf einreichen →</a>
    </div>
  </nav>
);

const BFooter = () => (
  <footer className="dirB-footer">
    <div className="top">
      <div className="brand-block">
        <img src="assets/logo-ir.png" alt="Innovation Republic" />
        <p><em style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>Aufträge</em> statt Fördergeld. Eine gemeinnützige Initiative von Unternehmern für marktbasierte Innovationsförderung.</p>
      </div>
      <div>
        <h5>Plattform</h5>
        <ul>
          <li><a href="#">Wie es funktioniert</a></li>
          <li><a href="#">App-Verzeichnis</a></li>
          <li><a href="#">SpinIn Marktplatz</a></li>
          <li><a href="#">Roadmap</a></li>
        </ul>
      </div>
      <div>
        <h5>Mitwirken</h5>
        <ul>
          <li><a href="#">Bedarf einreichen</a></li>
          <li><a href="#">Anbieter werden</a></li>
          <li><a href="#">Spenden & Fördern</a></li>
          <li><a href="#">Partner werden</a></li>
        </ul>
      </div>
      <div>
        <h5>Initiative</h5>
        <ul>
          <li><a href="#">Über uns</a></li>
          <li><a href="#">Vorstand</a></li>
          <li><a href="#">Transparenz</a></li>
          <li><a href="#">Kontakt</a></li>
        </ul>
      </div>
    </div>
    <div className="bottom">
      <span>© 2026 Innovation Republic · Gemeinnützige Initiative von Unternehmern (in Gründung)</span>
      <span>
        <a href="#">Impressum</a>
        <a href="#">Datenschutz</a>
        <a href="#">Satzung</a>
      </span>
    </div>
  </footer>
);

const BCTA = () => (
  <section className="dirB-cta">
    <div className="dirB-cta-inner">
      <h2>Schreiben Sie<br /><em>Aufträge</em> aus.<br />Nicht Anträge.</h2>
      <div>
        <p className="lede" style={{ marginBottom: 20 }}>Formulieren Sie Ihren Innovationsbedarf in 10 Minuten. Wir kuratieren passende Anbieter und führen den Prozess vergabekonform durch — kostenfrei.</p>
        <div className="actions">
          <a href="#" className="dirB-btn dirB-btn-ghost">Demo ansehen</a>
          <a href="#" className="dirB-btn dirB-btn-primary">Bedarf einreichen →</a>
        </div>
      </div>
    </div>
  </section>
);

const BTOOLS = [
  { code: "R", name: "Robert", desc: "KI-gestützte Strukturierung von Innovationsbedarfen.", phase: "Ideation", placeholder: "Partner-Slot offen", status: "soon" },
  { code: "K", name: "Konrad", desc: "Kuratiertes Matching passender Lösungsanbieter.", phase: "Scouting", placeholder: "Partner-Slot offen", status: "soon" },
  { code: "S", name: "SpinIn", desc: "14-Tage-Ausschreibung. Vergabekonformer Marktplatz.", phase: "Competition", placeholder: "Live · betrieben von SpinIn", status: "live" },
  { code: "J", name: "James", desc: "Virtuelles PMO für 100-Werktage-Proof-of-Concepts.", phase: "Cooperation", placeholder: "Partner-Slot offen", status: "soon" },
  { code: "R", name: "Roland", desc: "Marktplatz für externe Berater pro Prozess-Phase.", phase: "Beratung", placeholder: "Partner-Slot offen", status: "soon" },
  { code: "F", name: "Fördergeld-Check", desc: "Risiko- und Finanzierungs-Assessment.", phase: "Optional", placeholder: "Partner-Slot offen", status: "soon" },
];

const BPhases = [
  { num: "I", name: "Ideation", desc: "Sie formulieren Ihren Innovationsbedarf — KI-unterstützt strukturiert.", tool: "Robert", soon: true },
  { num: "II", name: "Scouting", desc: "Passende Startups & Anbieter werden automatisiert kuratiert.", tool: "Konrad", soon: true },
  { num: "III", name: "Competition", desc: "14-tägige, vergabekonforme Ausschreibung mit Lösungsvorschlägen.", tool: "SpinIn", soon: false },
  { num: "IV", name: "Cooperation", desc: "Begleiteter Proof-of-Concept in 100 Werktagen.", tool: "James", soon: true },
  { num: "V", name: "Erkenntnis", desc: "Skalierung oder dokumentierter Abbruch — beides ein Gewinn.", tool: "Dokumentation", soon: false },
];

Object.assign(window, { BLogo, BNav, BFooter, BCTA, BTOOLS, BPhases });
