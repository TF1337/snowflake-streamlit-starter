# Prestatiebord in Snowflake

Volgorde:

1. Open een worksheet in je database/schema en draai `snowflake/schema.sql`.
2. Draai `snowflake/seed.sql` (eenmalig: zet de Excel-gegevens in de tabellen).
   Let op: opnieuw draaien wist wat er in Snowflake is aangepast.
3. Maak een Streamlit-app aan (vanuit de Git-repository/workspace) met
   `streamlit/streamlit_app.py` als hoofdbestand, in hetzelfde database/schema.
4. Pas gegevens aan en klik op **Opslaan**. Alles staat dan in de tabellen en blijft bewaard.

Nieuwe Excel-versie: `python scripts/extract_excel.py` en daarna
`python scripts/make_seed_sql.py` maken een nieuwe `seed.sql`.
