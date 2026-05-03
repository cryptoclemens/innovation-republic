/* Direction B — Home */

const BHomeHero = () => (
  <section className="dirB-hero">
    <div className="dirB-hero-issue">
      <span>Innovation Republic · Gemeinnützige Initiative · in Gründung</span>
      <span>Ausgabe 01 · Pilot München & Oberbayern</span>
      <span>www.innovationrepublic.de</span>
    </div>
    <h1>
      <em>Aufträge.</em><br />
      Nicht Anträge.
    </h1>
    <div className="dirB-hero-foot">
      <p>
        Innovation Republic ist die gemeinnützige Plattform, die Mittelstand, öffentliche Träger und Innovationsanbieter über <em>reale Aufträge</em> zusammenbringt — vergabekonform, kostenfrei, in 100 Werktagen.
      </p>
      <div className="actions">
        <a href="#" className="dirB-btn dirB-btn-ghost">Demo ansehen</a>
        <a href="#" className="dirB-btn dirB-btn-primary">Bedarf einreichen →</a>
      </div>
    </div>
  </section>
);

const BMarquee = () => (
  <div className="dirB-marquee">
    <span>Steuereinnahmen statt Steuerausgaben</span>
    <span>Umsetzung statt Bürokratie</span>
    <span>Reale Aufträge statt Förderanträge</span>
    <span>Problem sucht Lösung statt Pitch-Event</span>
  </div>
);

const BHomeNumbers = () => (
  <div className="dirB-numbers">
    <div className="dirB-num"><div className="v">100<span className="u"> WT</span></div><div className="l">Vom Bedarf zum PoC</div></div>
    <div className="dirB-num"><div className="v">14<span className="u"> Tage</span></div><div className="l">Ausschreibung</div></div>
    <div className="dirB-num"><div className="v">0<span className="u"> €</span></div><div className="l">Für Auftraggeber</div></div>
    <div className="dirB-num"><div className="v">i.Gr.</div><div className="l">Gemeinnützige Initiative</div></div>
  </div>
);

