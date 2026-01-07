# Wishlist app

MVP statická aplikace pro zobrazení očekávaných dárků a jednoduché rezervace.

- `index.html` — hlavní stránka.
- `css/styles.css` — styly.
- `js/app.js` — klientská logika (načítá `data/items.json`).
- `data/items.json` — seznam položek.

Jak to funguje:
- Aplikace načte `data/items.json` a zobrazí položky.
- Lokální rezervace ukládá jméno do `localStorage` (viditelná jen v tom prohlížeči).
- Pro skutečnou rezervaci může uživatel kliknout na "Požádat přes GitHub", což otevře předvyplněné issue v repozitáři, které můžete zpracovat ručně.

Další kroky:
- Přidat serverless backend (Firebase/Supabase) pro sdílené rezervace.
- Nebo přijímat rezervace automaticky přes GitHub API (vyžaduje token a backend nebo client OAuth).
