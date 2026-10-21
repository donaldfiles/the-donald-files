#!/bin/bash
# render.sh out.png "kicker" "file" "stamp" "hed with *punch*" ["dek"]
enc(){ python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$1"; }
U="file://$PWD/template.html?kicker=$(enc "$2")&file=$(enc "$3")&stamp=$(enc "$4")&hed=$(enc "$5")&dek=$(enc "$6")"
timeout 30 google-chrome --headless=new --no-sandbox --hide-scrollbars --window-size=1200,630 --screenshot="$1" "$U" 2>/dev/null
