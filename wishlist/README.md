# Wishlist app

MVP statická aplikace pro zobrazení očekávaných dárků a jednoduché připsání jména u položky.

- `index.html` — hlavní stránka.
- `css/styles.css` — styly.
- `js/app.js` — klientská logika (načítá `data/items.json`).
- `data/items.json` — seznam položek.

Jak to funguje:
- Aplikace načte `data/items.json` a zobrazí položky.
- U každé položky je políčko pro zadání jména. Po uložení se jméno přidá k té položce a uloží do `localStorage`.
- Tento prototyp je jednoduchý: data jsou sdílena pouze v tom samém prohlížeči (localStorage). Pokud chcete, aby zápisy byly viditelné okamžitě všem účastníkům, je potřeba nasadit sdílené úložiště (např. Supabase nebo Firebase).

Volby pro rozšíření (není nutné):
- Nasadit sdílené úložiště (Supabase/Firebase) — po základní konfiguraci budou zápisy sdílené mezi všemi uživateli.
- Přidat jednoduchý admin formulář pro přidávání/mazání položek nebo upravovat `data/items.json` v repozitáři.

Poznámka:
- Tento projekt je navržen jako co nejjednodušší řešení — lidé si pouze přepíšou své jméno u daného dárku bez nutnosti registrace. Pokud budeš chtít, nasadím sdílené úložiště později.
