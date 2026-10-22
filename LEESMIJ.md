# AIS Dashboard (rapport.ais-groep.nl/dashboard)

Gorans eigen dashboard voor AIS, alleen voor hem. In AIS-huisstijl, zonder GO 4IT. Het is een web-app: op de iPhone zet je hem op het beginscherm.

## Onderdelen
- **A. Website-checks**: alleen AIS-aanvragen. Zelfde werking als het overzicht van de websitechecks:
  - lijst met details en het rapport (PDF);
  - de klantpagina op rapport.ais-groep.nl;
  - "Open in Mail" met Gorans AIS-handtekening;
  - offline halen, opnieuw checken, en verwijderen door te vegen.
- **B. Per maand**: het aantal website-checks per maand (laatste 12 maanden), met een tabelweergave. Gewone websiteaanvragen gaan niet naar de bot en tellen nog niet mee.
- **C. Nieuws** (`assets/nieuws.js` en `assets/nieuws.css`): berichten voor ais-groep.nl/nieuws schrijven, inplannen en beheren.
  - **Opslag:** de privé-repo `gzivanovic-cmyk/ais-nieuws`, één JSON-bestand per bericht plus beelden; zie de README daar.
  - **Koppelen:** per toestel één keer, met een fine-grained GitHub-token dat Goran zelf aanmaakt (alleen ais-nieuws, Contents: Read and write). Het token wordt versleuteld met het dashboardwachtwoord en bewaard in localStorage.
  - **Schrijven:** titel, webadres, samenvatting (180), "In het kort" (max. 3), rubriek, schrijver, omslagfoto met beschrijving (verkleind tot 1600 px), tekst in Markdown met knoppenbalk, en SEO-titel en -omschrijving.
  - **Hulp bij het schrijven:** een voorbeeld in de stijl van de site, een SEO-checklist met score (onder 70 vraagt hij of je het zeker weet, ook bij inplannen), een Google-voorbeeld en een deelafbeelding van 1200 × 630 (met foto of rustig).
  - **Status:** concept, ingepland, gepubliceerd of prullenbak. "Opslaan" verandert de status nooit. Terug naar concept of offline halen is een aparte knop met een bevestiging.
  - **Tijden:** altijd Nederlandse tijd (Europe/Amsterdam, met de juiste zomer- of wintertijd in de opgeslagen tijd).
  - **Vangnetten:**
    - een kladversie per toestel, die bij heropenen wordt aangeboden;
    - een conflictmelding als een bericht intussen op een ander toestel is gewijzigd;
    - een prullenbak, en de git-geschiedenis als versiebeheer;
    - een webadres dat verandert na publicatie wordt automatisch doorverwezen (`oudeSlugs`).
  - **Planning:** ingeplande berichten staan apart. De momenten links staan vast; de berichten sleep je erlangs (of met ↑/↓), en dan wisselen ze van moment. Op een telefoon sleep je aan de greep ⋮⋮.
  - **Achteraan in de planning:** een nieuw bericht kan in één keer een week na het laatste ingeplande bericht worden gezet, op dezelfde tijd. Is er een planning, dan is dat de standaardkeuze.
  - **Lokaal** (localhost) gebruikt het tabblad een testopslag in de browser, en er gaat niets naar GitHub. Er staan drie voorbeeldberichten in, met foto's uit `data-test/voorbeeld/` (gaat niet online).
  - **Op de site:** `ais-groep-site/concept/nieuws_bron.py` maakt van gepubliceerde berichten pagina's in de artikelstijl, plus kaartjes op /nieuws/, sitemap, BlogPosting-gegevens en het deelbeeld. Dezelfde Markdown-regels als het dashboard (getest: gelijke uitvoer).
- **Later mogelijk:** Search Console en Matomo. Search Console is op 22 okt 2026 op verzoek van Goran weer uit het dashboard gehaald ("voor nu").

## Gegevens en beveiliging
- **Bron:** de gegevens komen van de websitecheck-bot (sync.js). Ze staan in `https://gzivanovic-cmyk.github.io/websitecheck/data-ais/`:
  - `lijst.enc`;
  - per check een `<id>.enc`.
- **Versleuteling:** AES-256-GCM, met een sleutel die met PBKDF2-SHA256 (310000 rondes) uit het AIS-wachtwoord wordt afgeleid. Goran kiest dat wachtwoord zelf.
- **Meldingen:**
  - via `www.go4itstudio.com/websitecheck-push.php` met `app=ais`;
  - de sleutel is `HMAC(wachtwoord, "websitecheck-push")`;
  - dezelfde publieke VAPID-sleutel als het overzicht.
- **Acties:**
  - via `websitecheck-actie.php` met `app=ais` en een HMAC-handtekening uit het AIS-wachtwoord;
  - direct offline halen gaat via `websitecheck-intrek.php`.

## Lokaal testen
- **Testgegevens maken:** `node tools/testdata.mjs` maakt `data-test/` uit de echte lokale checks in `~/Audo/ais-groep-site/demo-uit`. Het testwachtwoord is `proef-ais`.
- **Starten:** start de server "ais-dashboard" uit `.claude/launch.json` en open `http://localhost:8816`.
- **Wat er lokaal anders is:** het dashboard leest `data-test/`. Meldingen en acties staan uit, want die checks kent de bot niet.

## Nog te doen voor livegang (pas na Gorans akkoord)
1. **Gegevens:** de bot-sessie maakt `data-ais/` aan; Goran kiest het AIS-wachtwoord.
2. **CORS:** de scripts op go4itstudio.com moeten `https://rapport.ais-groep.nl` toestaan (zijtak `ais-dashboard-koppeling` in de bot-sessie).

## Online zetten
- **Adres:** https://rapport.ais-groep.nl/dashboard/ — een map van de bestaande rapportsite, dus geen eigen DNS-regel nodig. dashboard.ais-groep.nl is al in gebruik door een AIS-webapp; daar niet aankomen.
- **Hoe:** `tools/zet-online.sh` kopieert `index.html`, `sw.js`, `manifest.json` en `assets/` naar `dashboard/` in `~/Audo/websitecheck-rapport-ais` en pusht alleen die map. De bot publiceert in dezelfde repo, maar alleen in `r/`.
- Deze repo (`ais-dashboard`) is de bron; GitHub Pages staat hier uit. `data-test/` gaat nooit mee online.
