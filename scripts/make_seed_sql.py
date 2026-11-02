"""Maakt snowflake/seed.sql uit src/data/prestatie.json (eerste vulling van de tabellen)."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
data = json.loads((root / "src/data/prestatie.json").read_text(encoding="utf-8"))


def q(v):
    return "'" + str(v or "").replace("'", "''") + "'"


kpi_cols = ["kpi", "datum", "norm", "actueel", "afwijking", "impact", "locatie",
            "prioriteit", "escalatie", "categorie", "verbeteractie"]
out = ["-- Gegenereerd door scripts/make_seed_sql.py. Draai na schema.sql.",
       "TRUNCATE TABLE KPI_AFWIJKINGEN;", "TRUNCATE TABLE ACTIES;", "TRUNCATE TABLE LOPENDE_PDCA;"]
for w in data["weeks"]:
    for s in w["sections"]:
        for i, r in enumerate(s["rows"]):
            vals = ", ".join([q(w["week"]), q(s["naam"]), str(i)] + [q(r.get(c)) for c in kpi_cols])
            out.append(f"INSERT INTO KPI_AFWIJKINGEN (WEEK, SECTIE, RIJ, {', '.join(c.upper() for c in kpi_cols)}) VALUES ({vals});")
    for table, key in (("ACTIES", "acties"), ("LOPENDE_PDCA", "pdca")):
        for i, r in enumerate(w[key]):
            vals = ", ".join([q(w["week"]), str(i), q(r["datum"]), q(r["deadline"]), q(r["eigenaar"]), q(r["omschrijving"])])
            out.append(f"INSERT INTO {table} (WEEK, RIJ, DATUM, DEADLINE, EIGENAAR, OMSCHRIJVING) VALUES ({vals});")

(root / "snowflake/seed.sql").write_text("\n".join(out) + "\n", encoding="utf-8")
print("snowflake/seed.sql geschreven,", len(out), "regels")
