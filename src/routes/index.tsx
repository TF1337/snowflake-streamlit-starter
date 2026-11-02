import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AgendaSheet } from "@/components/AgendaSheet";
import { WeekSheet } from "@/components/WeekSheet";
import { initialWeeks, type Week } from "@/lib/prestatie";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prestatie Verantwoorden & Sturen — OFM LDC 2026" },
      { name: "description", content: "Weekoverzicht van KPI-afwijkingen, acties en lopende PDCA's voor OFM LDC." },
      { property: "og:title", content: "Prestatie Verantwoorden & Sturen — OFM LDC 2026" },
      { property: "og:description", content: "Weekoverzicht van KPI-afwijkingen, acties en lopende PDCA's." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [weeks, setWeeks] = useState<Week[]>(initialWeeks);
  const [tab, setTab] = useState<string>(initialWeeks[initialWeeks.length - 1]?.week ?? "Agenda");
  const current = weeks.find((w) => w.week === tab);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ weeks }, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "prestatie.json";
    a.click();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-auto p-4">
        {current ? (
          <WeekSheet week={current} onChange={(w) => setWeeks((ws) => ws.map((x) => (x.week === w.week ? w : x)))} />
        ) : (
          <AgendaSheet />
        )}
      </main>
      <nav className="sticky bottom-0 flex items-center gap-1 overflow-x-auto border-t bg-muted px-2 py-1">
        {["Agenda", ...weeks.map((w) => w.week)].map((name) => (
          <button key={name} onClick={() => setTab(name)}
            className={cn("whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium",
              tab === name ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:bg-card/60")}>
            {name}
          </button>
        ))}
        <button onClick={exportJson} className="ml-auto whitespace-nowrap rounded-sm bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Exporteer data
        </button>
      </nav>
    </div>
  );
}
