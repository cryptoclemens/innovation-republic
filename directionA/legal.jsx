/* Direction A — Legal Pages (Impressum + Datenschutz-Hinweis)
 *
 * Hash-Routing: #/impressum, #/datenschutz
 * Datenschutz verlinkt extern auf vencly.com — eigene Seite ist nur ein Pointer
 * mit kurzem Hinweis. Falls später eigener Träger (e.V.), hier eine vollständige
 * Erklärung schreiben.
 *
 * Inhalte des Impressums kommen direkt von der alten Innovation-Republic-Seite
 * (Stand vor Redesign) — siehe SEO-CHECKLIST.md § 5.
 */

const ALegalShell = ({ crumb, title, children }) => (
  <div className="dirA dirA-page" data-screen-label={`A-Legal ${crumb}`}>
    <ANav active="" />
    <APageHead crumb={crumb} title={title} lede="" />
    <section className="dirA-section" style={{ paddingTop: 32 }}>
      <div className="dirA-legal" style={{
        maxWidth: 760,
        fontFamily: "var(--f-body)",
        fontSize: 16,
        lineHeight: 1.7,
        color: "var(--ink-1)"
      }}>
        {children}
      </div>
    </section>
    <AFooter />
  </div>
);

const ADirectionAImpressum = () => (
  <ALegalShell crumb="Impressum" title="Impressum">
    <h2 className="h3" style={{ marginTop: 0 }}>Angaben gemäß § 5 TMG</h2>
    <p>
      <strong>vencly GmbH</strong><br />
      Leopoldstraße 31<br />
      80802 München<br />
      Deutschland
    </p>

    <h3 className="h4">Vertreten durch</h3>
    <p>Clemens Eugen Theodor Pompeÿ (Geschäftsführer)</p>

    <h3 className="h4">Kontakt</h3>
    <p>
      E-Mail: <a href="mailto:hello@vencly.com">hello@vencly.com</a><br />
      Web: <a href="https://www.vencly.com" rel="noopener">www.vencly.com</a>
    </p>

    <h3 className="h4">Registereintrag</h3>
    <p>
      Eintragung im Handelsregister.<br />
      Registergericht: Amtsgericht München<br />
      Registernummer: HRB 290524
    </p>

    <h3 className="h4">Umsatzsteuer-ID</h3>
    <p>
      Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: <strong>DE367131457</strong>
    </p>

    <h3 className="h4">Hinweis zur Trägerschaft</h3>
    <p>
      Innovation Republic ist eine gemeinnützige Initiative in Gründung. Bis zur Gründung
      eines eigenen Innovation Republic e.V. übernimmt die vencly GmbH die operative Trägerschaft.
    </p>

    <h3 className="h4">Streitbeilegung</h3>
    <p>
      Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
      <a href="https://ec.europa.eu/consumers/odr/" rel="noopener">https://ec.europa.eu/consumers/odr/</a>.
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
      Verbraucherschlichtungsstelle teilzunehmen.
    </p>

    <h3 className="h4">Haftung für Inhalte</h3>
    <p>
      Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach
      den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
      jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
      oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
    </p>

    <h3 className="h4">Haftung für Links</h3>
    <p>
      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
      Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
      Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
      Seiten verantwortlich.
    </p>

    <h3 className="h4">Urheberrecht</h3>
    <p>
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
      dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die
      Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
      Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
      bzw. Erstellers.
    </p>

    <p style={{ marginTop: 48 }}>
      <a href="#/datenschutz">Datenschutzerklärung →</a>
    </p>
  </ALegalShell>
);

const ADirectionADatenschutz = () => (
  <ALegalShell crumb="Datenschutz" title="Datenschutz">
    <p>
      Innovation Republic ist eine gemeinnützige Initiative in Gründung; operativer Träger
      und Verantwortlicher im Sinne der DSGVO ist die <strong>vencly GmbH</strong> (siehe{" "}
      <a href="#/impressum">Impressum</a>).
    </p>
    <p>
      Es gilt die <a href="https://www.vencly.com/datenschutzerklarung" rel="noopener">
      Datenschutzerklärung der vencly GmbH</a>.
    </p>

    <h3 className="h4">Kurzfassung für diese Website</h3>
    <ul>
      <li>Hosting auf Cloudflare Pages (USA — Data Privacy Framework, EU-Standardvertragsklauseln).</li>
      <li>Kein Tracking, keine Werbe-Cookies, kein Cookie-Banner notwendig.</li>
      <li>Optional: Cloudflare Web Analytics (anonyme, aggregierte Aufrufstatistik ohne Cookies oder Fingerprinting).</li>
      <li>Kontaktaufnahme per E-Mail: Wir speichern Ihre Nachricht zur Bearbeitung; bei steuerlich
          relevanten Vorgängen 10 Jahre, sonst längstens 3 Jahre.</li>
      <li>Keine automatisierte Entscheidungsfindung im Sinne von Art. 22 DSGVO.</li>
      <li>Ihre Rechte nach Art. 15–21 DSGVO (Auskunft, Berichtigung, Löschung, Einschränkung,
          Widerspruch, Datenübertragbarkeit).</li>
      <li>Aufsichtsbehörde: Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18,
          91522 Ansbach.</li>
    </ul>

    <p style={{ marginTop: 48 }}>
      <a href="#/impressum">← Zurück zum Impressum</a>
    </p>
  </ALegalShell>
);

Object.assign(window, {
  ADirectionAImpressum,
  ADirectionADatenschutz,
});
