"""Converteert het PrestatieSturen Excel-bestand naar src/data/prestatie.json.
Gebruik: python3 scripts/extract_excel.py pad/naar/bestand.xlsx"""
import json, sys, datetime, re
from openpyxl import load_workbook

KPI_COLS = ["kpi","datum","norm","actueel","afwijking","impact","locatie","prioriteit","escalatie","categorie","verbeteractie"]
SECTIONS = ["Veiligheid","Kwaliteit","Productiviteit","Personeel"]
NAMES = ["Rakesh","Dylan","Joris","Jelle","Barry","Jesse"]

def split_owner(omschrijving):
    """Haal eigenaarsnamen uit de omschrijving en geef (omschrijving, eigenaar) terug."""
    o = omschrijving
    found = [n for n in NAMES if re.search(rf"\b{n}\b", o, re.I)]
    if not found:
        m = re.search(r"[~\-]\s*([A-Za-z]+)\s*$", o)
        if m:
            cands = [n for n in NAMES if n.lower().startswith(m.group(1).lower())]
            if len(cands) == 1:
                found = [cands[0]]
    if not found:
        return omschrijving, ""
    owner = " & ".join(found)
    for n in found:
        o = re.sub(rf"[~\-,&]?\s*\b{n}\b[,.]?\s*", " ", o, flags=re.I)
    o = o.replace("~", " ")
    o = re.sub(r"\s+", " ", o).strip(" -&,.")
    if o.lower() == "actie":
        o = ""
    return o, owner

def val(c):
    v = c.value
    if v is None: return ""
    if isinstance(v,(datetime.datetime,datetime.date)): return v.strftime("%Y-%m-%d")
    if isinstance(v,float) and "%" in (c.number_format or ""): return f"{round(v*100,1):g}%"
    if isinstance(v,float): return f"{round(v,3):g}"
    return str(v).strip()

wb = load_workbook(sys.argv[1])
weeks = []
for name in wb.sheetnames[1:]:
    ws = wb[name]
    a = {r: str(ws.cell(r,1).value or "").strip() for r in range(1, ws.max_row+1)}
    find = lambda s: next(r for r,v in a.items() if v.startswith(s))
    starts = [find(s) for s in SECTIONS]
    acties, pdca = find("Acties"), find("Lopende")
    bounds = starts + [acties]
    sections = []
    for i,s in enumerate(SECTIONS):
        rows = []
        for r in range(bounds[i], bounds[i+1]):
            row = {k: val(ws.cell(r,j+1)) for j,k in enumerate(KPI_COLS)}
            if r == bounds[i]: row["kpi"] = ""
            row["verbeteractie"] = row["verbeteractie"] or val(ws.cell(r,12))
            rows.append(row)
        sections.append({"naam": s, "rows": rows})
    def simple(start, end):
        return [{"datum": val(ws.cell(r,1)), "deadline": val(ws.cell(r,2)), "omschrijving": val(ws.cell(r,3))} for r in range(start, end)]
    weeks.append({"week": name, "sections": sections,
                  "acties": simple(acties+2, pdca), "pdca": simple(pdca+2, ws.max_row+1)})

json.dump({"weeks": weeks}, open("src/data/prestatie.json","w"), ensure_ascii=False, indent=1)
print(len(weeks), "weken")
