# AIS Dashboard (rapport.ais-groep.nl/dashboard)

Gorans eigen dashboard voor AIS, alleen voor hem. In AIS-huisstijl, zonder GO 4IT. Het is een web-app: op de iPhone zet je hem op het beginscherm.

## Onderdelen
- **A. Website-checks**: alleen AIS-aanvragen. Zelfde werking als het overzicht van de websitechecks:
  - lijst met details en het rapport (PDF);
  - de klantpagina op rapport.ais-groep.nl;
  - "Open in Mail" met Gorans AIS-handtekening;
  - offline halen, opnieuw checken, en verwijderen door te vegen.
- **B. Per maand**: het aantal website-checks per maand (laatste 12 maanden), met een tabelweergave. Gewone websiteaanvragen gaan niet naar de bot en tellen nog niet mee.
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
