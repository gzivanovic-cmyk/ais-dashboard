// Testgegevens voor het AIS-dashboard, gemaakt uit echte lokale website-checks (~/Audo/ais-groep-site/demo-uit).
// Zelfde formaat en versleuteling als de echte gegevens van de bot (sync.js): lijst.enc = {bijgewerkt, checks, gewist},
// <id>.enc = {id, samenvatting, oordeel, pdf}; AES-256-GCM met een sleutel uit het wachtwoord (PBKDF2-SHA256, 310000 rondes).
// Alleen voor lokaal testen: klantlinks wijzen naar de lokale kopie van rapport.ais-groep.nl (localhost:8812).
//   node tools/testdata.mjs [bronmap] [uitmap]      wachtwoord: TESTWACHTWOORD (standaard "proef-ais")
import { webcrypto as crypto } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const BRON = process.argv[2] || path.join(os.homedir(), 'Audo/ais-groep-site/demo-uit');
const UIT = process.argv[3] || new URL('../data-test/', import.meta.url).pathname;
const PW = process.env.TESTWACHTWOORD || 'proef-ais';
const ITER = 310000;
const b64 = (u) => Buffer.from(u).toString('base64');

async function versleutel(obj) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const basis = await crypto.subtle.importKey('raw', new TextEncoder().encode(PW), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, basis, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(obj)));
  return { salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)), iter: ITER };
}

const lokaal = (s) => (s || '').replace('https://rapport.ais-groep.nl', 'http://localhost:8812');
fs.rmSync(UIT, { recursive: true, force: true });
fs.mkdirSync(UIT, { recursive: true });
const checks = [];
for (const map of fs.readdirSync(BRON).sort()) {
  const pad = path.join(BRON, map, 'resultaat.json');
  if (!fs.existsSync(pad)) continue;
  const r = JSON.parse(fs.readFileSync(pad, 'utf8'));
  const s = r.samenvatting;
  if (!s || s.bron !== 'ais') continue;   // alleen AIS
  s.klantlink = lokaal(s.klantlink);
  if (s.klantmail) s.klantmail.tekst = lokaal(s.klantmail.tekst);
  s.meldingen = ((r.beoordeling || {}).meldingen || []).map((m) => (typeof m === 'string' ? m : m.tekst || '')).filter(Boolean);
  const pdf = path.join(BRON, map, 'rapport.pdf');
  const item = { id: s.id, samenvatting: s, oordeel: r.beoordeling || {}, pdf: fs.existsSync(pdf) ? b64(fs.readFileSync(pdf)) : '' };
  fs.writeFileSync(path.join(UIT, s.id + '.enc'), JSON.stringify(await versleutel(item)));
  const { conceptmail, klantmail, ...kort } = s;   // de lijst zonder de lange mailteksten
  checks.push(kort);
}
checks.sort((a, b) => (a.datum < b.datum ? 1 : -1));
fs.writeFileSync(path.join(UIT, 'lijst.enc'), JSON.stringify(await versleutel({ bijgewerkt: new Date().toISOString(), checks, gewist: [], test: true })));
console.log(`${checks.length} AIS-checks versleuteld in ${UIT} (testwachtwoord: ${PW === 'proef-ais' ? 'proef-ais' : 'eigen'})`);
