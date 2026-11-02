"""Prestatiebord - Streamlit in Snowflake.

Leest en bewaart alle gegevens in de tabellen uit snowflake/schema.sql.
"""
import pandas as pd
import streamlit as st
from snowflake.snowpark.context import get_active_session

EIGENAAR_OPTIES = ["Rakesh", "Dylan", "Joris", "Jelle", "Barry", "Jesse"]
KPI_COLS = ["KPI", "DATUM", "NORM", "ACTUEEL", "AFWIJKING", "IMPACT", "LOCATIE",
            "PRIORITEIT", "ESCALATIE", "CATEGORIE", "VERBETERACTIE"]
SIMPLE_COLS = ["DATUM", "DEADLINE", "EIGENAAR", "OMSCHRIJVING"]

st.set_page_config(page_title="Prestatiebord", layout="wide")
session = get_active_session()


def load(sql, params=None):
    return session.sql(sql, params=params or []).to_pandas()


def weeks():
    df = load("SELECT DISTINCT WEEK FROM KPI_AFWIJKINGEN UNION SELECT DISTINCT WEEK FROM ACTIES")
    return sorted(df["WEEK"].tolist(), key=lambda w: int("".join(c for c in w if c.isdigit()) or 0))


def save(table, week, df, cols, extra_key=None):
    """Vervangt de rijen van deze week (en sectie) door de bewerkte tabel."""
    where = "WEEK = ?" + (" AND SECTIE = ?" if extra_key else "")
    params = [week] + ([extra_key] if extra_key else [])
    session.sql(f"DELETE FROM {table} WHERE {where}", params=params).collect()
    df = df.fillna("").reset_index(drop=True)
    for i, row in df.iterrows():
        if all(str(row[c]).strip() == "" for c in cols):
            continue
        key_cols = ["WEEK"] + (["SECTIE"] if extra_key else []) + ["RIJ"]
        key_vals = [week] + ([extra_key] if extra_key else []) + [i]
        all_cols = key_cols + cols
        ph = ", ".join("?" for _ in all_cols)
        session.sql(
            f"INSERT INTO {table} ({', '.join(all_cols)}) VALUES ({ph})",
            params=key_vals + [str(row[c]) for c in cols],
        ).collect()


st.title("Prestatiebord")
week_list = weeks()
if not week_list:
    st.warning("Nog geen gegevens. Draai eerst snowflake/schema.sql en snowflake/seed.sql.")
    st.stop()

week = st.selectbox("Week", week_list, index=len(week_list) - 1)

simple_config = {
    "EIGENAAR": st.column_config.SelectboxColumn("Eigenaar", options=EIGENAAR_OPTIES),
    "OMSCHRIJVING": st.column_config.TextColumn("Omschrijving", width="large"),
}

with st.form("week_form"):
    kpi = load(f"SELECT SECTIE, {', '.join(KPI_COLS)} FROM KPI_AFWIJKINGEN WHERE WEEK = ? ORDER BY SECTIE, RIJ", [week])
    edited_kpi = {}
    for sectie in kpi["SECTIE"].unique():
        st.subheader(sectie)
        edited_kpi[sectie] = st.data_editor(
            kpi[kpi["SECTIE"] == sectie][KPI_COLS].reset_index(drop=True),
            num_rows="dynamic", use_container_width=True, key=f"kpi_{sectie}",
        )

    st.subheader("Acties")
    acties = load(f"SELECT {', '.join(SIMPLE_COLS)} FROM ACTIES WHERE WEEK = ? ORDER BY RIJ", [week])
    edited_acties = st.data_editor(acties, num_rows="dynamic", use_container_width=True,
                                   column_config=simple_config, key="acties")

    st.subheader("Lopende PDCA's")
    pdca = load(f"SELECT {', '.join(SIMPLE_COLS)} FROM LOPENDE_PDCA WHERE WEEK = ? ORDER BY RIJ", [week])
    edited_pdca = st.data_editor(pdca, num_rows="dynamic", use_container_width=True,
                                 column_config=simple_config, key="pdca")

    if st.form_submit_button("Opslaan", type="primary"):
        for sectie, df in edited_kpi.items():
            save("KPI_AFWIJKINGEN", week, df, KPI_COLS, extra_key=sectie)
        save("ACTIES", week, edited_acties, SIMPLE_COLS)
        save("LOPENDE_PDCA", week, edited_pdca, SIMPLE_COLS)
        st.success(f"{week} is opgeslagen.")
