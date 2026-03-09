"""
Kurierter DACH-Startup-Datensatz für Innovation Republic.
=========================================================
Handgepflegte Liste realer B2B-Startups und Scale-ups aus Deutschland,
Österreich und der Schweiz – organisiert nach den 7 Innovationskategorien.

Kein API-Key erforderlich. Dient als qualitativ hochwertiger Grundstock,
bis externe APIs (Dealroom, AngelList) konfiguriert sind.

Alle Einträge haben demo_only=False und werden NICHT von cleanup_demo_data.py
entfernt. Die Website-Verifikation (core/startup_verifier.py) prüft beim
Ingestion-Lauf automatisch ob die Startups noch aktiv sind.
"""

from typing import List

from loguru import logger

from ingestion.base import BasisConnector, StartupRohDaten


# ============================================================
# Kuratierte DACH-Startup-Daten (Stand: 2024/2025)
# ~75 reale B2B-Startups aus DE, AT, CH
# ============================================================
CURATED_STARTUPS: List[dict] = [

    # ── Prozessautomatisierung ──────────────────────────────────────────────
    {
        "name": "Celonis SE",
        "beschreibung": (
            "Weltmarktführer im Process Mining: analysiert Geschäftsprozesse "
            "auf Basis von ERP- und CRM-Daten, deckt Ineffizienzen auf und "
            "empfiehlt KI-gestützte Optimierungsmaßnahmen in Echtzeit. "
            "Einsatz in Produktion, Einkauf, Logistik und Finanzwesen."
        ),
        "tags": ["Process Mining", "ERP", "Automation", "B2B SaaS", "Enterprise Software"],
        "kategorie": "Prozessautomatisierung",
        "land": "Deutschland",
        "website": "https://www.celonis.com",
        "gruendungsjahr": 2011,
        "teamgroesse": "1000+",
    },
    {
        "name": "Camunda GmbH",
        "beschreibung": (
            "Open-Source-Plattform für Process Orchestration: koordiniert "
            "Microservices, RPA-Bots und menschliche Aufgaben mit BPMN und DMN. "
            "Ermöglicht komplexe Prozessautomatisierung ohne Vendor-Lock-in."
        ),
        "tags": ["BPMN", "Workflow", "Process Orchestration", "Microservices", "RPA"],
        "kategorie": "Prozessautomatisierung",
        "land": "Deutschland",
        "website": "https://www.camunda.com",
        "gruendungsjahr": 2008,
        "teamgroesse": "500-1000",
    },
    {
        "name": "d.velop AG",
        "beschreibung": (
            "Digitales Dokumentenmanagement und Prozessautomatisierung für "
            "den Mittelstand. Vernetzt Geschäftsprozesse, eliminiert Papier "
            "und beschleunigt Freigabe-Workflows – integriert in SAP, MS365, DATEV."
        ),
        "tags": ["DMS", "ECM", "Workflow", "Digitalisierung", "SAP"],
        "kategorie": "Prozessautomatisierung",
        "land": "Deutschland",
        "website": "https://www.d-velop.de",
        "gruendungsjahr": 1992,
        "teamgroesse": "500-1000",
    },
    {
        "name": "ELO Digital Office GmbH",
        "beschreibung": (
            "Enterprise-Content-Management-System für digitale Akten, "
            "automatisierte Rechnungsverarbeitung und Vertragsmanagement. "
            "Nahtlose ERP-Integration und revisionssichere Archivierung."
        ),
        "tags": ["ECM", "Rechnungsverarbeitung", "Archivierung", "Automatisierung"],
        "kategorie": "Prozessautomatisierung",
        "land": "Deutschland",
        "website": "https://www.elo.com",
        "gruendungsjahr": 1998,
        "teamgroesse": "500-1000",
    },
    {
        "name": "Workist GmbH",
        "beschreibung": (
            "KI-basierte Automatisierung von Auftragsverarbeitung und "
            "Dokumentenerfassung: liest Bestellungen, Lieferscheine und "
            "Rechnungen automatisch aus und überträgt sie ins ERP. "
            "Reduziert manuelle Dateneingabe um bis zu 90 Prozent."
        ),
        "tags": ["Dokumentenautomatisierung", "KI", "ERP", "Auftragsverarbeitung", "OCR"],
        "kategorie": "Prozessautomatisierung",
        "land": "Deutschland",
        "website": "https://www.workist.com",
        "gruendungsjahr": 2018,
        "teamgroesse": "50-200",
    },
    {
        "name": "Konfuzio GmbH",
        "beschreibung": (
            "Intelligente Dokumentenverarbeitung: extrahiert strukturierte Daten "
            "aus unstrukturierten Dokumenten (Verträge, Formulare, Berichte) "
            "per KI und integriert sie automatisch in Downstream-Systeme."
        ),
        "tags": ["IDP", "Dokumentenverarbeitung", "KI", "NLP", "Automatisierung"],
        "kategorie": "Prozessautomatisierung",
        "land": "Deutschland",
        "website": "https://www.konfuzio.com",
        "gruendungsjahr": 2019,
        "teamgroesse": "10-50",
    },
    {
        "name": "Finmatics GmbH",
        "beschreibung": (
            "Intelligente Belegverarbeitung und Buchhaltungsautomatisierung "
            "für KMU und Steuerberater: erkennt und bucht Rechnungen automatisch, "
            "lernt aus Korrekturen und integriert in DATEV und BMD."
        ),
        "tags": ["Buchhaltung", "DATEV", "KI", "Automation", "Steuerberatung"],
        "kategorie": "Prozessautomatisierung",
        "land": "Österreich",
        "website": "https://www.finmatics.com",
        "gruendungsjahr": 2017,
        "teamgroesse": "50-200",
    },
    {
        "name": "Heyflow GmbH",
        "beschreibung": (
            "No-Code-Plattform für interaktive Formulare und Funnels: erstellt "
            "mehrstufige Bewerbungs-, Lead- und Onboarding-Flows ohne Code. "
            "Besonders beliebt im HR-Recruiting und Marketing."
        ),
        "tags": ["No-Code", "Lead Generation", "Formular", "Recruiting", "Conversion"],
        "kategorie": "Prozessautomatisierung",
        "land": "Deutschland",
        "website": "https://www.heyflow.com",
        "gruendungsjahr": 2019,
        "teamgroesse": "50-200",
    },
    {
        "name": "Workpath GmbH",
        "beschreibung": (
            "OKR-Management-Software für strategische Ausrichtung: vernetzt "
            "Unternehmensziele mit Teamzielen, trackt Fortschritt in Echtzeit "
            "und integriert in Jira, Salesforce und Confluence."
        ),
        "tags": ["OKR", "Strategiemanagement", "Ziele", "Performance", "SaaS"],
        "kategorie": "Prozessautomatisierung",
        "land": "Deutschland",
        "website": "https://www.workpath.com",
        "gruendungsjahr": 2016,
        "teamgroesse": "50-200",
    },

    # ── Predictive Maintenance / Industrial IoT ────────────────────────────
    {
        "name": "FORCAM GmbH",
        "beschreibung": (
            "Industrial IoT-Plattform für Echtzeit-Maschinenüberwachung: "
            "verbindet Maschinen aller Hersteller, visualisiert OEE live "
            "und liefert KI-gestützte Wartungsempfehlungen für die Fertigung."
        ),
        "tags": ["IIoT", "Predictive Maintenance", "OEE", "Manufacturing", "Industry 4.0"],
        "kategorie": "Predictive Maintenance",
        "land": "Deutschland",
        "website": "https://www.forcam.com",
        "gruendungsjahr": 2001,
        "teamgroesse": "200-500",
    },
    {
        "name": "ADAMOS GmbH",
        "beschreibung": (
            "Offenes IIoT-Ökosystem für den Maschinenbau – gegründet von "
            "TRUMPF, Dürr, DMG MORI, Software AG und Zeiss. Verbindet Maschinen, "
            "Anlagen und Anwendungen auf einer sicheren Plattform."
        ),
        "tags": ["IIoT", "Maschinenbau", "Plattform", "Industry 4.0", "Ökosystem"],
        "kategorie": "Predictive Maintenance",
        "land": "Deutschland",
        "website": "https://www.adamos.com",
        "gruendungsjahr": 2017,
        "teamgroesse": "50-200",
    },
    {
        "name": "KONUX GmbH",
        "beschreibung": (
            "Industrial AI für Predictive Maintenance in der Bahntechnik: "
            "Sensoren an Weichen und Gleisen erkennen Verschleiß frühzeitig, "
            "optimieren Wartungsintervalle und verhindern Streckenausfälle."
        ),
        "tags": ["Predictive Maintenance", "Bahn", "Industrial AI", "Sensor", "IoT"],
        "kategorie": "Predictive Maintenance",
        "land": "Deutschland",
        "website": "https://www.konux.com",
        "gruendungsjahr": 2014,
        "teamgroesse": "50-200",
    },
    {
        "name": "Novity GmbH",
        "beschreibung": (
            "Predictive-Maintenance-Lösung für rotierende Maschinen: "
            "analysiert Vibration und Temperatur mit KI, erkennt Ausfälle "
            "2–4 Wochen im Voraus – einfache Nachrüstung ohne Umbau."
        ),
        "tags": ["Predictive Maintenance", "Vibration", "Sensor", "KI", "Maschinen"],
        "kategorie": "Predictive Maintenance",
        "land": "Deutschland",
        "website": "https://www.novity.io",
        "gruendungsjahr": 2018,
        "teamgroesse": "10-50",
    },
    {
        "name": "Optio Systems GmbH",
        "beschreibung": (
            "KI-gestützte Energie- und Maschinenanalyse für Gebäude und Anlagen: "
            "erkennt Anomalien in HVAC-, Kälte- und Heizungssystemen automatisch "
            "und verhindert ungeplante Ausfälle durch proaktive Wartungshinweise."
        ),
        "tags": ["IoT", "HVAC", "Gebäudeautomation", "Anomalieerkennung", "KI"],
        "kategorie": "Predictive Maintenance",
        "land": "Deutschland",
        "website": "https://www.optio.ai",
        "gruendungsjahr": 2016,
        "teamgroesse": "10-50",
    },
    {
        "name": "Prewave GmbH",
        "beschreibung": (
            "KI-basiertes Supply-Chain-Risikomonitoring: überwacht Lieferanten "
            "weltweit auf Risikosignale – Insolvenzen, ESG-Verstöße, Lieferstörungen "
            "– und warnt proaktiv Wochen bevor Probleme eskalieren."
        ),
        "tags": ["Supply Chain", "Risikomanagement", "KI", "Lieferantenmonitoring", "ESG"],
        "kategorie": "Predictive Maintenance",
        "land": "Österreich",
        "website": "https://www.prewave.com",
        "gruendungsjahr": 2018,
        "teamgroesse": "50-200",
    },
    {
        "name": "Peakboard GmbH",
        "beschreibung": (
            "No-Code-Visualisierungsplattform für die Fertigung: erstellt "
            "Echtzeit-Dashboards und digitale Shopfloor-Anzeigen aus Maschinen-, "
            "ERP- und MES-Daten ohne Programmieraufwand."
        ),
        "tags": ["Shopfloor", "Visualisierung", "No-Code", "Manufacturing", "MES"],
        "kategorie": "Predictive Maintenance",
        "land": "Deutschland",
        "website": "https://www.peakboard.com",
        "gruendungsjahr": 2016,
        "teamgroesse": "50-200",
    },
    {
        "name": "Daedalean AG",
        "beschreibung": (
            "KI-basiertes Avioniksystem für autonomes Fliegen und Kollisionsvermeidung: "
            "computer-vision-basierte Zertifizierungssoftware für kommerzielle Luftfahrt "
            "und Urban Air Mobility."
        ),
        "tags": ["KI", "Avionik", "Autonomes Fliegen", "Computer Vision", "Safety"],
        "kategorie": "Predictive Maintenance",
        "land": "Schweiz",
        "website": "https://www.daedalean.ai",
        "gruendungsjahr": 2016,
        "teamgroesse": "50-200",
    },

    # ── Nachhaltige Logistik ────────────────────────────────────────────────
    {
        "name": "sennder GmbH",
        "beschreibung": (
            "Digitale Frachtplattform für europaweite Komplettladungen: "
            "verbindet Verlader und Spediteure in Echtzeit, automatisiert "
            "Buchung und Tracking. CO2-Transparenz für jede Sendung inklusive."
        ),
        "tags": ["Logistik", "Freight", "Supply Chain", "Digitalisierung", "FTL"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.sennder.com",
        "gruendungsjahr": 2015,
        "teamgroesse": "500-1000",
    },
    {
        "name": "Forto GmbH",
        "beschreibung": (
            "Digitaler Logistikdienstleister für See- und Luftfracht: "
            "vereinfacht internationale Lieferketten durch vollständige "
            "Digitalisierung von Buchung, Zollabwicklung und Echtzeit-Tracking."
        ),
        "tags": ["Seefracht", "Luftfracht", "Logistik", "Supply Chain", "Tracking"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.forto.com",
        "gruendungsjahr": 2016,
        "teamgroesse": "200-500",
    },
    {
        "name": "Cargonexx GmbH",
        "beschreibung": (
            "KI-gestützte Frachtenbörse für Lkw-Transporteure: matched Ladungen "
            "automatisch mit freien Kapazitäten, reduziert Leerfahrten und "
            "integriert direkt in Speditionssoftware."
        ),
        "tags": ["LKW", "Frachtenbörse", "KI", "Logistik", "Kapazitätsoptimierung"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.cargonexx.com",
        "gruendungsjahr": 2017,
        "teamgroesse": "50-200",
    },
    {
        "name": "Instafreight GmbH",
        "beschreibung": (
            "Digitale Frachtplattform für Stückgut- und Palettentransporte: "
            "Sofortpreise, automatische Carrier-Vergabe und digitales "
            "Sendungstracking – speziell für mittelständische Versender."
        ),
        "tags": ["Stückgut", "Palettenversand", "Logistik", "Preistransparenz"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.instafreight.de",
        "gruendungsjahr": 2016,
        "teamgroesse": "50-200",
    },
    {
        "name": "CargoBoard GmbH",
        "beschreibung": (
            "Online-Spedition für Palettenversand: sofortige Preisberechnung, "
            "digitale Buchung und Live-Tracking für B2B-Palettensendungen "
            "in Deutschland und Europa."
        ),
        "tags": ["Palettenversand", "Spedition", "Last-Mile", "B2B", "Tracking"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.cargoboard.de",
        "gruendungsjahr": 2019,
        "teamgroesse": "50-200",
    },
    {
        "name": "Transporeon GmbH",
        "beschreibung": (
            "Transport-Management-Plattform: vernetzt über 1.300 Verlader mit "
            "140.000 Transportunternehmen für automatisierte Ausschreibung, "
            "digitale Auftragsabwicklung und CO2-Reporting."
        ),
        "tags": ["TMS", "Transport Management", "Supply Chain", "Digitalisierung", "CO2"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.transporeon.com",
        "gruendungsjahr": 2000,
        "teamgroesse": "500-1000",
    },
    {
        "name": "Warehousing1 GmbH",
        "beschreibung": (
            "Flexible Lagerkapazitäten auf Abruf: vermittelt kurzfristig "
            "Lager- und Fulfillment-Flächen in ganz Europa – ideal für "
            "saisonale Schwankungen und Wachstumsphasen ohne Langzeitbindung."
        ),
        "tags": ["Lagerlogistik", "Fulfillment", "Flex-Lager", "Supply Chain"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.warehousing1.com",
        "gruendungsjahr": 2017,
        "teamgroesse": "50-200",
    },
    {
        "name": "pakadoo AG",
        "beschreibung": (
            "Betriebliche Paketlösung: Mitarbeiter empfangen private Pakete "
            "am Arbeitsplatz über eine zentrale Poststelle. Reduziert "
            "Fehlzustellungen und CO2 durch gebündelte Lieferungen."
        ),
        "tags": ["Last-Mile", "Betriebslogistik", "Nachhaltigkeit", "Paketmanagement"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.pakadoo.de",
        "gruendungsjahr": 2015,
        "teamgroesse": "10-50",
    },
    {
        "name": "TimoCom Soft- und Hardware GmbH",
        "beschreibung": (
            "Europas größte Transport- und Logistikplattform: über 45.000 "
            "registrierte Unternehmen inserieren täglich Frachten und Laderaum. "
            "Inkl. Spotmarkt, Festaufträge und digitale Frachtdokumente."
        ),
        "tags": ["Frachtenbörse", "Logistik", "Europa", "Laderaum", "Transport"],
        "kategorie": "Nachhaltige Logistik",
        "land": "Deutschland",
        "website": "https://www.timocom.de",
        "gruendungsjahr": 1997,
        "teamgroesse": "200-500",
    },

    # ── Digitale Qualitätssicherung ─────────────────────────────────────────
    {
        "name": "Nyris GmbH",
        "beschreibung": (
            "Visuelle Suchtechnologie für die Industrie: identifiziert Bauteile "
            "und Produkte per Kamerabild in Millisekunden. Einsatz in "
            "Ersatzteilmanagement, Qualitätsprüfung und Lagerhaltung."
        ),
        "tags": ["Computer Vision", "Visual Search", "Qualitätssicherung", "Ersatzteile"],
        "kategorie": "Digitale Qualitätssicherung",
        "land": "Deutschland",
        "website": "https://www.nyris.io",
        "gruendungsjahr": 2015,
        "teamgroesse": "50-200",
    },
    {
        "name": "Visometry GmbH",
        "beschreibung": (
            "Augmented Reality für industrielle Qualitätsprüfung: überlagert "
            "CAD-Modelle in Echtzeit über reale Bauteile und zeigt Abweichungen "
            "sofort an. Reduziert Prüfzeiten um bis zu 70 Prozent."
        ),
        "tags": ["Augmented Reality", "CAD", "Qualitätsprüfung", "Fertigung", "AR"],
        "kategorie": "Digitale Qualitätssicherung",
        "land": "Deutschland",
        "website": "https://www.visometry.com",
        "gruendungsjahr": 2016,
        "teamgroesse": "10-50",
    },
    {
        "name": "Vimana GmbH",
        "beschreibung": (
            "Manufacturing-Intelligence-Plattform: sammelt Maschinendaten "
            "aus der spanenden Fertigung, visualisiert Qualitätskennzahlen "
            "in Echtzeit und identifiziert Ursachen für Ausschuss und Nacharbeit."
        ),
        "tags": ["Manufacturing Intelligence", "Qualitätsdaten", "Fertigung", "IIoT"],
        "kategorie": "Digitale Qualitätssicherung",
        "land": "Deutschland",
        "website": "https://www.vimana.works",
        "gruendungsjahr": 2015,
        "teamgroesse": "10-50",
    },
    {
        "name": "Babtec Informationssysteme GmbH",
        "beschreibung": (
            "CAQ-Software (Computer Aided Quality) für produzierende Unternehmen: "
            "digitalisiert FMEA, Prüfplanung, Reklamationsmanagement und "
            "Lieferantenqualifizierung in einem integrierten System."
        ),
        "tags": ["CAQ", "Qualitätsmanagement", "FMEA", "Reklamation", "ISO9001"],
        "kategorie": "Digitale Qualitätssicherung",
        "land": "Deutschland",
        "website": "https://www.babtec.de",
        "gruendungsjahr": 1989,
        "teamgroesse": "200-500",
    },
    {
        "name": "MPDV Mikrolab GmbH",
        "beschreibung": (
            "Manufacturing Execution System (MES) mit integriertem Qualitätsmodul: "
            "überwacht Produktionsprozesse in Echtzeit, steuert Maschinenparameter "
            "und dokumentiert Qualitätsdaten lückenlos für Audits."
        ),
        "tags": ["MES", "Qualitätssicherung", "Produktion", "Echtzeit", "Industrie"],
        "kategorie": "Digitale Qualitätssicherung",
        "land": "Deutschland",
        "website": "https://www.mpdv.de",
        "gruendungsjahr": 1977,
        "teamgroesse": "200-500",
    },
    {
        "name": "Testify GmbH",
        "beschreibung": (
            "Digitale Prüfmittelüberwachung und Qualitätsdokumentation: "
            "verwaltet Kalibrierfristen, Prüfprotokolle und Abweichungen "
            "in einem cloudbasierten QMS – einfach, mobil und auditfest."
        ),
        "tags": ["Prüfmittelüberwachung", "Kalibrierung", "QMS", "Cloud", "Audit"],
        "kategorie": "Digitale Qualitätssicherung",
        "land": "Deutschland",
        "website": "https://www.testify.de",
        "gruendungsjahr": 2018,
        "teamgroesse": "10-50",
    },
    {
        "name": "Qarma ApS (DACH-Markt)",
        "beschreibung": (
            "Mobile Qualitätssicherungssoftware für Produktinspektionen und "
            "Lieferantenaudits: digitalisiert Checklisten, erfasst Fotos und "
            "erstellt automatisch normgerechte Prüfberichte."
        ),
        "tags": ["Qualitätsinspektion", "Audit", "Mobile", "Lieferant", "Checkliste"],
        "kategorie": "Digitale Qualitätssicherung",
        "land": "Deutschland",
        "website": "https://www.qarma.com",
        "gruendungsjahr": 2017,
        "teamgroesse": "10-50",
    },

    # ── Energieeffizienz ────────────────────────────────────────────────────
    {
        "name": "tado° GmbH",
        "beschreibung": (
            "Intelligente Heizungssteuerung für Wohn- und Gewerbegebäude: "
            "lernt Verhaltensmuster, steuert Heizsysteme automatisch und "
            "reduziert Heizkosten um durchschnittlich 31 Prozent."
        ),
        "tags": ["Smart Home", "Heizung", "Energieeffizienz", "IoT", "Gebäude"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://www.tado.com",
        "gruendungsjahr": 2011,
        "teamgroesse": "200-500",
    },
    {
        "name": "gridX GmbH",
        "beschreibung": (
            "Energiemanagement-Plattform für Versorger und Industrie: "
            "optimiert Eigenverbrauch von Solarstrom, steuert Ladestationen "
            "und Batteriespeicher und reduziert Netzbezugskosten."
        ),
        "tags": ["Energiemanagement", "Solar", "Batterie", "EMS", "Ladesäule"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://www.gridx.eu",
        "gruendungsjahr": 2017,
        "teamgroesse": "50-200",
    },
    {
        "name": "sonnen GmbH",
        "beschreibung": (
            "Intelligente Heimspeichersysteme und virtuelle Kraftwerke: "
            "speichert selbst erzeugten Solarstrom und vernetzt Speicher "
            "zu einem Community-Kraftwerk für Energieunabhängigkeit."
        ),
        "tags": ["Batteriespeicher", "Solar", "Virtuelles Kraftwerk", "Energie"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://www.sonnen.de",
        "gruendungsjahr": 2010,
        "teamgroesse": "200-500",
    },
    {
        "name": "1KOMMA5° GmbH",
        "beschreibung": (
            "Heartbeat-Energiemanager vernetzt Wärmepumpe, PV-Anlage, "
            "Batteriespeicher und Wallbox zu einem intelligenten Gesamtsystem "
            "für maximale Eigenverbrauchsquote und minimale Stromkosten."
        ),
        "tags": ["Photovoltaik", "Wärmepumpe", "Energiemanagement", "Wallbox"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://1komma5grad.com",
        "gruendungsjahr": 2021,
        "teamgroesse": "500-1000",
    },
    {
        "name": "Enpal GmbH",
        "beschreibung": (
            "Photovoltaik-as-a-Service: installiert und betreibt Solaranlagen "
            "auf Mietbasis ohne Eigeninvestition. Kunden zahlen nur den "
            "günstigeren Solarstrom – Komplett-Sorglospaket inklusive."
        ),
        "tags": ["Solar", "PV", "Leasing", "Energie", "Solaranlage"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://www.enpal.de",
        "gruendungsjahr": 2017,
        "teamgroesse": "1000+",
    },
    {
        "name": "Entrix GmbH",
        "beschreibung": (
            "KI-gestützter Batteriespeicher-Optimierer: handelt automatisch "
            "an Regelenergie- und Strommärkten und maximiert die Rendite "
            "von Gewerbe- und Industriespeichern."
        ),
        "tags": ["Batteriespeicher", "Strommarkt", "KI", "Regelenergie", "Gewerbe"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://www.entrix.com",
        "gruendungsjahr": 2020,
        "teamgroesse": "10-50",
    },
    {
        "name": "Thermondo GmbH",
        "beschreibung": (
            "Digitaler Heizungsinstallateur: plant, installiert und wartet "
            "Wärmepumpen und Gasheizungen – vollständig online buchbar, "
            "mit Festpreisgarantie und digitalem Förderantrag."
        ),
        "tags": ["Wärmepumpe", "Heizungsinstallation", "Digitalisierung", "Gebäude"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://www.thermondo.de",
        "gruendungsjahr": 2012,
        "teamgroesse": "200-500",
    },
    {
        "name": "metr GmbH",
        "beschreibung": (
            "Intelligente Heizkörpersteuerung für Mehrfamilienhäuser: "
            "nachrüstbare Thermostate optimieren Heizzeiten automatisch "
            "und senken den Wärmeverbrauch ohne Nutzeraufwand."
        ),
        "tags": ["Heizungsoptimierung", "Gebäude", "IoT", "Energieeffizienz", "Nachrüstung"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://metr.at",
        "gruendungsjahr": 2016,
        "teamgroesse": "10-50",
    },
    {
        "name": "smartB energy management GmbH",
        "beschreibung": (
            "Energiemanagementsystem für Industrie und Gewerbe: misst, "
            "analysiert und optimiert Strom-, Wärme- und Gasverbräuche "
            "auf Anlagenebene und meldet Abweichungen automatisch."
        ),
        "tags": ["Energiemonitoring", "Industrie", "ISO50001", "Verbrauchsoptimierung"],
        "kategorie": "Energieeffizienz",
        "land": "Deutschland",
        "website": "https://www.smartb.energy",
        "gruendungsjahr": 2015,
        "teamgroesse": "10-50",
    },

    # ── HR-Tech ─────────────────────────────────────────────────────────────
    {
        "name": "Personio SE & Co. KG",
        "beschreibung": (
            "All-in-One HR-Software für KMU mit 10–2000 Mitarbeitern: "
            "digitalisiert Recruiting, Onboarding, Zeiterfassung, "
            "Gehaltsabrechnung und Performance-Management auf einer Plattform."
        ),
        "tags": ["HR Software", "Recruiting", "Payroll", "KMU", "ATS"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.personio.de",
        "gruendungsjahr": 2015,
        "teamgroesse": "1000+",
    },
    {
        "name": "Leapsome GmbH",
        "beschreibung": (
            "People-Enablement-Plattform: kombiniert Performance-Reviews, "
            "OKRs, Mitarbeiterbefragungen und Learning in einer integrierten "
            "Lösung für strategisches Personalmanagement."
        ),
        "tags": ["Performance Management", "OKR", "Mitarbeiterbefragung", "L&D", "HR"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.leapsome.com",
        "gruendungsjahr": 2016,
        "teamgroesse": "50-200",
    },
    {
        "name": "softgarden GmbH",
        "beschreibung": (
            "E-Recruiting-Software für den Mittelstand: veröffentlicht "
            "Stellenanzeigen auf über 300 Jobbörsen gleichzeitig, verwaltet "
            "Bewerbungen zentral und automatisiert Kommunikation mit Kandidaten."
        ),
        "tags": ["E-Recruiting", "ATS", "Jobbörse", "Mittelstand", "Bewerbermanagement"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.softgarden.de",
        "gruendungsjahr": 2003,
        "teamgroesse": "50-200",
    },
    {
        "name": "Cobrainer GmbH",
        "beschreibung": (
            "Skills-Intelligence-Plattform: identifiziert Kompetenzen von "
            "Mitarbeitern automatisch aus ihren Aktivitäten, empfiehlt "
            "passende Weiterbildungen und unterstützt internen Jobwechsel."
        ),
        "tags": ["Skills", "L&D", "Talent Management", "KI", "Interne Mobilität"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.cobrainer.com",
        "gruendungsjahr": 2018,
        "teamgroesse": "10-50",
    },
    {
        "name": "rexx systems GmbH",
        "beschreibung": (
            "Bewerbermanagement- und HR-Software für den Mittelstand: "
            "digitalisiert Stellenausschreibung, Bewerbungseingang und "
            "Vertragsmanagement in einer integrierten, DSGVO-konformen Lösung."
        ),
        "tags": ["Recruiting", "ATS", "HR Software", "Mittelstand", "DSGVO"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.rexx-systems.com",
        "gruendungsjahr": 2000,
        "teamgroesse": "50-200",
    },
    {
        "name": "Lano GmbH",
        "beschreibung": (
            "Global Employment Platform: Einstellung und Abrechnung von "
            "Mitarbeitern und Freelancern in über 150 Ländern – ohne eigene "
            "Auslandsentitäten. Compliant, schnell und digital."
        ),
        "tags": ["Global HR", "Employer of Record", "Freelancer", "Payroll", "Remote"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.lano.io",
        "gruendungsjahr": 2018,
        "teamgroesse": "50-200",
    },
    {
        "name": "Zavvy GmbH",
        "beschreibung": (
            "Mitarbeiterentwicklungs-Plattform: automatisiert Onboarding, "
            "strukturiert Entwicklungsgespräche und erstellt individuelle "
            "Wachstumspfade basierend auf Rollenanforderungen."
        ),
        "tags": ["Onboarding", "L&D", "Performance", "HR Tech", "Mitarbeiterentwicklung"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.zavvy.io",
        "gruendungsjahr": 2021,
        "teamgroesse": "10-50",
    },
    {
        "name": "Firstbird GmbH",
        "beschreibung": (
            "Digitales Mitarbeiter-Empfehlungsprogramm: motiviert Belegschaft "
            "aktiv Kandidaten zu empfehlen durch gamifizierte Belohnungssysteme. "
            "Empfehlungseinstellungen sind 2× schneller und kündigen seltener."
        ),
        "tags": ["Recruiting", "Mitarbeiterempfehlung", "Referral", "Gamification"],
        "kategorie": "HR-Tech",
        "land": "Österreich",
        "website": "https://www.firstbird.com",
        "gruendungsjahr": 2013,
        "teamgroesse": "50-200",
    },
    {
        "name": "Talentry GmbH",
        "beschreibung": (
            "Mitarbeiterempfehlungs- und Employer-Branding-Plattform: "
            "aktiviert das Netzwerk der eigenen Belegschaft für Recruiting, "
            "steigert Reichweite auf Social Media und trackt Empfehlungserfolge."
        ),
        "tags": ["Employer Branding", "Mitarbeiterempfehlung", "Social Recruiting", "HR"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.talentry.com",
        "gruendungsjahr": 2013,
        "teamgroesse": "10-50",
    },
    {
        "name": "HRworks GmbH",
        "beschreibung": (
            "HR-Software für KMU: digitalisiert Urlaubsanträge, Krankmeldungen, "
            "Reisekostenabrechnungen und Personalakten in einer einfachen, "
            "cloud-basierten Lösung ohne IT-Aufwand."
        ),
        "tags": ["HR Software", "KMU", "Urlaubsverwaltung", "Reisekosten", "Cloud"],
        "kategorie": "HR-Tech",
        "land": "Deutschland",
        "website": "https://www.hrworks.de",
        "gruendungsjahr": 2012,
        "teamgroesse": "50-200",
    },

    # ── Zirkulärwirtschaft ──────────────────────────────────────────────────
    {
        "name": "Resourcify GmbH",
        "beschreibung": (
            "Digitales Abfallmanagement für produzierende Unternehmen: "
            "verwaltet alle Abfallströme zentral, findet günstigere Entsorger "
            "und erstellt automatisch Entsorgungsnachweise für Behörden."
        ),
        "tags": ["Abfallmanagement", "Kreislaufwirtschaft", "Entsorgung", "Compliance"],
        "kategorie": "Zirkulärwirtschaft",
        "land": "Deutschland",
        "website": "https://www.resourcify.de",
        "gruendungsjahr": 2017,
        "teamgroesse": "50-200",
    },
    {
        "name": "Recyda GmbH",
        "beschreibung": (
            "Software für Verpackungscompliance: prüft Verpackungen automatisch "
            "auf Recyclingfähigkeit nach EU-Normen, berechnet Lizenzgebühren "
            "und erstellt normgerechte Recycling-Reports."
        ),
        "tags": ["Verpackung", "Recycling", "Compliance", "EU-Recht", "Kreislaufwirtschaft"],
        "kategorie": "Zirkulärwirtschaft",
        "land": "Deutschland",
        "website": "https://www.recyda.com",
        "gruendungsjahr": 2020,
        "teamgroesse": "10-50",
    },
    {
        "name": "Cylib GmbH",
        "beschreibung": (
            "Hydrometallurgisches Batterierecycling-Verfahren: gewinnt Lithium, "
            "Kobalt, Nickel und Mangan aus Altbatterien mit höchster Reinheit zurück "
            "und schließt den Rohstoffkreislauf für E-Mobilität."
        ),
        "tags": ["Batterierecycling", "Lithium", "Kreislaufwirtschaft", "CleanTech", "EV"],
        "kategorie": "Zirkulärwirtschaft",
        "land": "Deutschland",
        "website": "https://www.cylib.de",
        "gruendungsjahr": 2022,
        "teamgroesse": "10-50",
    },
    {
        "name": "Traceless Materials GmbH",
        "beschreibung": (
            "Biobasiertes Verpackungsmaterial als Kunststoffalternative: "
            "aus agrarischen Reststoffen hergestellt, vollständig kompostierbar "
            "und biologisch abbaubar – ohne Mikroplastik."
        ),
        "tags": ["Bioplastik", "Verpackung", "Nachhaltigkeit", "CleanTech", "Kreislauf"],
        "kategorie": "Zirkulärwirtschaft",
        "land": "Deutschland",
        "website": "https://www.traceless.io",
        "gruendungsjahr": 2020,
        "teamgroesse": "10-50",
    },
    {
        "name": "Pyrum Innovations AG",
        "beschreibung": (
            "Pyrolyse-Technologie für Altreifen-Recycling: wandelt Altreifen "
            "in Rußruß, Öl und Gas um – alle Fraktionen werden als Rohstoff "
            "weiterverwendet. Geschlossener Kreislauf für Gummiprodukte."
        ),
        "tags": ["Reifenrecycling", "Pyrolyse", "Kreislaufwirtschaft", "CleanTech"],
        "kategorie": "Zirkulärwirtschaft",
        "land": "Deutschland",
        "website": "https://www.pyrum.net",
        "gruendungsjahr": 2013,
        "teamgroesse": "50-200",
    },
    {
        "name": "Grover Group GmbH",
        "beschreibung": (
            "Tech-Rental-Plattform für Unternehmen und Privatpersonen: "
            "mieten statt kaufen für Smartphones, Laptops, Kameras und mehr. "
            "Verlängert Produktlebenszyklen und reduziert Elektroschrott."
        ),
        "tags": ["Circular Economy", "Tech Rental", "Elektronik", "Nachhaltigkeit", "B2C"],
        "kategorie": "Zirkulärwirtschaft",
        "land": "Deutschland",
        "website": "https://www.grover.com",
        "gruendungsjahr": 2015,
        "teamgroesse": "200-500",
    },
    {
        "name": "Circular Republic GmbH",
        "beschreibung": (
            "Ecosystem und Matchmaking für Kreislaufwirtschaft: vernetzt "
            "Industrieunternehmen, die Sekundärmaterialien anbieten, mit "
            "Abnehmern und Recyclingunternehmen in der DACH-Region."
        ),
        "tags": ["Kreislaufwirtschaft", "Materialvermittlung", "B2B", "Nachhaltigkeit"],
        "kategorie": "Zirkulärwirtschaft",
        "land": "Deutschland",
        "website": "https://www.circularrepublic.org",
        "gruendungsjahr": 2022,
        "teamgroesse": "10-50",
    },
    {
        "name": "Teqcycle Solutions GmbH",
        "beschreibung": (
            "Refurbishment und Ankauf gebrauchter Smartphones und Laptops "
            "für Unternehmenskunden: einfache Rückgabe von Altgeräten, "
            "datensichere Löschung und faire Restwertauszahlung."
        ),
        "tags": ["Refurbishment", "Elektronik", "Kreislaufwirtschaft", "B2B", "DSGVO"],
        "kategorie": "Zirkulärwirtschaft",
        "land": "Deutschland",
        "website": "https://www.teqcycle.com",
        "gruendungsjahr": 2010,
        "teamgroesse": "50-200",
    },
]


class CuratedDACHConnector(BasisConnector):
    """
    Importiert den handgepflegten Datensatz realer DACH-Startups.
    Kein API-Key erforderlich. Einträge sind KEINE Demo-Daten (demo_only=False).
    """

    QUELLE = "curated_dach"

    def importiere(self) -> int:
        """
        Importiert die kuratierten DACH-Startups in die Datenbank.

        Returns:
            Anzahl der neu gespeicherten Einträge
        """
        from pipeline.normalize import normalisiere_und_speichere

        logger.info(
            f"Starte Curated-DACH-Ingestion ({len(CURATED_STARTUPS)} Startups)..."
        )

        batch = [
            StartupRohDaten(
                name=s["name"],
                beschreibung=s["beschreibung"],
                tags=s["tags"],
                quelle=self.QUELLE,
                externe_id=f"curated_{s['name'][:30].lower().replace(' ', '_').replace('.', '').replace('ü','ue').replace('ä','ae').replace('ö','oe')}",
                land=s.get("land", ""),
                gruendungsjahr=s.get("gruendungsjahr"),
                teamgroesse=s.get("teamgroesse", ""),
                finanzierung_gesamt=None,
                website=s.get("website", ""),
                demo_only=False,   # Echte Daten – bleiben dauerhaft in der DB
            )
            for s in CURATED_STARTUPS
        ]

        importiert = normalisiere_und_speichere(batch)

        try:
            from db import get_db
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO ingestion_log (quelle, anzahl_importiert) VALUES (%s, %s)",
                        (self.QUELLE, importiert),
                    )
        except Exception as e:
            logger.warning(f"Konnte Ingestion-Log nicht schreiben: {e}")

        logger.success(
            f"Curated-DACH-Ingestion abgeschlossen: {importiert} Startups gespeichert"
        )
        return importiert
