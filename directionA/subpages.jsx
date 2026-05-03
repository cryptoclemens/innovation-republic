/* Direction A — Subpages */

const APageHead = ({ crumb, title, lede }) => (
  <header className="dirA-pagehead">
    <div>
      <div className="dirA-breadcrumb">
        <a href="#">Innovation Republic</a> / {crumb}
      </div>
      <h1>{title}</h1>
    </div>
    <p>{lede}</p>
  </header>
);

/* === PLATTFORM === */
const ADirectionAPlatform = () => (
  <div className="dirA dirA-page" data-screen-label="A-02 Plattform">
    <ANav active="platform" />
    <APageHead
      crumb="Plattform"
      title="Ein kuratierter Prozess. Best-in-Class pro Phase."
      lede="Innovation Republic ist Ihr gemeinnütziger Kurator: Wir orchestrieren den End-to-End-Innovations-Prozess und integrieren in jeder Phase das beste verfügbare Tool. Für Bedarfsträger kostenfrei. Optional buchbare Berater pro Phase."
    />
    <section className="dirA-section">
      <div className="dirA-sec-head">
        <div>
          <div className="dirA-secno">Der Prozess</div>
          <h2>Vier Phasen.<br />Ein Kurator.</h2>
        </div>
        <p className="body-lg" style={{ alignSelf: "end" }}>
          Jede Phase wird durch ein kuratiertes, best-in-class Tool unterstützt. Für Bedarfsträger kostenfrei. Optional buchbare Berater-Hilfe pro Phase über Roland.
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
    <section className="dirA-section alt">
      <div className="dirA-sec-head">
        <div>
          <div className="dirA-secno">Toolstack</div>
          <h2>Best-in-Class Tools.<br />Kuratiert von uns.</h2>
        </div>
        <p className="body-lg" style={{ alignSelf: "end" }}>
          Statt Eigenbau setzt Innovation Republic auf bewährte Spezial-Tools. Die meisten Slots sind aktuell offen — sprechen Sie uns an, wenn Sie ein Tool beisteuern möchten.
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
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, padding: 24, border: "1px dashed var(--line-2)", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="mono" style={{ color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Tool-Slot offen</div>
          <div className="h4">Sie haben ein Best-in-Class-Tool? Werden Sie kuratierter IR-Tool-Partner.</div>
        </div>
        <a href="#" className="dirA-btn dirA-btn-primary">Tool vorschlagen <span className="arr">→</span></a>
      </div>
    </section>
    <ACTAStrip />
    <AFooter />
  </div>
);

/* === FÜR BEDARFSTRÄGER === */
const ADirectionAKMU = () => (
  <div className="dirA dirA-page" data-screen-label="A-03 Bedarfsträger">
    <ANav active="kmu" />
    <APageHead
      crumb="Für Bedarfsträger"
      title="Sie wissen, dass Sie innovieren müssen — aber nicht wie?"
      lede="Genau hier setzen wir an. Innovation Republic kuratiert mit Ihnen den Prozess: vom unscharfen Bedarf über kuratierte Anbieter bis zur strukturierten Sprint-Zusammenarbeit. Kostenfrei, gemeinnützig, vergabekonform."
    />
    <div className="dirA-stats" style={{ background: "var(--bg-elev)" }}>
      <div className="dirA-stat"><div className="num">0 €</div><div className="label">Plattform-Kosten</div></div>
      <div className="dirA-stat"><div className="num">14<span className="unit">Tage</span></div><div className="label">Bis Lösungsvorschläge</div></div>
      <div className="dirA-stat"><div className="num">100<span className="unit">WT</span></div><div className="label">Bis Proof of Concept</div></div>
      <div className="dirA-stat"><div className="num">100%</div><div className="label">Vergabekonform</div></div>
    </div>
    <section className="dirA-section">
      <div className="dirA-sec-head">
        <div>
          <div className="dirA-secno">Hürden, die wir lösen</div>
          <h2>Was Sie heute bremst.</h2>
        </div>
      </div>
      <div className="dirA-personas">
        {[
          { t: "Kein Zugang zu Startups", d: "Keine Zeit fürs Scouting, kein Netzwerk in der Szene. Konrad kuratiert passende Anbieter automatisch." },
          { t: "Lange Beschaffungswege", d: "Anstatt monatelanger Vergabeprozesse: 14-Tage-Wettbewerb mit standardisierten, einkaufskonformen Verträgen." },
          { t: "Risiko-Aversion", d: "Neutrales Risiko-Assessment vor dem PoC. Klare Abbruchkriterien. Dokumentierter Erkenntnisgewinn." },
        ].map(x => (
          <div key={x.t} className="dirA-persona">
            <span className="tag"><span className="sq" style={{ background: "var(--ink)" }}></span>Hürde</span>
            <h3>{x.t}</h3>
            <p>{x.d}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="dirA-section alt">
      <div className="dirA-sec-head">
        <div>
          <div className="dirA-secno">So starten Sie</div>
          <h2>In 10 Minuten zum Bedarf.</h2>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 16, padding: 32 }}>
          <div className="mono" style={{ color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Schritt 1 · Robert</div>
          <h3 className="h3">Bedarf strukturieren</h3>
          <p className="body" style={{ marginTop: 12 }}>KI-gestützte Eingabe: Sie beschreiben das Problem in eigenen Worten. Robert formt daraus eine ausschreibungsfähige Anforderung.</p>
          <div style={{ marginTop: 24, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 10, padding: 16, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <span style={{ color: "var(--ink-3)" }}>{"// Beispiel"}</span><br />
            <span style={{ color: "var(--accent-red)" }}>BEDARF:</span> Predictive Maintenance für CNC-Park<br />
            <span style={{ color: "var(--accent-red)" }}>BUDGET:</span> 25k–50k €<br />
            <span style={{ color: "var(--accent-red)" }}>RAHMEN:</span> 100 WT, vor Ort + remote<br />
            <span style={{ color: "var(--accent-gold)" }}>STATUS:</span> Bereit zur Ausschreibung ✓
          </div>
        </div>
        <div style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 16, padding: 32 }}>
          <div className="mono" style={{ color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Schritt 2 · SpinIn</div>
          <h3 className="h3">Anbieter wählen</h3>
          <p className="body" style={{ marginTop: 12 }}>14-Tage-Ausschreibung über SpinIn. Sie erhalten kuratierte Vorschläge, vergleichen sie strukturiert, wählen den Partner.</p>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { n: "AnbieterA GmbH", m: "94% Match", l: "München" },
              { n: "PredictTech UG", m: "89% Match", l: "Berlin" },
              { n: "MaintainAI", m: "82% Match", l: "Stuttgart" },
            ].map(a => (
              <div key={a.n} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 10, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{a.n}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{a.l}</div>
                </div>
                <div className="mono" style={{ fontSize: 11, color: "var(--accent-gold)", fontWeight: 600 }}>{a.m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    <ACTAStrip />
    <AFooter />
  </div>
);

/* === FÜR ANBIETER === */
const ADirectionAAnbieter = () => (
  <div className="dirA dirA-page" data-screen-label="A-04 Anbieter">
    <ANav active="anbieter" />
    <APageHead
      crumb="Für Anbieter"
      title="Klare Bedarfe. Kurze Wege."
      lede="Innovation Republic kuratiert reale Bedarfe aus dem Mittelstand und der öffentlichen Hand — strukturiert, vergabekonform, sprint-tauglich. Sie bekommen Zugang zu Auftraggebern, die wissen, was sie brauchen."
    />
    <section className="dirA-section">
      <div className="dirA-sec-head">
        <div>
          <div className="dirA-secno">Vorteile</div>
          <h2>Vom Pitch zum<br />Vertragsabschluss.</h2>
        </div>
      </div>
      <div className="dirA-personas">
        {[
          { t: "Kürzere Vertriebszyklen", d: "Statt 12–18 Monate Cold-Outreach: kuratierte Bedarfe, die zu Ihrer Lösung passen, mit kaufbereiten Auftraggebern." },
          { t: "Reale Referenzen", d: "Jeder Auftrag ist eine dokumentierte Referenz aus dem deutschen Mittelstand — relevant für Investoren und nächste Kunden." },
          { t: "Vergabekonforme Verträge", d: "Standardisierte Vertragswerke, kompatibel mit öffentlichem Einkauf. Kein eigenes Compliance-Team nötig." },
        ].map(x => (
          <div key={x.t} className="dirA-persona">
            <span className="tag"><span className="sq" style={{ background: "var(--accent-red)" }}></span>Vorteil</span>
            <h3>{x.t}</h3>
            <p>{x.d}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="dirA-section alt">
      <div className="dirA-sec-head">
        <div>
          <div className="dirA-secno">Onboarding</div>
          <h2>So werden Sie Anbieter.</h2>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { n: "01", t: "Profil anlegen", d: "Lösung, Branchen, Referenzen." },
          { n: "02", t: "Verifizierung", d: "Identitäts- und Compliance-Check." },
          { n: "03", t: "Matching aktivieren", d: "Konrad findet passende Bedarfe." },
          { n: "04", t: "Vorschläge einreichen", d: "Auf laufende Ausschreibungen." },
        ].map(s => (
          <div key={s.n} style={{ background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 14, padding: 24 }}>
            <div className="mono" style={{ color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{s.n}</div>
            <div className="h4" style={{ marginBottom: 8 }}>{s.t}</div>
            <div className="body-sm">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
    <ACTAStrip />
    <AFooter />
  </div>
);

/* === SPENDEN === */
const ADirectionASpenden = () => (
  <div className="dirA dirA-page" data-screen-label="A-05 Förderung">
    <ANav active="spenden" />
    <APageHead
      crumb="Förderung"
      title="Förderung mit Wirkprinzip."
      lede="Innovation Republic ist eine gemeinnützige Initiative von Unternehmern (in Gründung). Wir finanzieren uns über Spenden und Förderpartnerschaften. Jeder Euro fließt in einen kuratierten Prozess, der reale Innovation in der Breite freisetzt — transparent ausgewiesen."
    />
    <section className="dirA-section">
      <div className="dirA-sec-head">
        <div>
          <div className="dirA-secno">Mitwirken</div>
          <h2>Drei Wege zu fördern.</h2>
        </div>
      </div>
      <div className="dirA-tiers">
        <div className="dirA-tier">
          <div className="label">Start-Funding</div>
          <h3>Plattform-Aufbau</h3>
          <div className="price">ab 25.000 <span className="unit">€</span></div>
          <p className="body-sm">Grundfinanzierung der Plattform-Infrastruktur und Kern-Apps.</p>
          <ul>
            <li>Nennung als Founding Partner</li>
            <li>Quartalsweises Impact-Reporting</li>
            <li>Zugang zu Pilot-Daten</li>
          </ul>
          <a href="#" className="dirA-btn dirA-btn-ghost cta">Sprechen <span className="arr">→</span></a>
        </div>
        <div className="dirA-tier featured">
          <div className="label" style={{ color: "var(--accent-gold)" }}>Empfohlen</div>
          <h3>Regional-Partnerschaft</h3>
          <div className="price">ab 100.000 <span className="unit">€ / Jahr</span></div>
          <p>Etablierung eines regionalen Knotenpunkts inkl. Kommunikations- und Netzwerkbudget.</p>
          <ul>
            <li>Eigene Region, eigenes Branding</li>
            <li>Lokale Makeathons & Innovation-Labs</li>
            <li>Politische Schirmherrschaft</li>
            <li>Direkte Auftragsvermittlung</li>
          </ul>
          <a href="#" className="dirA-btn dirA-btn-primary cta" style={{ background: "var(--accent-gold)", color: "var(--ink)" }}>Partner werden <span className="arr">→</span></a>
        </div>
        <div className="dirA-tier">
          <div className="label">Projektbezogen</div>
          <h3>Pilotprogramm fördern</h3>
          <div className="price">ab 10.000 <span className="unit">€</span></div>
          <p className="body-sm">Z.B. „1-Day Innovation Sprint" oder „KMU-Innovationstestfeld Süd".</p>
          <ul>
            <li>Direkte Wirkungsmessung</li>
            <li>Public Branding der Maßnahme</li>
            <li>Steuerlich abzugsfähig</li>
          </ul>
          <a href="#" className="dirA-btn dirA-btn-ghost cta">Spenden <span className="arr">→</span></a>
        </div>
      </div>
    </section>
    <section className="dirA-section alt">
      <div className="dirA-sec-head">
        <div>
          <div className="dirA-secno">Transparenz</div>
          <h2>Wirkung statt Versprechen.</h2>
        </div>
        <p className="body-lg" style={{ alignSelf: "end" }}>
          Alle Mittel fließen ausschließlich in den gemeinnützigen Zweck der Initiative — Förderung von Innovation im Mittelstand. Die Anerkennung als gemeinnützige Trägerstruktur (e.V. oder gGmbH) wird vorbereitet. Projektergebnisse und Impact-Kennzahlen werden öffentlich ausgewiesen.
        </p>
      </div>
      <div className="dirA-stats" style={{ background: "var(--bg)" }}>
        <div className="dirA-stat"><div className="num">87%</div><div className="label">Projektkosten</div></div>
        <div className="dirA-stat"><div className="num">9%</div><div className="label">Plattform-Betrieb</div></div>
        <div className="dirA-stat"><div className="num">4%</div><div className="label">Verwaltung</div></div>
        <div className="dirA-stat"><div className="num">100%</div><div className="label">Öffentlich auditiert</div></div>
      </div>
    </section>
    <AFooter />
  </div>
);

/* === ÜBER UNS / KONTAKT === */
const ADirectionAUeber = () => (
  <div className="dirA dirA-page" data-screen-label="A-06 Über uns">
    <ANav active="ueber" />
    <APageHead
      crumb="Über uns"
      title="Initiative von Unternehmern."
      lede="Innovation Republic ist eine gemeinnützige Initiative von Unternehmern aus dem deutschen Mittelstand (in Gründung). Pilotregion: München & Oberbayern. Die Trägerstruktur (e.V. oder gGmbH) wird derzeit aufgesetzt; weitere Knotenpunkte folgen bundesweit."
    />
    {/* TEAM-SEKTION — Platzhalter im Code, aktuell ausgeblendet.
        Solange nur Clemens an Bord ist, wirkt eine Team-Galerie + "wir" peinlich.
        Reaktivieren, sobald min. 2–3 Personen / Beirat öffentlich kommunizierbar sind. */}
    {false && (
      <section className="dirA-section">
        <div className="dirA-sec-head">
          <div>
            <div className="dirA-secno">Vorstand & Team</div>
            <h2>Menschen hinter dem Projekt.</h2>
          </div>
        </div>
        <div className="dirA-people">
          {[
            { i: "CP", n: "Clemens Pompeÿ", r: "Vorstand", b: "Gründer Innovation Republic. Vorher Strategy & Innovation in Mittelstand und öffentlicher Hand." },
            { i: "MD", n: "Vorstand 2", r: "Stellv. Vorstand", b: "Platzhalter — Bio folgt." },
            { i: "BS", n: "Beirat", r: "Wissenschaftlicher Beirat", b: "TUM, UnternehmerTUM Netzwerk." },
            { i: "PR", n: "Politik", r: "Schirmherrschaft", b: "MdL Kerstin Schreyer, Stefan Ebner, Stephanie Schuhknecht u.a." },
          ].map(p => (
            <div key={p.i} className="dirA-person">
              <div className="avatar">{p.i}</div>
              <div className="name">{p.n}</div>
              <div className="role">{p.r}</div>
              <div className="bio">{p.b}</div>
            </div>
          ))}
        </div>
      </section>
    )}
    <section className="dirA-section alt">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <div>
          <div className="dirA-secno">Kontakt</div>
          <h2 className="h2" style={{ marginTop: 16 }}>Sprechen Sie mit uns.</h2>
          <p className="body-lg" style={{ marginTop: 20, maxWidth: 460 }}>
            Ob Bedarf, Lösung, Förderung oder einfach Interesse — wir freuen uns über Ihre Nachricht.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14, fontFamily: "var(--f-mono)", fontSize: 13 }}>
            <div><span style={{ color: "var(--ink-3)" }}>E-MAIL </span>hello@innovationrepublic.de</div>
            <div><span style={{ color: "var(--ink-3)" }}>TEL    </span>+49.162.6677606</div>
            <div><span style={{ color: "var(--ink-3)" }}>WEB    </span>www.innovationrepublic.de</div>
            <div><span style={{ color: "var(--ink-3)" }}>DEMO   </span>demo.innovation-republic.de</div>
          </div>
        </div>
        <form className="dirA-form">
          <div className="dirA-field">
            <label>Name</label>
            <input placeholder="Ihr Name" />
          </div>
          <div className="dirA-field">
            <label>Organisation</label>
            <input placeholder="Firma / Verband / Behörde" />
          </div>
          <div className="dirA-field">
            <label>E-Mail</label>
            <input placeholder="name@firma.de" />
          </div>
          <div className="dirA-field">
            <label>Ich bin</label>
            <select>
              <option>Bedarfsträger (KMU / öffentliche Hand)</option>
              <option>Lösungsanbieter (Startup / Scale-up / Agentur)</option>
              <option>Förderer / Industrie-Partner</option>
              <option>Politik / Verwaltung</option>
              <option>Sonstiges</option>
            </select>
          </div>
          <div className="dirA-field">
            <label>Nachricht</label>
            <textarea placeholder="Worum geht es?" />
          </div>
          <a href="#" className="dirA-btn dirA-btn-primary" style={{ alignSelf: "flex-start" }}>Nachricht senden <span className="arr">→</span></a>
        </form>
      </div>
    </section>
    <AFooter />
  </div>
);

Object.assign(window, {
  ADirectionAPlatform, ADirectionAKMU, ADirectionAAnbieter,
  ADirectionASpenden, ADirectionAUeber
});