const BHomeProcess = () => (
  <section className="dirB-section">
    <div className="dirB-sec-head">
      <div className="num">01</div>
      <div>
        <div className="label">Der Prozess</div>
        <h2 className="h2" style={{ marginTop: 12 }}>Vom Bedarf zum Auftrag — in fünf Phasen.</h2>
      </div>
      <div className="meta">Digital<br />Kostenfrei<br />Vergabekonform</div>
    </div>
    <div className="dirB-process">
      <div className="gut">Ablauf</div>
      {BPhases.map(p => (
        <div key={p.num} className="dirB-step">
          <div className="n">{p.num}</div>
          <h3>{p.name}</h3>
          <p>{p.desc}</p>
          <div className="tool">
            {p.soon ? `App: ${p.tool} · soon` : <span><span className="live">●</span> App: {p.tool} · live</span>}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const BHomeApps = () => (
  <section className="dirB-section warm">
    <div className="dirB-sec-head">
      <div className="num">02</div>
      <div>
        <div className="label">App-Verzeichnis</div>
        <h2 className="h2" style={{ marginTop: 12 }}>Eine Plattform. Apps von Drittanbietern.</h2>
      </div>
      <div className="meta">Offene Slots<br />Anbieter willkommen</div>
    </div>
    <p className="lede" style={{ maxWidth: 720, marginBottom: 32 }}>
      Innovation Republic stellt den Basis-Prozess. Spezialisierte Partner liefern die Apps. Die meisten Slots sind aktuell offen — sprechen Sie uns an.
    </p>
    <div className="dirB-tools">
      {BTOOLS.map(t => (
        <div key={t.name} className={`dirB-tool-row ${t.status}`}>
          <div className="ico">{t.code}</div>
          <div>
            <div className="name">{t.name}</div>
            <div className="meta" style={{ marginTop: 4 }}>Phase · {t.phase}</div>
          </div>
          <div className="desc">{t.desc}</div>
          <div className="meta">{t.placeholder}</div>
          <div className="status">{t.status === "live" ? "● Live" : "Coming Soon"}</div>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 40, padding: "32px 0", display: "flex", justifyContent: "space-between", alignItems: "end", borderTop: "1px solid var(--ink)" }}>
      <div>
        <div className="label">App-Slot offen</div>
        <h3 className="h3" style={{ marginTop: 8, maxWidth: 520 }}>Sie haben eine passende Lösung? Werden Sie InnovationOS-Partner.</h3>
      </div>
      <a href="#" className="dirB-btn dirB-btn-ink">App vorschlagen →</a>
    </div>
  </section>
);

const BHomePersonas = () => (
  <section className="dirB-section">
    <div className="dirB-sec-head">
      <div className="num">03</div>
      <div>
        <div className="label">Für wen</div>
        <h2 className="h2" style={{ marginTop: 12 }}>Drei Stakeholder. Ein Wirkprinzip.</h2>
      </div>
      <div className="meta">Auftraggeber<br />Anbieter<br />Förderer</div>
    </div>
    <div className="dirB-personas">
      <div className="dirB-persona">
        <div className="role">— Auftraggeber</div>
        <h3>KMU & öffentliche Träger</h3>
        <p>"Wir haben Innovationsbedarfe — uns fehlen Zugang und Zeit."</p>
        <ul>
          <li>Bedarfsformulierung in Stunden</li>
          <li>Vergabe- & einkaufskonform</li>
          <li>PoC in 100 Werktagen</li>
        </ul>
        <a href="#" className="dirB-btn dirB-btn-ghost cta">Bedarf einreichen →</a>
      </div>
      <div className="dirB-persona">
        <div className="role">— Anbieter</div>
        <h3>Startups & Scale-ups</h3>
        <p>"Wir haben Lösungen — uns fehlen Aufträge und Referenzen."</p>
        <ul>
          <li>Direkter Zugang zu Auftraggebern</li>
          <li>Kürzere Vertriebszyklen</li>
          <li>Vergabekonforme Verträge</li>
        </ul>
        <a href="#" className="dirB-btn dirB-btn-ghost cta">Anbieter werden →</a>
      </div>
      <div className="dirB-persona">
        <div className="role">— Förderer</div>
        <h3>Spender & Industrie-Partner</h3>
        <p>"Wir wollen Wirkung — keine Anträge mehr verwalten."</p>
        <ul>
          <li>Steuereinnahmen statt -ausgaben</li>
          <li>Regionale Förderpartnerschaften</li>
          <li>Transparente Impact-Daten</li>
        </ul>
        <a href="#" className="dirB-btn dirB-btn-ghost cta">Fördern →</a>
      </div>
    </div>
  </section>
);

const BHomeManifesto = () => (
  <section className="dirB-section deep">
    <div className="dirB-sec-head" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
      <div className="num" style={{ color: "var(--accent-gold)" }}>04</div>
      <div>
        <div className="label" style={{ color: "rgba(255,255,255,0.5)" }}>Das Manifest</div>
      </div>
      <div className="meta" style={{ color: "rgba(255,255,255,0.5)" }}>Wirkprinzip</div>
    </div>
    <div className="dirB-quote">
      Unternehmen helfen Unternehmen — durch <span>Aufträge.</span>
    </div>
    <p className="lede" style={{ marginTop: 56, maxWidth: 720, color: "rgba(255,255,255,0.75)" }}>
      Innovation Republic dreht das Modell um. Nicht der Staat fördert die Wirtschaft. Sondern Unternehmen helfen Unternehmen — über reale Aufträge, nicht über bürokratische Anträge. Steuereinnahmen statt Steuerausgaben. Wachstum statt Verwaltung.
    </p>
  </section>
);

const BDirectionBHome = () => (
  <div className="dirB dirB-page" data-screen-label="B-01 Home">
    <BNav active="home" />
    <BHomeHero />
    <BMarquee />
    <BHomeNumbers />
    <BHomeProcess />
    <BHomeApps />
    <BHomePersonas />
    <BHomeManifesto />
    <BCTA />
    <BFooter />
  </div>
);

Object.assign(window, { BDirectionBHome });
