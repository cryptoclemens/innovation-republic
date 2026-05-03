/* Direction A — Home */

const AHomeHero = () => (
  <section className="dirA-hero">
    <div className="dirA-hero-grid">
      <div>
        <span className="dirA-hero-eyebrow">
          <span className="dot"></span>
          <span className="mono" style={{ color: "var(--ink-2)" }}>Gemeinnützige Initiative von Unternehmern · in Gründung</span>
        </span>
        <h1>
          <span className="ink">Vom Bauchgefühl</span><br />
          <span className="ink">zum </span><span className="accent">Ergebnis.</span>
        </h1>
        <p className="lede">
          Viele Unternehmen wissen, dass sie innovieren müssen — aber nicht <em>was</em>, <em>mit wem</em> oder <em>wie</em>. Innovation Republic kuratiert den Best-in-Class-Prozess: vom unscharfen Bedarf über kuratierte Anbieter bis zur strukturierten 100-Werktage-Zusammenarbeit. Voll digital. Gemeinnützig. Kostenfrei.
        </p>
        <div className="cta-row">
          <button
            className="dirA-btn dirA-btn-primary"
            onClick={() => window.dispatchEvent(new CustomEvent('ir-open-check'))}
            style={{ border: 'none', font: 'inherit' }}
          >Innovations-Check starten <span className="arr">→</span></button>
          <a href="#" className="dirA-btn dirA-btn-ghost">Wie wir kuratieren</a>
        </div>
        <div className="meta">
          <div><strong>4</strong> Phasen · ein Prozess</div>
          <div><strong>Best-in-Class</strong> Tools je Schritt</div>
          <div><strong>0 €</strong> für Bedarfsträger</div>
        </div>
      </div>

      <div className="dirA-os">
        <div className="dirA-os-bar">
          <span className="lights"><span></span><span></span><span></span></span>
          <span>innovationOS · v0.9 · pilot</span>
          <span>⌘ K</span>
        </div>
        <div style={{ padding: "0 6px 6px", color: "rgba(255,255,255,0.85)" }}>
          <div style={{ fontSize: 12, fontFamily: "var(--f-mono)", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Apps</div>
        </div>
        <div className="dirA-os-grid">
          {TOOLS.map(t => (
            <div key={t.code} className={`dirA-app ${t.status}`}>
              <div className="dirA-app-icon">{t.code}</div>
              <div>
                <div className="dirA-app-name">{t.name}</div>
                <div className="dirA-app-desc">{t.desc.split(" · ")[0]}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 8px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Drittanbieter willkommen
          </span>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--accent-gold)" }}>+ App vorschlagen</span>
        </div>
      </div>
    </div>
  </section>
);

const AHomeLogos = () => (
  <div className="dirA-logobar">
    <span className="label">Initiator-Kreis & Sounding-Board · in Gespräch mit</span>
    {["Mittelstand", "Familienunternehmen", "Industrie-Verbände", "Hochschul-Netzwerke", "Politik & Verwaltung", "Stiftungen"].map(p => (
      <span key={p} className="partner">{p}</span>
    ))}
  </div>
);

const AHomeProcess = () => (
  <section className="dirA-section">
    <div className="dirA-sec-head">
      <div>
        <div className="dirA-secno">Der kuratierte Prozess · 01</div>
        <h2>Best-in-Class. In jedem Schritt.</h2>
      </div>
      <p className="body-lg" style={{ alignSelf: "end" }}>
        Innovation Republic ist Ihr Innovations-Kurator: Wir orchestrieren den End-to-End-Prozess und integrieren in jeder Phase das beste verfügbare Tool. Sie konzentrieren sich auf Ihr Geschäft — wir auf den Prozess.
      </p>
    </div>
    <div className="dirA-process">
      {APhases.map(p => (
        <div key={p.num} className="dirA-step">
          <div className="num">PHASE {p.num}</div>
          <h4>{p.name}</h4>
          <p>{p.desc}</p>
          <div className={`tool ${p.status === "soon" ? "soon" : ""}`}>
            <span className="pip"></span>
            {p.status === "soon" ? `${p.tool} · soon` : `${p.tool} · live`}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const AHomeApps = () => (
  <section className="dirA-section alt">
    <div className="dirA-sec-head">
      <div>
        <div className="dirA-secno">Toolstack · 02</div>
        <h2>Wir kuratieren die Tools.<br/>Sie nutzen das Beste pro Phase.</h2>
      </div>
      <p className="body-lg" style={{ alignSelf: "end" }}>
        Statt Eigenbau setzt Innovation Republic auf bewährte Spezial-Tools — kuratiert, integriert, gemeinnützig vermittelt. So bekommen Sie Best-in-Class ohne Software-Auswahl, Vertragspoker oder Lock-in.
      </p>
    </div>
    <div className="dirA-tools-grid">
      {TOOLS.map(t => (
        <div key={t.code} className={`dirA-tool-card ${t.status}`}>
          <span className={`badge ${t.status}`}>{t.status === "live" ? "LIVE" : "COMING SOON"}</span>
          <div className="icon">{t.code}</div>
          <div>
            <div className="name">{t.name}</div>
            <div className="placeholder">{t.placeholder}</div>
          </div>
          <div className="desc">{t.desc}</div>
          <div style={{ marginTop: "auto", paddingTop: 12, fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t.status === "live" ? "Jetzt nutzen →" : "App entwickeln →"}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const AHomePersonas = () => (
  <section className="dirA-section">
    <div className="dirA-sec-head">
      <div>
        <div className="dirA-secno">Für · 03</div>
        <h2>Wirtschaftsförderung,<br />neu gedacht.</h2>
      </div>
      <p className="body-lg" style={{ alignSelf: "end" }}>
        Drei Perspektiven, eine Plattform. Jeder Stakeholder gewinnt durch reale Aufträge anstelle von Förderanträgen.
      </p>
    </div>
    <div className="dirA-personas">
      <div className="dirA-persona">
        <span className="tag"><span className="sq" style={{ background: "var(--ink)" }}></span>Bedarfsträger</span>
        <h3>KMU & öffentliche Träger</h3>
        <p>Sie spüren Innovations-Druck — wissen aber nicht, was, mit wem und wie. Wir kuratieren den Prozess.</p>
        <ul>
          <li>Robert hilft den unscharfen Bedarf zu schärfen</li>
          <li>Konrad findet die richtigen Anbieter — nicht nur Startups</li>
          <li>James strukturiert die 100-Werktage-Zusammenarbeit</li>
        </ul>
        <a href="#" className="dirA-btn dirA-btn-ghost cta">Prozess starten <span className="arr">→</span></a>
      </div>
      <div className="dirA-persona">
        <span className="tag"><span className="sq" style={{ background: "var(--accent-red)" }}></span>Lösungsanbieter</span>
        <h3>Innovative Dienstleister</h3>
        <p>Startups, Scale-ups, Spezialagenturen, Forschungs-Spin-offs — alle, die lösen können, was KMU nicht selbst können.</p>
        <ul>
          <li>Klar definierte Bedarfe statt offener RFPs</li>
          <li>Standardisierte Sprint-Verträge à 100 Werktage</li>
          <li>Reale Referenzen aus dem Mittelstand</li>
        </ul>
        <a href="#" className="dirA-btn dirA-btn-ghost cta">Anbieter werden <span className="arr">→</span></a>
      </div>
      <div className="dirA-persona">
        <span className="tag"><span className="sq" style={{ background: "var(--accent-gold)" }}></span>Förderer</span>
        <h3>Spender & Industrie-Partner</h3>
        <p>Wirkung statt Verwaltung. Sie finanzieren einen kuratierten Prozess, der reale Innovation in der Breite freisetzt.</p>
        <ul>
          <li>Start-Funding der Plattform-Infrastruktur</li>
          <li>Regionale Förderpartnerschaften</li>
          <li>Transparente Impact-Kennzahlen</li>
        </ul>
        <a href="#" className="dirA-btn dirA-btn-ghost cta">Fördern <span className="arr">→</span></a>
      </div>
    </div>
  </section>
);

const AHomeManifesto = () => (
  <section className="dirA-section dark">
    <div className="dirA-manifesto">
      <div>
        <div className="dirA-secno" style={{ color: "rgba(255,255,255,0.55)" }}>Wirkprinzip · 04</div>
        <h2 style={{ marginTop: 16 }}>
          Wir sind kein<br/>Marktplatz.<br/>
          <span style={{ color: "var(--accent-gold)" }}>Wir sind ein Kurator.</span>
        </h2>
        <p className="body-lg" style={{ color: "rgba(255,255,255,0.7)", marginTop: 24, maxWidth: 480 }}>
          Innovation ist kein Tool und kein Tender. Es ist ein Prozess, der gelingen muss — von der unscharfen Frage bis zum dokumentierten Ergebnis. Innovation Republic kuratiert diesen Prozess, gemeinnützig, mit den jeweils besten Tools.
        </p>
      </div>
      <div className="swaps">
        <div className="swap">
          <span className="from">Unscharfe Idee</span>
          <span className="arr">→</span>
          <span className="to">Klar formulierter Bedarf</span>
        </div>
        <div className="swap">
          <span className="from">Endloses Scouting</span>
          <span className="arr">→</span>
          <span className="to">Kuratierte Anbieterliste</span>
        </div>
        <div className="swap">
          <span className="from">Tool-Wildwuchs</span>
          <span className="arr">→</span>
          <span className="to">Best-in-Class pro Phase</span>
        </div>
        <div className="swap">
          <span className="from">Chaotische Sprint-Zusammenarbeit</span>
          <span className="arr">→</span>
          <span className="to">Strukturierter 100-WT-Prozess</span>
        </div>
        <div className="swap">
          <span className="from">Steuerausgaben</span>
          <span className="arr">→</span>
          <span className="to">Steuereinnahmen</span>
        </div>
      </div>
    </div>
  </section>
);

const AHomeStats = () => (
  <div className="dirA-stats" style={{ background: "var(--bg-elev)" }}>
    <div className="dirA-stat">
      <div className="num">4</div>
      <div className="label">Phasen kuratiert</div>
    </div>
    <div className="dirA-stat">
      <div className="num">100<span className="unit">WT</span></div>
      <div className="label">Sprint-Format</div>
    </div>
    <div className="dirA-stat">
      <div className="num">0<span className="unit">€</span></div>
      <div className="label">Für Bedarfsträger</div>
    </div>
    <div className="dirA-stat">
      <div className="num">i.Gr.</div>
      <div className="label">Gemeinnützige Initiative</div>
    </div>
  </div>
);

const ADirectionAHome = () => (
  <div className="dirA dirA-page" data-screen-label="A-01 Home">
    <ANav active="home" />
    <AHomeHero />
    <AHomeLogos />
    <AHomeStats />
    <AHomeProcess />
    <AHomeApps />
    <AHomePersonas />
    <AHomeManifesto />
    <ACTAStrip />
    <AFooter />
  </div>
);

Object.assign(window, { ADirectionAHome });
