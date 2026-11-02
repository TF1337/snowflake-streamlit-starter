import { EIGENAAR_OPTIES, KPI_COLUMNS, priorityTone, type KpiRow, type SimpleRow, type Week } from "@/lib/prestatie";
import { cn } from "@/lib/utils";

const toneClass = {
  rood: "bg-status-rood/25",
  oranje: "bg-status-oranje/30",
  groen: "bg-status-groen/25",
};

function Cell({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <textarea
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("sheet-cell field-sizing-content", className)}
    />
  );
}

function OwnerCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      list="eigenaar-opties"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="sheet-cell w-full"
      placeholder="—"
    />
  );
}

function SimpleTable({ title, header, rows, onChange, onAdd }: {
  title: string; header: string; rows: SimpleRow[];
  onChange: (i: number, k: keyof SimpleRow, v: string) => void; onAdd: () => void;
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr><th colSpan={3} className="bg-primary px-3 py-2 text-left font-bold text-primary-foreground">{title}</th></tr>
        <tr className="bg-muted font-bold text-primary">
          <th className="w-36 border px-2 py-1 text-left">Datum</th>
          <th className="w-36 border px-2 py-1 text-left">Deadline datum</th>
          <th className="w-32 border px-2 py-1 text-left">Eigenaar</th>
          <th className="border px-2 py-1 text-left">{header}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="border p-0 align-top"><Cell value={r.datum} onChange={(v) => onChange(i, "datum", v)} /></td>
            <td className="border p-0 align-top"><Cell value={r.deadline} onChange={(v) => onChange(i, "deadline", v)} /></td>
            <td className="border p-0 align-top"><OwnerCell value={r.eigenaar} onChange={(v) => onChange(i, "eigenaar", v)} /></td>
            <td className="border p-0 align-top"><Cell value={r.omschrijving} onChange={(v) => onChange(i, "omschrijving", v)} /></td>
          </tr>
        ))}
        <tr><td colSpan={4} className="border p-0">
          <button onClick={onAdd} className="w-full px-2 py-1 text-left text-xs text-muted-foreground hover:bg-accent">+ rij toevoegen</button>
        </td></tr>
      </tbody>
      <datalist id="eigenaar-opties">
        {EIGENAAR_OPTIES.map((n) => <option key={n} value={n} />)}
      </datalist>
    </table>
  );
}

export function WeekSheet({ week, onChange }: { week: Week; onChange: (w: Week) => void }) {
  const setKpi = (s: number, r: number, k: keyof KpiRow, v: string) => {
    const sections = week.sections.map((sec, si) => si !== s ? sec : {
      ...sec, rows: sec.rows.map((row, ri) => ri !== r ? row : { ...row, [k]: v }),
    });
    onChange({ ...week, sections });
  };
  const addKpi = (s: number) => {
    const empty = Object.fromEntries(KPI_COLUMNS.map((c) => [c.key, ""])) as KpiRow;
    onChange({ ...week, sections: week.sections.map((sec, si) => si !== s ? sec : { ...sec, rows: [...sec.rows, empty] }) });
  };
  const setSimple = (list: "acties" | "pdca") => (i: number, k: keyof SimpleRow, v: string) =>
    onChange({ ...week, [list]: week[list].map((r, ri) => ri !== i ? r : { ...r, [k]: v }) });
  const addSimple = (list: "acties" | "pdca") => () =>
    onChange({ ...week, [list]: [...week[list], { datum: "", deadline: "", eigenaar: "", omschrijving: "" }] });

  return (
    <div className="space-y-6 bg-card p-4 shadow-sm">
      <div className="overflow-x-auto">
        <table className="border-collapse text-sm" style={{ minWidth: "100%" }}>
          <thead>
            <tr><th colSpan={KPI_COLUMNS.length} className="bg-primary px-3 py-3 text-center text-lg font-bold tracking-wide text-primary-foreground">
              KPI-AFWIJKINGEN &amp; ACTIEOPVOLGING — {week.week}
            </th></tr>
            <tr>
              <th colSpan={4} className="border px-3 py-1 text-left font-semibold italic text-muted-foreground">Alleen met afwijking noteren</th>
              <th colSpan={KPI_COLUMNS.length - 4} className="border px-3 py-1 text-left text-xs text-muted-foreground">Plaats je cursor op een blauw hoofdonderwerp en zie je de uitleg</th>
            </tr>
            <tr className="bg-secondary text-secondary-foreground">
              {KPI_COLUMNS.map((c) => (
                <th key={c.key} title={c.tip} style={{ minWidth: c.width }}
                  className={cn("border px-2 py-2 text-left align-bottom font-bold", c.tip && "cursor-help underline decoration-dotted")}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {week.sections.map((sec, si) => [
              ...sec.rows.map((row, ri) => {
                const tone = priorityTone(row.prioriteit);
                return (
                  <tr key={`${si}-${ri}`}>
                    {KPI_COLUMNS.map((c) => (
                      <td key={c.key} className={cn("border p-0 align-top", c.key === "prioriteit" && tone && toneClass[tone])}>
                        {ri === 0 && c.key === "kpi" ? (
                          <div className="px-2 py-1 font-bold text-primary">{sec.naam}</div>
                        ) : (
                          <Cell value={row[c.key]} onChange={(v) => setKpi(si, ri, c.key, v)} />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              }),
              <tr key={`${si}-add`}><td colSpan={KPI_COLUMNS.length} className="border p-0">
                <button onClick={() => addKpi(si)} className="px-2 py-0.5 text-xs text-muted-foreground hover:text-primary">+ rij bij {sec.naam}</button>
              </td></tr>,
            ])}
          </tbody>
        </table>
      </div>
      <SimpleTable title="Acties" header="Omschrijving" rows={week.acties}
        onChange={setSimple("acties")} onAdd={addSimple("acties")} />
      <SimpleTable title="Lopende PDCA's en/of 6S werkplekoptimalisaties"
        header="Korte omschrijving status van de lopende PDCA's / 6S optimalisaties | Heb je hulp nodig? | Haal je de deadline?"
        rows={week.pdca} onChange={setSimple("pdca")} onAdd={addSimple("pdca")} />
    </div>
  );
}
