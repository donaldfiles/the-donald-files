#!/usr/bin/env bash
# Force every Cloudflare / wrangler call for The Donald Files onto the
# project-only login (donaldfiles@proton.me) at
# /home/box/.config-donaldfiles.
#
# The box default ~/.config/.wrangler is reserved for Robert's Dear Ziva
# account. Never deploy with the default login. Never run `wrangler logout`
# (that would revoke this token). Never print tokens.
set -euo pipefail

export XDG_CONFIG_HOME=/home/box/.config-donaldfiles
# Keep wrangler's cache off the default tree and writable from any cwd.
export XDG_CACHE_HOME="${DF_WRANGLER_CACHE:-/home/box/.config-donaldfiles/cache}"
export PATH="/home/box/.local/node22/bin:${PATH}"

mkdir -p "$XDG_CACHE_HOME"

CONFIG="$XDG_CONFIG_HOME/.wrangler/config/default.toml"
if [[ ! -f "$CONFIG" ]]; then
  echo "cf-guard: missing $CONFIG — Donald Files wrangler login not installed." >&2
  exit 1
fi

if command -v wrangler >/dev/null 2>&1; then
  WRANGLER=(wrangler)
elif command -v npx >/dev/null 2>&1; then
  WRANGLER=(npx --yes wrangler)
else
  echo "cf-guard: wrangler is not on PATH and npx is not available." >&2
  exit 1
fi

# whoami, then abort unless this is the Donald Files account.
# Do not run wrangler logout, even if whoami fails.
whoami_out="$("${WRANGLER[@]}" whoami 2>&1)" || true
if ! printf '%s\n' "$whoami_out" | grep -q 'donaldfiles@proton.me'; then
  echo "cf-guard: abort: wrangler is not logged in as donaldfiles@proton.me." >&2
  echo "cf-guard: XDG_CONFIG_HOME=$XDG_CONFIG_HOME" >&2
  echo "$whoami_out" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  printf '%s\n' "$whoami_out"
  exit 0
fi

exec "$@"
