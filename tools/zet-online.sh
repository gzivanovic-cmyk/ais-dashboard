#!/bin/zsh
# Zet het AIS-dashboard online op https://rapport.ais-groep.nl/dashboard/
# Kopieert de dashboardbestanden naar de map dashboard/ van de rapportsite-repo en pusht alleen die map.
# De websitecheck-bot publiceert in dezelfde repo (alleen in r/), dus eerst de nieuwste stand ophalen.
set -e
BRON=${0:A:h:h}
SITE=${RAPPORTSITE:-$HOME/Audo/websitecheck-rapport-ais}

git -C "$SITE" pull -q --rebase origin main
mkdir -p "$SITE/dashboard"
rsync -a --delete --exclude .DS_Store "$BRON/assets/" "$SITE/dashboard/assets/"
cp "$BRON/index.html" "$BRON/sw.js" "$BRON/manifest.json" "$SITE/dashboard/"

git -C "$SITE" add dashboard
if git -C "$SITE" diff --cached --quiet; then
  echo "Niets veranderd; het dashboard staat al zo online."
  exit 0
fi
git -C "$SITE" commit -q -m "${1:-AIS-dashboard bijgewerkt}"
git -C "$SITE" push -q origin HEAD:main
echo "Online: https://rapport.ais-groep.nl/dashboard/ (GitHub Pages heeft er ongeveer een minuut voor nodig)"
