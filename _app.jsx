// _app.jsx — Innovation Republic Production-Mount
// Wird sowohl im Dev (Babel-Standalone via index.html) als auch im Production-Build
// (esbuild-Bundle, von build.mjs) verwendet.
//
// CHANGES (SEO-Pass 2026-05):
// - Hash-Routing ergänzt: #/, #/plattform, #/kmu, #/anbieter, #/foerderung, #/ueber, #/impressum, #/datenschutz
// - Production-Mount nutzt Single-Page-Layout (kein Design-Canvas mehr) sobald
//   process.env.NODE_ENV === 'production'
// - Design-Canvas + Tweaks-Panel bleiben für Dev/Reviews aktiv

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showA": true,
  "showB": false,
  "accentBoost": false,
  "monoLabels": true,
  "checkAutoOpen": true,
  "checkAutoOpenSeconds": 15
}/*EDITMODE-END*/;

// --- Hash-Router ---------------------------------------------------------
function useHashRoute() {
  const get = () => (typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '');
  const [route, setRoute] = React.useState(get());
  React.useEffect(() => {
    const onHash = () => setRoute(get());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route || 'home';
}

const ROUTE_TITLE = {
  home:        'Innovation Republic — Innovation für KMU, kuratiert und gemeinnützig',
  plattform:   'Plattform — Innovation Republic',
  kmu:         'Für Bedarfsträger — Innovation Republic',
  anbieter:    'Für Anbieter — Innovation Republic',
  foerderung:  'Förderung — Innovation Republic',
  ueber:       'Über uns — Innovation Republic',
  impressum:   'Impressum — Innovation Republic',
  datenschutz: 'Datenschutz — Innovation Republic',
};

const ROUTE_ROBOTS = {
  impressum:   'index, nofollow',
  datenschutz: 'index, nofollow',
};

function applyHeadForRoute(route) {
  if (typeof document === 'undefined') return;
  const t = ROUTE_TITLE[route] || ROUTE_TITLE.home;
  if (document.title !== t) document.title = t;
  // Canonical
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
  link.href = route === 'home'
    ? 'https://innovation-republic.eu/'
    : `https://innovation-republic.eu/#/${route}`;
  // Robots
  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
  robots.content = ROUTE_ROBOTS[route] || 'index, follow';
}

function ProductionApp() {
  const route = useHashRoute();
  const [checkOpen, setCheckOpen] = React.useState(false);
  const [checkResume, setCheckResume] = React.useState(false);
  const [hasResult, setHasResult] = React.useState(false);

  React.useEffect(() => { applyHeadForRoute(route); window.scrollTo(0, 0); }, [route]);

  React.useEffect(() => {
    setHasResult(!!localStorage.getItem(CHECK_LS_RESULT));
  }, [checkOpen]);

  React.useEffect(() => {
    const open = (e) => {
      setCheckResume(!!(e.detail && e.detail.resume));
      setCheckOpen(true);
    };
    window.addEventListener('ir-open-check', open);
    return () => window.removeEventListener('ir-open-check', open);
  }, []);

  let Page = ADirectionAHome;
  if (route === 'plattform')   Page = ADirectionAPlatform;
  if (route === 'kmu')         Page = ADirectionAKMU;
  if (route === 'anbieter')    Page = ADirectionAAnbieter;
  if (route === 'foerderung')  Page = ADirectionASpenden;
  if (route === 'ueber')       Page = ADirectionAUeber;
  if (route === 'impressum')   Page = ADirectionAImpressum;
  if (route === 'datenschutz') Page = ADirectionADatenschutz;

  return (
    <>
      <Page />
      <CheckStickyPill
        onOpen={() => { setCheckResume(false); setCheckOpen(true); }}
        onResume={() => { setCheckResume(true); setCheckOpen(true); }}
        hasResult={hasResult}
      />
      <CheckModal
        open={checkOpen}
        onClose={() => setCheckOpen(false)}
        jumpToResult={checkResume}
      />
    </>
  );
}

// --- Dev-App (Design-Canvas + Tweaks) — unverändert ----------------------
function DevApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [checkOpen, setCheckOpen] = React.useState(false);
  const [checkResume, setCheckResume] = React.useState(false);
  const [hasResult, setHasResult] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    if (tweaks.accentBoost) {
      root.style.setProperty('--ir-accent-boost', '1');
      document.body.classList.add('accent-boost');
    } else {
      root.style.setProperty('--ir-accent-boost', '0');
      document.body.classList.remove('accent-boost');
    }
  }, [tweaks.accentBoost]);

  React.useEffect(() => {
    if (!tweaks.showA || !tweaks.checkAutoOpen) return;
    const seen = localStorage.getItem(CHECK_LS_SEEN);
    if (seen) return;
    let timeReady = false, scrollReady = false, fired = false;
    const fire = () => {
      if (fired || !timeReady || !scrollReady) return;
      fired = true;
      setCheckResume(false); setCheckOpen(true);
      try { localStorage.setItem(CHECK_LS_SEEN, String(Date.now())); } catch(e) {}
    };
    const checkScroll = () => {
      const docScroll = window.scrollY || document.documentElement.scrollTop;
      const docMax = (document.documentElement.scrollHeight || 0) - window.innerHeight;
      const winRatio = docMax > 0 ? docScroll / docMax : 0;
      let innerRatio = 0;
      document.querySelectorAll('[data-dc-scroll], .dc-focus-scroll, .dc-canvas-scroll').forEach(s => {
        const max = s.scrollHeight - s.clientHeight;
        if (max > 0) innerRatio = Math.max(innerRatio, s.scrollTop / max);
      });
      if (Math.max(winRatio, innerRatio) >= 0.5) { scrollReady = true; fire(); }
    };
    const t = setTimeout(() => { timeReady = true; fire(); }, (tweaks.checkAutoOpenSeconds || 15) * 1000);
    window.addEventListener('scroll', checkScroll, { passive: true });
    document.addEventListener('scroll', checkScroll, { capture: true, passive: true });
    const initCheck = setTimeout(checkScroll, 300);
    return () => {
      clearTimeout(t); clearTimeout(initCheck);
      window.removeEventListener('scroll', checkScroll);
      document.removeEventListener('scroll', checkScroll, { capture: true });
    };
  }, [tweaks.showA, tweaks.checkAutoOpen, tweaks.checkAutoOpenSeconds]);

  React.useEffect(() => { setHasResult(!!localStorage.getItem(CHECK_LS_RESULT)); }, [checkOpen]);

  React.useEffect(() => {
    const open = (e) => {
      setCheckResume(!!(e.detail && e.detail.resume));
      setCheckOpen(true);
    };
    window.addEventListener('ir-open-check', open);
    return () => window.removeEventListener('ir-open-check', open);
  }, []);

  return (
    <>
      <DesignCanvas>
        {tweaks.showA && (
          <DCSection id="dirA" title="Richtung A — InnovationOS" subtitle="Modern-Tech, App-Tile-Hero, monospace Akzente">
            <DCArtboard id="a-home" label="Startseite" width={1440} height={3680}><ADirectionAHome /></DCArtboard>
            <DCArtboard id="a-platform" label="Plattform" width={1440} height={2400}><ADirectionAPlatform /></DCArtboard>
            <DCArtboard id="a-kmu" label="Für Auftraggeber" width={1440} height={2200}><ADirectionAKMU /></DCArtboard>
            <DCArtboard id="a-anbieter" label="Für Anbieter" width={1440} height={1800}><ADirectionAAnbieter /></DCArtboard>
            <DCArtboard id="a-spenden" label="Förderung" width={1440} height={1900}><ADirectionASpenden /></DCArtboard>
            <DCArtboard id="a-ueber" label="Über uns / Kontakt" width={1440} height={1700}><ADirectionAUeber /></DCArtboard>
            <DCArtboard id="a-impressum" label="Impressum" width={1440} height={1900}><ADirectionAImpressum /></DCArtboard>
            <DCArtboard id="a-datenschutz" label="Datenschutz" width={1440} height={1500}><ADirectionADatenschutz /></DCArtboard>
          </DCSection>
        )}
        {tweaks.showB && (
          <DCSection id="dirB" title="Richtung B — Marktplatz" subtitle="Editorial, Serif-Stimme, Manifesto-Tonalität">
            <DCArtboard id="b-home" label="Startseite" width={1440} height={3500}><BDirectionBHome /></DCArtboard>
            <DCArtboard id="b-platform" label="Plattform" width={1440} height={2400}><BDirectionBPlatform /></DCArtboard>
            <DCArtboard id="b-kmu" label="Für Auftraggeber" width={1440} height={1900}><BDirectionBKMU /></DCArtboard>
            <DCArtboard id="b-anbieter" label="Für Anbieter" width={1440} height={1900}><BDirectionBAnbieter /></DCArtboard>
            <DCArtboard id="b-spenden" label="Förderung" width={1440} height={2100}><BDirectionBSpenden /></DCArtboard>
            <DCArtboard id="b-ueber" label="Über uns / Kontakt" width={1440} height={1900}><BDirectionBUeber /></DCArtboard>
          </DCSection>
        )}
      </DesignCanvas>
      {tweaks.showA && (
        <>
          <CheckStickyPill
            onOpen={() => { setCheckResume(false); setCheckOpen(true); }}
            onResume={() => { setCheckResume(true); setCheckOpen(true); }}
            hasResult={hasResult}
          />
          <CheckModal
            open={checkOpen}
            onClose={() => setCheckOpen(false)}
            jumpToResult={checkResume}
          />
        </>
      )}
      <TweaksPanel title="Tweaks" defaultOpen={false}>
        <TweakSection title="Richtungen anzeigen">
          <TweakToggle label="Richtung A — InnovationOS" value={tweaks.showA} onChange={v => setTweak('showA', v)} />
          <TweakToggle label="Richtung B — Marktplatz" value={tweaks.showB} onChange={v => setTweak('showB', v)} />
        </TweakSection>
        <TweakSection title="Innovations-Check">
          <TweakToggle label="Auto-Open aktiv" value={tweaks.checkAutoOpen} onChange={v => setTweak('checkAutoOpen', v)} />
          <TweakSlider label="Auto-Open nach (Sek.)" value={tweaks.checkAutoOpenSeconds} min={3} max={30} step={1} onChange={v => setTweak('checkAutoOpenSeconds', v)} />
          <TweakButton label="Modal jetzt öffnen" onClick={() => { setCheckResume(false); setCheckOpen(true); }} />
          <TweakButton label="Auto-Open zurücksetzen" onClick={() => { localStorage.removeItem(CHECK_LS_SEEN); localStorage.removeItem(CHECK_LS_RESULT); setHasResult(false); }} />
        </TweakSection>
        <TweakSection title="Stil-Optionen">
          <TweakToggle label="Logo-Farben stärker" value={tweaks.accentBoost} onChange={v => setTweak('accentBoost', v)} />
          <TweakToggle label="Mono-Labels" value={tweaks.monoLabels} onChange={v => setTweak('monoLabels', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

const isProd = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production');
const App = isProd ? ProductionApp : DevApp;

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
