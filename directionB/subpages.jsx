/* Direction B — Subpages */

const BPageHead = ({ crumb, title, lede }) => (
  <header className="dirB-pagehead">
    <div className="crumb"><a href="#">Innovation Republic</a> / {crumb}</div>
    <h1 dangerouslySetInnerHTML={{ __html: title }} />
    {lede ? <p>{lede}</p> : null}
  </header>
);

const BDirectionBPlatform = () => (
  <div className="dirB dirB-page" data-screen-label="B-02 Plattform">
    <BNav active="platform" />
    <BPageHead
      crumb="Plattform"
      title="<em>Eine Plattform.</em><br/>Geöffnete Apps."
      lede="Innovation Republic ist ein gemeinnützig getragener Stack: Basis-Prozesse von der Initiative, Apps von Drittanbietern. Der Auftraggeber nutzt alles kostenfrei."
    />
    <section className="dirB-section">
      <div className="dirB-sec-head">
        <div className="num">01</div>
        <div>
          <div className="label">Basis-Prozess</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Fünf Phasen.</h2>
        </div>
        <div className="meta">Initiative<br />Kostenfrei</div>
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
    <section className="dirB-section warm">
      <div className="dirB-sec-head">
        <div className="num">02</div>
        <div>
          <div className="label">App-Verzeichnis</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Apps von Drittanbietern.</h2>
        </div>
        <div className="meta">Slots offen</div>
      </div>
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
    </section>
    <BCTA />
    <BFooter />
  </div>
);

const BDirectionBKMU = () => (
  <div className="dirB dirB-page" data-screen-label="B-03 Auftraggeber">
    <BNav active="kmu" />
    <BPageHead
      crumb="Für Auftraggeber"
      title="Innovation als <em>Auftrag.</em><br/>Nicht als Antrag."
      lede="Für KMU, Mittelstand und öffentliche Träger. Bedarf in Stunden formulieren, Anbieter in Tagen finden, Ergebnisse in 100 Werktagen sehen."
    />
    <div className="dirB-numbers">
      <div className="dirB-num"><div className="v">0<span className="u"> €</span></div><div className="l">Plattform-Kosten</div></div>
      <div className="dirB-num"><div className="v">14<span className="u"> Tage</span></div><div className="l">Bis Vorschläge</div></div>
      <div className="dirB-num"><div className="v">100<span className="u"> WT</span></div><div className="l">Bis PoC</div></div>
      <div className="dirB-num"><div className="v">100<span className="u"> %</span></div><div className="l">Vergabekonform</div></div>
    </div>
    <section className="dirB-section">
      <div className="dirB-sec-head">
        <div className="num">01</div>
        <div>
          <div className="label">Hürden, die wir lösen</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Was Sie heute bremst.</h2>
        </div>
        <div className="meta">Drei Beobachtungen</div>
      </div>
      <div className="dirB-personas">
        {[
          { t: "Kein Zugang zu Startups", d: "Keine Zeit fürs Scouting. Konrad kuratiert passende Anbieter." },
          { t: "Lange Beschaffungswege", d: "Statt Monaten: 14-Tage-Wettbewerb mit standardisierten Verträgen." },
          { t: "Risiko-Aversion", d: "Neutrales Risiko-Assessment, klare Abbruchkriterien, dokumentierter Erkenntnisgewinn." },
        ].map(x => (
          <div key={x.t} className="dirB-persona">
            <div className="role">— Hürde</div>
            <h3>{x.t}</h3>
            <p>{x.d}</p>
          </div>
        ))}
      </div>
    </section>
    <BCTA />
    <BFooter />
  </div>
);

