## Volgende stappen in Snowflake (je hoeft niets in Lovable te doen)

1. **Database kiezen**: zorg dat je een database + schema hebt (bijv. `PRESTATIE.PUBLIC`). Zo niet: maak een SQL file en draai `CREATE DATABASE PRESTATIE;`.
2. **Tabellen maken**: open links `snowflake` → `schema.sql`. Kies rechtsboven je database/schema en warehouse, en klik Run All.
3. **Gegevens vullen**: open `snowflake` → `seed.sql` en draai die één keer (niet opnieuw, dat wist je wijzigingen).
4. **App aanmaken**: klik op de Home-tab op **Streamlit App** (of links Projects → Streamlit → + Streamlit App). Kies dezelfde database/schema en warehouse. Plak de inhoud van `streamlit/streamlit_app.py` in de editor (of kies "from Git repository" en wijs `streamlit/streamlit_app.py` aan als hoofdbestand).
5. **Testen**: kies Week 41, wijzig één cel, klik Opslaan, vernieuw de pagina en controleer dat de wijziging er nog staat.

Krijg je een foutmelding, stuur me een screenshot, dan pas ik de app aan.
