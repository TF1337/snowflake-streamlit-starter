import raw from "@/data/prestatie.json";

export type KpiRow = {
  kpi: string;
  datum: string;
  norm: string;
  actueel: string;
  afwijking: string;
  impact: string;
  locatie: string;
  prioriteit: string;
  escalatie: string;
  categorie: string;
  verbeteractie: string;
};
export type Section = { naam: string; rows: KpiRow[] };
export type SimpleRow = { datum: string; deadline: string; omschrijving: string };
export type Week = { week: string; sections: Section[]; acties: SimpleRow[]; pdca: SimpleRow[] };

export const initialWeeks = (raw as { weeks: Week[] }).weeks;

export const KPI_COLUMNS: { key: keyof KpiRow; label: string; tip?: string; width: string }[] = [
  { key: "kpi", label: "KPI", width: "10rem" },
  { key: "datum", label: "Datum", width: "8rem" },
  { key: "norm", label: "Norm / doel", width: "6rem" },
  { key: "actueel", label: "Actueel", width: "6rem" },
  { key: "afwijking", label: "Afwijking & effect", width: "22rem",
    tip: "Afwijking = norm of doel minus het actuele resultaat. Het effect is het gevolg van de afwijking voor het proces, de klant, de medewerker of het resultaat." },
  { key: "impact", label: "Impact op het proces?", width: "16rem",
    tip: "De oorzaak vertelt waardoor iets misgaat. De impact vertelt wat daarvan de gevolgen zijn." },
  { key: "locatie", label: "Waar? Locatie", width: "9rem",
    tip: "Beschrijf kort waar de afwijking plaatsvindt. Welke locatie/gebied of afdeling." },
  { key: "prioriteit", label: "Prioriteit (Rood / oranje / groen)", width: "8rem",
    tip: "Bij rood betekent dat dit eventueel kan worden meegenomen voor het MTO. Dan kan Elvera dit verbeterinitiatief meenemen in haar prestatiebord." },
  { key: "escalatie", label: "Escalatie nodig J/N", width: "6rem",
    tip: "Escaleren is geen probleem doorschuiven, maar tijdig hulp, capaciteit of een besluit organiseren." },
  { key: "categorie", label: "Categorie verbetering", width: "9rem",
    tip: "Just do it • PDCA • 6S werkplekoptimalisatie • Naar de Change afdeling • Vooronderzoek" },
  { key: "verbeteractie", label: "Verbeteractie (Wat ga je hieraan doen? Korte uitleg voor actie of meer tijd voor onderzoek/PDCA)", width: "24rem" },
];

export function priorityTone(v: string): "rood" | "oranje" | "groen" | null {
  const s = v.trim().toLowerCase();
  if (s.startsWith("rood")) return "rood";
  if (s.startsWith("oranje")) return "oranje";
  if (s.startsWith("groen")) return "groen";
  return null;
}
