#!/usr/bin/env bash
# Sets one secret on Vercel (Production) and, optionally, GitHub Actions,
# without it ever appearing on screen, in shell history, in a file, or in
# the conversation (CLAUDE.md). Run it yourself:
#
#   ! bash scripts/set-secret.sh AZURE_OPENAI_API_KEY          # Vercel only
#   ! bash scripts/set-secret.sh BACKUP_PASSPHRASE --github     # both
#   ! bash scripts/set-secret.sh DIARY_ENCRYPTION_KEY --generate
#
# --generate makes a random 32-byte key (base64) instead of asking.
# --github-only sets only the GitHub Actions secret.
set -euo pipefail

name="${1:-}"
if [[ ! "$name" =~ ^[A-Z][A-Z0-9_]*$ ]]; then
  echo "Usage: bash scripts/set-secret.sh NAME [--github|--github-only] [--generate]" >&2
  exit 1
fi
shift
to_vercel=true
to_github=false
generate=false
for flag in "$@"; do
  case "$flag" in
    --github) to_github=true ;;
    --github-only) to_github=true; to_vercel=false ;;
    --generate) generate=true ;;
    *) echo "Unknown option: $flag" >&2; exit 1 ;;
  esac
done

if $generate; then
  value="$(openssl rand -base64 32)"
else
  printf '%s (input hidden, then Enter): ' "$name" >&2
  IFS= read -rs value
  echo >&2
fi
if [[ -z "$value" ]]; then
  echo "Nothing entered; nothing changed." >&2
  exit 1
fi

if $to_vercel; then
  # Replace any old value; the value goes in on stdin, never as an argument.
  vercel env rm "$name" production --yes >/dev/null 2>&1 || true
  printf '%s' "$value" | vercel env add "$name" production >/dev/null
  echo "✓ Vercel (Production): $name set" >&2
fi
if $to_github; then
  printf '%s' "$value" | gh secret set "$name" --repo YA-CIAO-LIANG/diaryloop >/dev/null
  echo "✓ GitHub Actions: $name set" >&2
fi
unset value
