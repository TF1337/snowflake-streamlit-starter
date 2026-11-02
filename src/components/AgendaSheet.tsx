const agenda = [
  ["1. Veiligheid", "10 min", "Incidenten • Near Misses • Veiligheidsmeldingen"],
  ["2. Kwaliteit", "10 min", "SLA-afspraken • Klachten • Kwaliteitsafwijkingen"],
  ["3. Productiviteit", "10 min", "KPI-prestaties • Output • Doorlooptijd"],
  ["4. Personeel", "10 min", "Ziekteverzuim • Medewerkertevredenheid • Bezetting"],
  ["5. MTO Mededelingen", "10 min", "Mededelingen"],
  ["6. Terugkoppeling actielijst", "10 min", "Open • Afgeronde • Nieuwe acties"],
];
const spelregels = [
  ["1. Feiten, geen mening", "Norm - Actueel resultaat - Afwijking"],
  ["2. Elke afwijking heeft een oorzaak", "Afwijking - Vermoedelijke oorzaak - Effect op de operatie"],
  ["3. Elke afwijking bepalen welke categorie", "Just Do It - PDCA - 6S - Change"],
  ["4. Stuur op beïnvloedbare oorzaken", "Focus op wat het team zelf kan beïnvloeden"],
  ["5. Kort en oplossingsgericht", "Groen/rood? - Afwijking? - Oorzaak? - Actie? - Hersteldatum?"],
  ["6. Acties worden opgevolgd", "Gereed - Op planning - Achterstand - Escalatie nodig"],
  ["7. Escaleer wanneer nodig", "Benoem direct - Vraag hulp - Leg besluit vast"],
  ["8. Vier successen", "Doelen - Verbeteringen - Afgeronde acties - Teamsuccessen"],
];

function Bar({ children }: { children: React.ReactNode }) {
  return <div className="bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary-foreground">{children}</div>;
}

export function AgendaSheet() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 bg-card p-6 shadow-sm">
      <h1 className="bg-primary px-4 py-5 text-center text-2xl font-bold tracking-wide text-primary-foreground">
        PRESTATIE VERANTWOORDEN &amp; STUREN
      </h1>
      <div>
        <div className="bg-secondary px-4 py-2 font-bold text-secondary-foreground">
          Agenda | 60 minuten | Benoem alleen de afwijkingen
        </div>
        {agenda.map(([a, t, d]) => (
          <div key={a} className="grid grid-cols-[1fr_6rem_2fr] border-b text-sm">
            <div className="px-4 py-2 font-semibold text-primary">{a}</div>
            <div className="px-4 py-2 text-muted-foreground">{t}</div>
            <div className="px-4 py-2">{d}</div>
          </div>
        ))}
      </div>
      <div>
        <Bar>Doel van de vergadering</Bar>
        <p className="border px-4 py-3 text-sm">
          Afwijkingen tijdig herkennen en effectieve verbeteracties inzetten.<br />
          Niet verklaren waarom resultaten niet zijn gehaald, maar gericht sturen op herstel en verbetering.
        </p>
      </div>
      <div>
        <Bar>Spelregels voor sturen op afwijkingen</Bar>
        {spelregels.map(([a, b]) => (
          <div key={a} className="grid grid-cols-2 border-b text-sm">
            <div className="px-4 py-2 font-semibold text-primary">{a}</div>
            <div className="px-4 py-2">{b}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Bar>Voorbereiding</Bar>
          <ul className="space-y-1 border px-4 py-3 text-sm">
            {["Kom op tijd", "Kom voorbereid", "Ken je KPI’s", "Actuele cijfers", "Status acties bijgewerkt"].map((x) => <li key={x}>✓ {x}</li>)}
          </ul>
        </div>
        <div>
          <Bar>Tijdens de vergadering</Bar>
          <ul className="space-y-1 border px-4 py-3 text-sm">
            {["Start/eindig op tijd", "Data als basis", "Oplossingsgericht", "Escalaties direct"].map((x) => <li key={x}>✓ {x}</li>)}
          </ul>
        </div>
      </div>
      <div>
        <Bar>Gouden regel</Bar>
        <p className="border px-4 py-3 text-center text-sm font-semibold">
          Geen rood zonder oorzaak • geen oorzaak zonder actie • geen actie zonder eigenaar • geen eigenaar zonder deadline
        </p>
      </div>
    </div>
  );
}
