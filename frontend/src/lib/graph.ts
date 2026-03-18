/**
 * Innovation Republic · Graph-Wissensbasis
 *
 * In-Memory-Graph mit DACH-Startups, Problemen, Branchen, Technologien und Regionen.
 * Kein externer Service nötig – läuft direkt in Next.js / Vercel.
 */

export type NodeType = "startup" | "problem" | "technologie" | "branche" | "region";
export type EdgeType =
  | "LÖST"
  | "NUTZT"
  | "IN_BRANCHE"
  | "SITZT_IN"
  | "VERWANDT_MIT"
  | "UNTERKATEGORIE_VON";

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  beschreibung?: string;
  metadata?: {
    land?: string;
    website?: string | null;
    gruendungsjahr?: number | null;
    quelle?: "seed" | "onboarding";
  };
}

export interface GraphEdge {
  from: string;
  to: string;
  type: EdgeType;
}

export interface Graph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
}

export function buildGraph(): Graph {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  const n = (node: GraphNode) => nodes.set(node.id, node);
  const e = (from: string, to: string, type: EdgeType) =>
    edges.push({ from, to, type });

  // ── Regionen ────────────────────────────────────────────────────────────────
  n({ id: "r_de", type: "region", label: "Deutschland" });
  n({ id: "r_at", type: "region", label: "Österreich" });
  n({ id: "r_ch", type: "region", label: "Schweiz" });
  n({ id: "r_us", type: "region", label: "USA" });
  n({ id: "r_eu", type: "region", label: "EU" });

  // ── Branchen ─────────────────────────────────────────────────────────────────
  n({ id: "b_hr", type: "branche", label: "HR & Personal" });
  n({ id: "b_finance", type: "branche", label: "Finance & Buchhaltung" });
  n({ id: "b_sales", type: "branche", label: "Vertrieb & CRM" });
  n({ id: "b_marketing", type: "branche", label: "Marketing & Kommunikation" });
  n({ id: "b_supply", type: "branche", label: "Supply Chain & Logistik" });
  n({ id: "b_it", type: "branche", label: "IT & Infrastruktur" });
  n({ id: "b_legal", type: "branche", label: "Legal & Compliance" });
  n({ id: "b_project", type: "branche", label: "Projektmanagement" });
  n({ id: "b_ecommerce", type: "branche", label: "E-Commerce" });
  n({ id: "b_analytics", type: "branche", label: "Analytics & BI" });

  // ── Technologien ──────────────────────────────────────────────────────────────
  n({ id: "t_ai", type: "technologie", label: "Künstliche Intelligenz" });
  n({ id: "t_saas", type: "technologie", label: "SaaS" });
  n({ id: "t_automation", type: "technologie", label: "Prozessautomatisierung" });
  n({ id: "t_cloud", type: "technologie", label: "Cloud" });
  n({ id: "t_ml", type: "technologie", label: "Machine Learning" });
  n({ id: "t_erp", type: "technologie", label: "ERP" });
  n({ id: "t_api", type: "technologie", label: "API-Integration" });

  // ── Probleme ──────────────────────────────────────────────────────────────────
  n({ id: "p_recruiting", type: "problem", label: "Recruiting & Talentgewinnung" });
  n({ id: "p_payroll", type: "problem", label: "Gehaltsabrechnung & Lohnbuchhaltung" });
  n({ id: "p_onboarding_hr", type: "problem", label: "Mitarbeiter-Onboarding" });
  n({ id: "p_invoicing", type: "problem", label: "Rechnungsstellung & Buchhaltung" });
  n({ id: "p_crm", type: "problem", label: "Kundenverwaltung & CRM" });
  n({ id: "p_project", type: "problem", label: "Projektplanung & -steuerung" });
  n({ id: "p_analytics", type: "problem", label: "Datenanalyse & Reporting" });
  n({ id: "p_process", type: "problem", label: "Prozessoptimierung & Process Mining" });
  n({ id: "p_compliance", type: "problem", label: "Compliance & DSGVO" });
  n({ id: "p_communication", type: "problem", label: "Teamkommunikation & Kollaboration" });
  n({ id: "p_supply", type: "problem", label: "Lieferketten-Management & Einkauf" });
  n({ id: "p_ecommerce", type: "problem", label: "Online-Shop & E-Commerce" });
  n({ id: "p_expense", type: "problem", label: "Reisekostenabrechnung & Ausgaben" });
  n({ id: "p_signing", type: "problem", label: "Digitale Signaturen & Verträge" });
  n({ id: "p_marketing_auto", type: "problem", label: "Marketing-Automatisierung" });

  // Problem-Verwandtschaften
  e("p_recruiting", "p_onboarding_hr", "VERWANDT_MIT");
  e("p_invoicing", "p_compliance", "VERWANDT_MIT");
  e("p_process", "p_analytics", "VERWANDT_MIT");
  e("p_expense", "p_invoicing", "VERWANDT_MIT");
  e("p_supply", "p_process", "VERWANDT_MIT");
  e("p_signing", "p_compliance", "VERWANDT_MIT");
  e("p_marketing_auto", "p_crm", "VERWANDT_MIT");

  // ── Seed-Startups ─────────────────────────────────────────────────────────────

  // HR
  n({ id: "s_personio", type: "startup", label: "Personio", beschreibung: "All-in-one HR-Software für KMU – Recruiting, Verwaltung und Payroll", metadata: { land: "Deutschland", website: "https://www.personio.de", gruendungsjahr: 2015, quelle: "seed" } });
  e("s_personio", "p_recruiting", "LÖST"); e("s_personio", "p_payroll", "LÖST"); e("s_personio", "p_onboarding_hr", "LÖST");
  e("s_personio", "b_hr", "IN_BRANCHE"); e("s_personio", "r_de", "SITZT_IN");
  e("s_personio", "t_saas", "NUTZT"); e("s_personio", "t_cloud", "NUTZT");

  n({ id: "s_rexx", type: "startup", label: "rexx systems", beschreibung: "HR-Software für Talent Management, Recruiting und digitale Personalakte", metadata: { land: "Deutschland", website: "https://www.rexx-systems.com", gruendungsjahr: 2000, quelle: "seed" } });
  e("s_rexx", "p_recruiting", "LÖST"); e("s_rexx", "p_onboarding_hr", "LÖST");
  e("s_rexx", "b_hr", "IN_BRANCHE"); e("s_rexx", "r_de", "SITZT_IN"); e("s_rexx", "t_saas", "NUTZT");

  n({ id: "s_factorial", type: "startup", label: "Factorial HR", beschreibung: "HR-Plattform für Verwaltung, Zeiterfassung und Mitarbeiterentwicklung", metadata: { land: "EU", website: "https://factorialhr.de", gruendungsjahr: 2016, quelle: "seed" } });
  e("s_factorial", "p_payroll", "LÖST"); e("s_factorial", "p_onboarding_hr", "LÖST"); e("s_factorial", "p_recruiting", "LÖST");
  e("s_factorial", "b_hr", "IN_BRANCHE"); e("s_factorial", "r_eu", "SITZT_IN"); e("s_factorial", "t_saas", "NUTZT");

  // Finance & Buchhaltung
  n({ id: "s_candis", type: "startup", label: "Candis", beschreibung: "Automatisierte Buchhaltung und Rechnungsverarbeitung für KMU", metadata: { land: "Deutschland", website: "https://www.candis.io", gruendungsjahr: 2015, quelle: "seed" } });
  e("s_candis", "p_invoicing", "LÖST");
  e("s_candis", "b_finance", "IN_BRANCHE"); e("s_candis", "r_de", "SITZT_IN");
  e("s_candis", "t_ai", "NUTZT"); e("s_candis", "t_automation", "NUTZT");

  n({ id: "s_bilendo", type: "startup", label: "Bilendo", beschreibung: "Cloud-Forderungsmanagement und automatisiertes Mahnwesen", metadata: { land: "Deutschland", website: "https://www.bilendo.de", gruendungsjahr: 2013, quelle: "seed" } });
  e("s_bilendo", "p_invoicing", "LÖST");
  e("s_bilendo", "b_finance", "IN_BRANCHE"); e("s_bilendo", "r_de", "SITZT_IN");
  e("s_bilendo", "t_saas", "NUTZT"); e("s_bilendo", "t_automation", "NUTZT");

  n({ id: "s_lexoffice", type: "startup", label: "Lexoffice", beschreibung: "Buchhaltungssoftware für Selbstständige und kleine Unternehmen", metadata: { land: "Deutschland", website: "https://www.lexoffice.de", gruendungsjahr: 2013, quelle: "seed" } });
  e("s_lexoffice", "p_invoicing", "LÖST");
  e("s_lexoffice", "b_finance", "IN_BRANCHE"); e("s_lexoffice", "r_de", "SITZT_IN"); e("s_lexoffice", "t_cloud", "NUTZT");

  n({ id: "s_pleo", type: "startup", label: "Pleo", beschreibung: "Firmenkarten und automatisierte Ausgabenverwaltung für Teams", metadata: { land: "EU", website: "https://www.pleo.io", gruendungsjahr: 2015, quelle: "seed" } });
  e("s_pleo", "p_expense", "LÖST"); e("s_pleo", "p_invoicing", "LÖST");
  e("s_pleo", "b_finance", "IN_BRANCHE"); e("s_pleo", "r_eu", "SITZT_IN");
  e("s_pleo", "t_saas", "NUTZT"); e("s_pleo", "t_api", "NUTZT");

  // Analytics & Process Mining
  n({ id: "s_celonis", type: "startup", label: "Celonis", beschreibung: "Process Mining Plattform zur Prozessoptimierung und Supply-Chain-Analyse", metadata: { land: "Deutschland", website: "https://www.celonis.com", gruendungsjahr: 2011, quelle: "seed" } });
  e("s_celonis", "p_process", "LÖST"); e("s_celonis", "p_analytics", "LÖST"); e("s_celonis", "p_supply", "LÖST");
  e("s_celonis", "b_analytics", "IN_BRANCHE"); e("s_celonis", "b_supply", "IN_BRANCHE");
  e("s_celonis", "r_de", "SITZT_IN"); e("s_celonis", "t_ai", "NUTZT"); e("s_celonis", "t_ml", "NUTZT");

  n({ id: "s_signavio", type: "startup", label: "Signavio", beschreibung: "Business Process Management und Prozessanalyse (SAP)", metadata: { land: "Deutschland", website: "https://www.signavio.com", gruendungsjahr: 2009, quelle: "seed" } });
  e("s_signavio", "p_process", "LÖST"); e("s_signavio", "p_analytics", "LÖST");
  e("s_signavio", "b_analytics", "IN_BRANCHE"); e("s_signavio", "r_de", "SITZT_IN"); e("s_signavio", "t_saas", "NUTZT");

  // CRM & Sales
  n({ id: "s_hubspot", type: "startup", label: "HubSpot", beschreibung: "CRM, Marketing-Automatisierung und Sales-Plattform", metadata: { land: "USA", website: "https://www.hubspot.com", gruendungsjahr: 2006, quelle: "seed" } });
  e("s_hubspot", "p_crm", "LÖST"); e("s_hubspot", "p_marketing_auto", "LÖST");
  e("s_hubspot", "b_sales", "IN_BRANCHE"); e("s_hubspot", "b_marketing", "IN_BRANCHE");
  e("s_hubspot", "r_us", "SITZT_IN"); e("s_hubspot", "t_saas", "NUTZT"); e("s_hubspot", "t_ai", "NUTZT");

  n({ id: "s_pipedrive", type: "startup", label: "Pipedrive", beschreibung: "CRM und Sales-Pipeline-Management für KMU", metadata: { land: "EU", website: "https://www.pipedrive.com", gruendungsjahr: 2010, quelle: "seed" } });
  e("s_pipedrive", "p_crm", "LÖST");
  e("s_pipedrive", "b_sales", "IN_BRANCHE"); e("s_pipedrive", "r_eu", "SITZT_IN"); e("s_pipedrive", "t_saas", "NUTZT");

  n({ id: "s_weclapp", type: "startup", label: "weclapp", beschreibung: "Cloud-ERP für KMU mit CRM, Warenwirtschaft und Buchhaltung", metadata: { land: "Deutschland", website: "https://www.weclapp.com", gruendungsjahr: 2008, quelle: "seed" } });
  e("s_weclapp", "p_crm", "LÖST"); e("s_weclapp", "p_invoicing", "LÖST");
  e("s_weclapp", "b_sales", "IN_BRANCHE"); e("s_weclapp", "b_finance", "IN_BRANCHE");
  e("s_weclapp", "r_de", "SITZT_IN"); e("s_weclapp", "t_erp", "NUTZT"); e("s_weclapp", "t_cloud", "NUTZT");

  // Projektmanagement
  n({ id: "s_awork", type: "startup", label: "awork", beschreibung: "Projektmanagement-Tool für agile Teams – made in Germany", metadata: { land: "Deutschland", website: "https://www.awork.com", gruendungsjahr: 2018, quelle: "seed" } });
  e("s_awork", "p_project", "LÖST"); e("s_awork", "p_communication", "LÖST");
  e("s_awork", "b_project", "IN_BRANCHE"); e("s_awork", "r_de", "SITZT_IN"); e("s_awork", "t_saas", "NUTZT");

  n({ id: "s_meistertask", type: "startup", label: "MeisterTask", beschreibung: "Aufgaben- und Projektmanagement für Teams", metadata: { land: "Deutschland", website: "https://www.meistertask.com", gruendungsjahr: 2015, quelle: "seed" } });
  e("s_meistertask", "p_project", "LÖST");
  e("s_meistertask", "b_project", "IN_BRANCHE"); e("s_meistertask", "r_de", "SITZT_IN"); e("s_meistertask", "t_saas", "NUTZT");

  // Kommunikation & Kollaboration
  n({ id: "s_stackfield", type: "startup", label: "Stackfield", beschreibung: "DSGVO-konformes Team-Collaboration-Tool aus Deutschland", metadata: { land: "Deutschland", website: "https://www.stackfield.com", gruendungsjahr: 2012, quelle: "seed" } });
  e("s_stackfield", "p_communication", "LÖST"); e("s_stackfield", "p_compliance", "LÖST");
  e("s_stackfield", "b_it", "IN_BRANCHE"); e("s_stackfield", "r_de", "SITZT_IN");
  e("s_stackfield", "t_saas", "NUTZT"); e("s_stackfield", "t_cloud", "NUTZT");

  n({ id: "s_whereby", type: "startup", label: "Whereby", beschreibung: "Browser-basierte Videokonferenz-Lösung ohne App-Installation", metadata: { land: "EU", website: "https://whereby.com", gruendungsjahr: 2013, quelle: "seed" } });
  e("s_whereby", "p_communication", "LÖST");
  e("s_whereby", "b_it", "IN_BRANCHE"); e("s_whereby", "r_eu", "SITZT_IN"); e("s_whereby", "t_saas", "NUTZT");

  // Supply Chain & Einkauf
  n({ id: "s_scoutbee", type: "startup", label: "Scoutbee", beschreibung: "KI-gestütztes Lieferantenmanagement und Beschaffungsoptimierung", metadata: { land: "Deutschland", website: "https://www.scoutbee.com", gruendungsjahr: 2015, quelle: "seed" } });
  e("s_scoutbee", "p_supply", "LÖST");
  e("s_scoutbee", "b_supply", "IN_BRANCHE"); e("s_scoutbee", "r_de", "SITZT_IN");
  e("s_scoutbee", "t_ai", "NUTZT"); e("s_scoutbee", "t_ml", "NUTZT");

  n({ id: "s_sap_ariba", type: "startup", label: "SAP Ariba", beschreibung: "Procurement und Supply-Chain-Plattform für Unternehmen", metadata: { land: "Deutschland", website: "https://www.ariba.com", gruendungsjahr: 1996, quelle: "seed" } });
  e("s_sap_ariba", "p_supply", "LÖST");
  e("s_sap_ariba", "b_supply", "IN_BRANCHE"); e("s_sap_ariba", "r_de", "SITZT_IN"); e("s_sap_ariba", "t_erp", "NUTZT");

  // Legal & Compliance
  n({ id: "s_taxdoo", type: "startup", label: "Taxdoo", beschreibung: "Automatisierte Umsatzsteuer-Compliance für E-Commerce-Händler", metadata: { land: "Deutschland", website: "https://www.taxdoo.com", gruendungsjahr: 2016, quelle: "seed" } });
  e("s_taxdoo", "p_compliance", "LÖST"); e("s_taxdoo", "p_ecommerce", "LÖST");
  e("s_taxdoo", "b_legal", "IN_BRANCHE"); e("s_taxdoo", "b_ecommerce", "IN_BRANCHE");
  e("s_taxdoo", "r_de", "SITZT_IN"); e("s_taxdoo", "t_automation", "NUTZT");

  n({ id: "s_docusign", type: "startup", label: "DocuSign", beschreibung: "Elektronische Signaturen und digitales Vertragsmanagement", metadata: { land: "USA", website: "https://www.docusign.com", gruendungsjahr: 2003, quelle: "seed" } });
  e("s_docusign", "p_signing", "LÖST"); e("s_docusign", "p_compliance", "LÖST");
  e("s_docusign", "b_legal", "IN_BRANCHE"); e("s_docusign", "r_us", "SITZT_IN"); e("s_docusign", "t_saas", "NUTZT");

  n({ id: "s_skribble", type: "startup", label: "Skribble", beschreibung: "Qualifizierte elektronische Signaturen nach EU-eIDAS aus der Schweiz", metadata: { land: "Schweiz", website: "https://www.skribble.com", gruendungsjahr: 2018, quelle: "seed" } });
  e("s_skribble", "p_signing", "LÖST"); e("s_skribble", "p_compliance", "LÖST");
  e("s_skribble", "b_legal", "IN_BRANCHE"); e("s_skribble", "r_ch", "SITZT_IN");
  e("s_skribble", "t_saas", "NUTZT"); e("s_skribble", "t_api", "NUTZT");

  // E-Commerce
  n({ id: "s_shopware", type: "startup", label: "Shopware", beschreibung: "Open-Source E-Commerce-Plattform für den DACH-Raum", metadata: { land: "Deutschland", website: "https://www.shopware.com", gruendungsjahr: 2000, quelle: "seed" } });
  e("s_shopware", "p_ecommerce", "LÖST");
  e("s_shopware", "b_ecommerce", "IN_BRANCHE"); e("s_shopware", "r_de", "SITZT_IN"); e("s_shopware", "t_api", "NUTZT");

  n({ id: "s_shopify", type: "startup", label: "Shopify", beschreibung: "E-Commerce-Plattform für Online-Shops und Direktvertrieb", metadata: { land: "USA", website: "https://www.shopify.com", gruendungsjahr: 2006, quelle: "seed" } });
  e("s_shopify", "p_ecommerce", "LÖST");
  e("s_shopify", "b_ecommerce", "IN_BRANCHE"); e("s_shopify", "r_us", "SITZT_IN");
  e("s_shopify", "t_saas", "NUTZT"); e("s_shopify", "t_api", "NUTZT");

  // Marketing
  n({ id: "s_evalanche", type: "startup", label: "Evalanche", beschreibung: "E-Mail-Marketing und Marketing-Automatisierung für B2B", metadata: { land: "Deutschland", website: "https://www.sc-networks.de", gruendungsjahr: 1999, quelle: "seed" } });
  e("s_evalanche", "p_marketing_auto", "LÖST");
  e("s_evalanche", "b_marketing", "IN_BRANCHE"); e("s_evalanche", "r_de", "SITZT_IN"); e("s_evalanche", "t_saas", "NUTZT");

  n({ id: "s_brevo", type: "startup", label: "Brevo", beschreibung: "E-Mail-Marketing, SMS und CRM-Automatisierung (ehem. Sendinblue)", metadata: { land: "EU", website: "https://www.brevo.com", gruendungsjahr: 2012, quelle: "seed" } });
  e("s_brevo", "p_marketing_auto", "LÖST"); e("s_brevo", "p_crm", "LÖST");
  e("s_brevo", "b_marketing", "IN_BRANCHE"); e("s_brevo", "r_eu", "SITZT_IN");
  e("s_brevo", "t_saas", "NUTZT"); e("s_brevo", "t_automation", "NUTZT");

  return { nodes, edges };
}
