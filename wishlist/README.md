# Wishlist app

MVP statická aplikace pro zobrazení očekávaných dárků a jednoduché rezervace.

- `index.html` — hlavní stránka.
- `css/styles.css` — styly.
- `js/app.js` — klientská logika (načítá `data/items.json`).
- `data/items.json` — seznam položek.

Jak to funguje:

Jak to funguje:
- Aplikace načte `data/items.json` a zobrazí položky.
- Lokální rezervace ukládá jméno do `localStorage` (viditelná jen v tom prohlížeči).
- Pro skutečnou rezervaci může uživatel kliknout na "Požádat přes GitHub", což otevře předvyplněné issue v repozitáři, které můžete zpracovat ručně.

Další kroky:

Další kroky:
- Přidat serverless backend (Firebase/Supabase) pro sdílené rezervace.
- Nebo přijímat rezervace automaticky přes GitHub API (vyžaduje token a backend nebo client OAuth).

Supabase integrace (volitelně):
1. Vytvořte projekt na https://app.supabase.com.
2. V SQL Editoru spusťte tento příkaz pro vytvoření tabulky:

```sql
create table reservations (
	id bigserial primary key,
	item_id text not null unique,
	name text not null,
	created_at timestamptz default now()
);
```

3. V Settings → API získejte projekt `url` a `anon key` a vložte je do `wishlist/data/supabase-config.json` místo placeholderů.
4. Pro demo můžete dočasně povolit veřejné SELECT/INSERT/DELETE, ale pro produkci nastavte RLS a bezpečnostní pravidla.

Po vložení konfigurace se klient automaticky připojí k Supabase a rezervace budou sdílené mezi uživateli.

Poznámka: klientská implementace používá `anon key` ve veřejném klientu. Pokud chcete bezpečnější řešení, doporučuji nasadit malý server nebo serverless funkci, která bude provádět transakce a skrýt privátní klíče.
