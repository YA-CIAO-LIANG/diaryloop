#!/usr/bin/env bash
# Sets secrets on Vercel (Production) and, optionally, GitHub Actions,
# without them ever appearing on screen, in shell history, in a file, or
# in the conversation (CLAUDE.md, D14). Run it yourself:
#
#   ! bash scripts/set-secret.sh AZURE_OPENAI_API_KEY AZURE_SPEECH_KEY
#   ! bash scripts/set-secret.sh BACKUP_PASSPHRASE --github
#   ! bash scripts/set-secret.sh DIARY_ENCRYPTION_KEY --generate
#
# Each NAME is asked for in turn (input hidden). Options apply to all:
#   --github       also set the GitHub Actions secret
#   --github-only  only the GitHub Actions secret
#   --generate     make a random 32-byte key (base64) instead of asking
set -euo pipefail

names=()
to_vercel=true
to_github=false
generate=false
for arg in "$@"; do
  case "$arg" in
    --github) to_github=true ;;
    --github-only) to_github=true; to_vercel=false ;;
    --generate) generate=true ;;
    -*) echo "Unknown option: $arg" >&2; exit 1 ;;
    *)
      if [[ ! "$arg" =~ ^[A-Z][A-Z0-9_]*$ ]]; then
        echo "Not a variable name: $arg" >&2; exit 1
      fi
      names+=("$arg") ;;
  esac
done
if [[ ${#names[@]} -eq 0 ]]; then
  echo "Usage: bash scripts/set-secret.sh NAME... [--github|--github-only] [--generate]" >&2
  exit 1
fi

for name in "${names[@]}"; do
  if $generate; then
    value="$(openssl rand -base64 32)"
  else
    printf '%s (input hidden, then Enter; empty skips): ' "$name" >&2
    IFS= read -rs value
    echo >&2
  fi
  if [[ -z "$value" ]]; then
    echo "  skipped $name" >&2
    continue
  fi
  if $to_vercel; then
    # Replace any old value; the value goes in on stdin, never as an argument.
    vercel env rm "$name" production --yes >/dev/null 2>&1 || true
    printf '%s' "$value" | vercel env add "$name" production >/dev/null
    echo "  ✓ Vercel (Production): $name" >&2
  fi
  if $to_github; then
    printf '%s' "$value" | gh secret set "$name" --repo YA-CIAO-LIANG/diaryloop >/dev/null
    echo "  ✓ GitHub Actions: $name" >&2
  fi
  unset value
done