const BDirectionBAnbieter = () => (
  <div className="dirB dirB-page" data-screen-label="B-04 Anbieter">
    <BNav active="anbieter" />
    <BPageHead
      crumb="Für Anbieter"
      title="<em>Umsatz.</em><br/>Statt Förderanträge."
      lede="Innovation Republic ist der direkte Draht zu Auftraggebern, die genau Ihre Lösung suchen. Reale Aufträge — nicht weitere Pitch-Events."
    />
    <section className="dirB-section">
      <div className="dirB-sec-head">
        <div className="num">01</div>
        <div>
          <div className="label">Vorteile</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Vom Pitch zum Vertragsabschluss.</h2>
        </div>
        <div className="meta">Drei Argumente</div>
      </div>
      <div className="dirB-personas">
        {[
          { t: "Kürzere Vertriebszyklen", d: "Statt 12–18 Monate Cold-Outreach: kuratierte Bedarfe mit kaufbereiten Auftraggebern." },
          { t: "Reale Referenzen", d: "Jeder Auftrag ist eine dokumentierte Referenz aus dem Mittelstand." },
          { t: "Vergabekonforme Verträge", d: "Standardisierte Verträge, kompatibel mit öffentlichem Einkauf." },
        ].map(x => (
          <div key={x.t} className="dirB-persona">
            <div className="role">— Vorteil</div>
            <h3>{x.t}</h3>
            <p>{x.d}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="dirB-section warm">
      <div className="dirB-sec-head">
        <div className="num">02</div>
        <div>
          <div className="label">Onboarding</div>
          <h2 className="h2" style={{ marginTop: 12 }}>So werden Sie Anbieter.</h2>
        </div>
        <div className="meta">Vier Schritte</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--ink)" }}>
        {[
          { n: "I", t: "Profil anlegen", d: "Lösung, Branchen, Referenzen." },
          { n: "II", t: "Verifizierung", d: "Identitäts- und Compliance-Check." },
          { n: "III", t: "Matching aktivieren", d: "Konrad findet passende Bedarfe." },
          { n: "IV", t: "Vorschläge einreichen", d: "Auf laufende Ausschreibungen." },
        ].map(s => (
          <div key={s.n} style={{ padding: "32px 24px", borderRight: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 56, color: "var(--accent-red)", lineHeight: 1, marginBottom: 16 }}>{s.n}</div>
            <h3 className="h3" style={{ marginBottom: 8 }}>{s.t}</h3>
            <p className="body-sm">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
    <BCTA />
    <BFooter />
  </div>
);

const BDirectionBSpenden = () => (
  <div className="dirB dirB-page" data-screen-label="B-05 Förderung">
    <BNav active="spenden" />
    <BPageHead
      crumb="Förderung"
      title="<em>Wirkung.</em><br/>Pro investiertem Euro."
      lede="Als gemeinnützige Initiative von Unternehmern (in Gründung) finanzieren wir uns über Spenden und Förderpartnerschaften. Jeder Euro fließt transparent in Plattform, Knotenpunkte und Pilotprogramme."
    />
    <section className="dirB-section">
      <div className="dirB-sec-head">
        <div className="num">01</div>
        <div>
          <div className="label">Mitwirken</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Drei Wege zu fördern.</h2>
        </div>
        <div className="meta">Steuerlich abzugsfähig</div>
      </div>
      <div className="dirB-tiers">
        <div className="dirB-tier">
          <div className="label">Start-Funding</div>
          <h3>Plattform-Aufbau</h3>
          <div className="price">ab 25.000 <span className="u">€</span></div>
          <p>Grundfinanzierung von Infrastruktur und Kern-Apps.</p>
          <ul>
            <li>Founding Partner</li>
            <li>Quartalsweises Reporting</li>
            <li>Zugang zu Pilot-Daten</li>
          </ul>
          <a href="#" className="dirB-btn dirB-btn-ghost cta">Sprechen →</a>
        </div>
        <div className="dirB-tier featured">
          <div className="label">Empfohlen</div>
          <h3>Regional-Partnerschaft</h3>
          <div className="price">ab 100.000 <span className="u">€/Jahr</span></div>
          <p>Etablierung eines regionalen Knotenpunkts inkl. Netzwerkbudget.</p>
          <ul>
            <li>Eigene Region, eigenes Branding</li>
            <li>Lokale Makeathons</li>
            <li>Politische Schirmherrschaft</li>
            <li>Direkte Auftragsvermittlung</li>
          </ul>
          <a href="#" className="dirB-btn dirB-btn-ink cta">Partner werden →</a>
        </div>
        <div className="dirB-tier">
          <div className="label">Projektbezogen</div>
          <h3>Pilotprogramm</h3>
          <div className="price">ab 10.000 <span className="u">€</span></div>
          <p>Z.B. „1-Day Innovation Sprint" oder „KMU-Innovationstestfeld Süd".</p>
          <ul>
            <li>Direkte Wirkungsmessung</li>
            <li>Public Branding</li>
            <li>Steuerlich abzugsfähig</li>
          </ul>
          <a href="#" className="dirB-btn dirB-btn-ghost cta">Spenden →</a>
        </div>
      </div>
    </section>
    <section className="dirB-section deep">
      <div className="dirB-sec-head" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        <div className="num" style={{ color: "var(--accent-gold)" }}>02</div>
        <div>
          <div className="label" style={{ color: "rgba(255,255,255,0.5)" }}>Transparenz</div>
          <h2 className="h2" style={{ marginTop: 12, color: "var(--bg)" }}>Wirkung statt Versprechen.</h2>
        </div>
        <div className="meta" style={{ color: "rgba(255,255,255,0.5)" }}>i.Gr.</div>
      </div>
      <p className="lede" style={{ maxWidth: 720, color: "rgba(255,255,255,0.75)" }}>
        Alle Mittel fließen ausschließlich in gemeinnützige Zwecke. Projektergebnisse und Impact-Kennzahlen werden öffentlich ausgewiesen.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)", marginTop: 56 }}>
        {[
          { v: "87%", l: "Projektkosten" },
          { v: "9%", l: "Plattform-Betrieb" },
          { v: "4%", l: "Verwaltung" },
          { v: "100%", l: "Öffentlich auditiert" },
        ].map(n => (
          <div key={n.l} style={{ padding: "48px 32px", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ fontFamily: "var(--f-serif)", fontSize: 88, lineHeight: 0.9, color: "var(--bg)", marginBottom: 12 }}>{n.v}</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{n.l}</div>
          </div>
        ))}
      </div>
    </section>
    <BFooter />
  </div>
);

const BDirectionBUeber = () => (
  <div className="dirB dirB-page" data-screen-label="B-06 Über uns">
    <BNav active="ueber" />
    <BPageHead
      crumb="Über uns"
      title="<em>Initiative.</em><br/>Netzwerk. Plattform."
      lede="Innovation Republic ist eine gemeinnützige Initiative von Unternehmern aus dem deutschen Mittelstand (in Gründung). Pilotregion: München & Oberbayern. Die Trägerstruktur (e.V. oder gGmbH) wird vorbereitet; weitere Knotenpunkte folgen."
    />
    <section className="dirB-section">
      <div className="dirB-sec-head">
        <div className="num">01</div>
        <div>
          <div className="label">Vorstand & Beirat</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Menschen hinter dem Projekt.</h2>
        </div>
        <div className="meta">München</div>
      </div>
      <div className="dirB-people">
        {[
          { i: "C", n: "Clemens Pompeÿ", r: "Vorstand", b: "Gründer Innovation Republic. Vorher Strategy & Innovation in Mittelstand und öffentlicher Hand." },
          { i: "V", n: "Vorstand 2", r: "Stellv. Vorstand", b: "Platzhalter — Bio folgt." },
          { i: "B", n: "Beirat", r: "Wissenschaft", b: "TUM, UnternehmerTUM Netzwerk." },
          { i: "P", n: "Politik", r: "Schirmherrschaft", b: "MdL Schreyer, Ebner, Schuhknecht u.a." },
        ].map(p => (
          <div key={p.i} className="dirB-person">
            <div className="av">{p.i}</div>
            <div className="name">{p.n}</div>
            <div className="role">{p.r}</div>
            <div className="bio">{p.b}</div>
          </div>
        ))}
      </div>
    </section>
    <section className="dirB-section warm">
      <div className="dirB-sec-head">
        <div className="num">02</div>
        <div>
          <div className="label">Kontakt</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Sprechen Sie mit uns.</h2>
        </div>
        <div className="meta">Wir antworten innerhalb<br />von 2 Werktagen</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
        <div>
          <p className="lede" style={{ maxWidth: 460 }}>
            Ob Bedarf, Lösung, Förderung oder einfach Interesse — wir freuen uns über Ihre Nachricht.
          </p>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18, fontFamily: "var(--f-mono)", fontSize: 13 }}>
            <div><span style={{ color: "var(--ink-3)" }}>E-MAIL</span><br /><span style={{ fontFamily: "var(--f-serif)", fontSize: 22 }}>hello@innovationrepublic.de</span></div>
            <div><span style={{ color: "var(--ink-3)" }}>TELEFON</span><br /><span style={{ fontFamily: "var(--f-serif)", fontSize: 22 }}>+49.162.6677606</span></div>
            <div><span style={{ color: "var(--ink-3)" }}>DEMO</span><br /><span style={{ fontFamily: "var(--f-serif)", fontSize: 22 }}>demo.innovation-republic.de</span></div>
          </div>
        </div>
        <form className="dirB-form">
          <div className="dirB-field">
            <label>Name</label>
            <input placeholder="Ihr Name" />
          </div>
          <div className="dirB-field">
            <label>Organisation</label>
            <input placeholder="Firma / Verband / Behörde" />
          </div>
          <div className="dirB-field">
            <label>E-Mail</label>
            <input placeholder="name@firma.de" />
          </div>
          <div className="dirB-field">
            <label>Ich bin</label>
            <select>
              <option>Auftraggeber (KMU / öffentliche Hand)</option>
              <option>Anbieter (Startup / Scale-up)</option>
              <option>Förderer / Industrie-Partner</option>
              <option>Politik / Verwaltung</option>
            </select>
          </div>
          <div className="dirB-field">
            <label>Nachricht</label>
            <textarea placeholder="Worum geht es?" />
          </div>
          <a href="#" className="dirB-btn dirB-btn-primary" style={{ alignSelf: "flex-start" }}>Nachricht senden →</a>
        </form>
      </div>
    </section>
    <BFooter />
  </div>
);

Object.assign(window, {
  BDirectionBPlatform, BDirectionBKMU, BDirectionBAnbieter,
  BDirectionBSpenden, BDirectionBUeber
});
