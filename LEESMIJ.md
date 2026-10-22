# AIS Dashboard (dashboard.ais-groep.nl)

Gorans eigen dashboard voor AIS, alleen voor hem. In AIS-huisstijl, zonder GO 4IT. Het is een web-app: op de iPhone zet je hem op het beginscherm.

## Onderdelen
- **A. Website-checks**: alleen AIS-aanvragen. Zelfde werking als het overzicht van de websitechecks:
  - lijst met details en het rapport (PDF);
  - de klantpagina op rapport.ais-groep.nl;
  - "Open in Mail" met Gorans AIS-handtekening;
  - offline halen, opnieuw checken, en verwijderen door te vegen.
- **B. Per maand**: het aantal website-checks per maand (laatste 12 maanden), met een tabelweergave. Gewone websiteaanvragen gaan niet naar de bot en tellen nog niet mee.
- **C. Search Console**: haalt de gegevens rechtstreeks bij Google op nadat Goran op "Koppel Google" klikt. Daarbij wordt nergens een sleutel opgeslagen. Hiervoor is een OAuth-client-ID nodig (`CONFIG.googleClientId`; de stappen staan in het tabblad).
- **Later mogelijk:** Matomo (bezoekers en formulieren van de nieuwe site).

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
2. **Search Console:**
   - Goran controleert de property voor ais-groep.nl;
   - hij maakt een OAuth-client-ID aan;
   - die client-ID komt in `CONFIG.googleClientId`.
3. **Hosting:** een eigen repo op GitHub Pages, bijvoorbeeld `ais-dashboard`, met een CNAME naar `dashboard.ais-groep.nl`. Goran zet de DNS-regel zelf bij 123-webhost. `data-test/` gaat niet mee online.
