# Webová vizitka — ukázka

Otevřete `index.html` v prohlížeči pro zobrazení jednoduché vizitky.

Rychlý návod (macOS / Linux):

```bash
# z pracovního adresáře
open index.html
```

(Nebo otevřete soubor dvojklikem ve správci souborů.)

Soubory:
- `index.html` — hlavní stránka
- `css/styles.css` — styly
- `js/script.js` — malá interakce pro kopírování kontaktů

Obsah je fiktivní; pokud chcete vlastní texty, pošlete je a já je vložím.

Funkce navíc:

- Stáhnout vCard: klikněte na tlačítko "Stáhnout vCard" v panelu vlevo — vygeneruje se soubor `.vcf` se základními kontaktními údaji.
- Kopírování kontaktů: u telefonu a e‑mailu klikněte na text pro zkopírování do schránky.
- Tisk: použijte `Cmd+P` (macOS) nebo `Ctrl+P` (Windows/Linux) pro tisk stránky; v tisku jsou skrýty tlačítek a optimalizace pro čistý výstup.

Spuštění přes lokální server (volitelné, pro lepší chování some prohlížečů):

```bash
# z pracovního adresáře
python3 -m http.server 8000
# a otevřete http://localhost:8000
```

Úpravy kontaktů:

- Kontaktní údaje najdete v `index.html` nebo v JSON bloku `script#profile-data` — úprava tam se promítne do vCard.

Pokud chcete, upravím barvy, texty nebo přidám vlastní logo — napište, co chcete změnit.

Nasazení na web
----------------

Možnosti rychlého nasazení:

- GitHub Pages (automatické):

	1. Vytvořte nový repozitář na GitHubu.
	2. Přidejte remote a pushněte změny:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin git@github.com:<your-username>/<your-repo>.git
git push -u origin main
```

	Po pushi se spustí workflow a stránka bude publikovaná přes GitHub Pages (chvíli to může trvat).

- Netlify (drag & drop nebo z Git):

	- Drag & drop: přetáhněte obsah složky do Netlify Drop (https://app.netlify.com/drop).
	- Z Git: připojte repozitář v Netlify UI a nastavte build dir na `/`.

- Vercel: připojte repozitář ve Vercel UI a deploy proběhne automaticky.

Lokální server (volitelné):

```bash
python3 -m http.server 8000
# otevřete http://localhost:8000
```

Potřebujete, abych to nasadil já (vytvořil repozitář a pushnul)? Pošlete mi URL repozitáře nebo udělte přístup a já to nastavím.