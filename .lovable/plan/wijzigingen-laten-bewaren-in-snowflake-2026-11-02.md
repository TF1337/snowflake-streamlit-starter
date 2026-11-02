# Wijzigingen laten bewaren in Snowflake

## Kort antwoord
Nee, nu nog niet. De app bewaart wijzigingen op dit moment nergens: na vernieuwen zijn ze weg. Dat verandert niet vanzelf als je de code in een Snowflake-workspace zet. Bewaren werkt pas als de app de gegevens wegschrijft naar de Snowflake-tabellen (die staan al klaar in `snowflake/schema.sql`).

Let op: Snowflake draait Streamlit (Python), geen React. De React-app is het voorbeeld en de structuur; in Snowflake bouw je het scherm opnieuw in Streamlit.

## Wat ik toevoeg
1. **Streamlit-startversie** (`streamlit/streamlit_app.py`): tabbladen Agenda en Week 31–46, met bewerkbare tabellen (Acties met kolom Eigenaar en keuzelijst Rakesh, Dylan, Joris, Jelle, Barry, Jesse).
2. **Opslaan-knop**: schrijft wijzigingen weg naar de Snowflake-tabellen, en leest ze bij openen weer in. Zo blijft alles bewaard, ook voor collega's.
3. **Eerste vulling** (`snowflake/seed.sql`): zet de huidige Excel-gegevens in de tabellen.
4. **Korte uitleg** (`snowflake/README.md`): in welke volgorde je schema, vulling en app in Snowflake zet.

## Technische details
- Streamlit gebruikt `get_active_session()` (Snowpark) en `st.data_editor`; opslaan via `MERGE` op sleutel (week + rij-id).
- Schema krijgt per tabel een `ID` en `GEWIJZIGD_OP`.
- De React-app blijft zoals hij is.
