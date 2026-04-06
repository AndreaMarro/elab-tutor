# Setup Mac Mini M4 16GB — Reviewer Locale + RAG

## 1. Installa Ollama (2 min)

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## 2. Scarica modello (5 min)

```bash
# Qwen2.5 7B — ottimo per review codice, entra in 16GB
ollama pull qwen2.5:7b-instruct
```

## 3. Crea ELAB Reviewer (2 min)

```bash
cat > /tmp/Modelfile-elab << 'EOF'
FROM qwen2.5:7b-instruct

SYSTEM """Sei il REVIEWER del progetto ELAB Tutor.

ELAB e' un tutor educativo per elettronica e Arduino per bambini 8-14 anni.

STACK: React 19 + Vite 7 + Vitest + Supabase + PWA
PALETTE: Navy #1E4D8C, Lime #4A7A25, Orange #E8941C, Red #E54B3D
FONT: Oswald (titoli), Open Sans (body), Fira Code (codice)
PIN MAP: D0-D7=PORTD, D8-D13=PORTB, A0-A5=PORTC (ATmega328p)

REGOLE WCAG AA:
- Contrasto testo: 4.5:1 minimo
- Touch target: 44x44px minimo
- Font minimo: 13px testo, 10px label
- Focus ring visibile su ogni elemento interattivo

REGOLE CODICE:
- MAI emoji come icone (usare ElabIcons.jsx)
- MAI dati finti o demo
- MAI inline styles (usare CSS Modules)
- MAI aggiungere dipendenze npm senza approvazione

IL TUO LAVORO:
Revisiona codice, trova bug, verifica WCAG, suggerisci miglioramenti.
Sii SEVERO ma COSTRUTTIVO. Dai sempre suggerimenti concreti.
Se trovi un problema, specifica file e riga."""
EOF

ollama create elab-reviewer -f /tmp/Modelfile-elab
```

## 4. Test il reviewer

```bash
echo "Revisiona questo CSS: .button { color: #999; font-size: 11px; width: 30px; height: 30px; }" | ollama run elab-reviewer
```

Deve trovare: contrasto #999 sotto 4.5:1, font sotto 13px, touch target sotto 44px.

## 5. Script Reviewer Automatico

Salva come `automa/local-reviewer.sh`:

```bash
#!/bin/bash
# ELAB Local Reviewer — Gira sul Mac Mini
# Legge OUTBOX, revisiona i diff, scrive verdetto

ELAB_DIR="/path/to/elab-builder"  # MODIFICA QUESTO
REVIEW_DIR="$ELAB_DIR/automa/REVIEW"
mkdir -p "$REVIEW_DIR"

cd "$ELAB_DIR"

# Per ogni branch auto/* non ancora revisionato
for branch in $(git branch -r | grep 'origin/auto/' | sed 's|origin/||'); do
    REVIEW_FILE="$REVIEW_DIR/$(echo $branch | tr '/' '-').md"

    # Salta se gia' revisionato
    [ -f "$REVIEW_FILE" ] && continue

    # Prendi il diff
    DIFF=$(git diff main..origin/$branch -- '*.jsx' '*.js' '*.css' 2>/dev/null | head -500)

    if [ -z "$DIFF" ]; then continue; fi

    echo "Reviewing $branch..."

    # Manda al reviewer locale
    REVIEW=$(echo "Revisiona questo diff del progetto ELAB Tutor. Trova bug, violazioni WCAG, problemi di qualita':

$DIFF" | ollama run elab-reviewer 2>/dev/null)

    # Salva verdetto
    cat > "$REVIEW_FILE" << EOF
# Review: $branch
Data: $(date +%Y-%m-%d)
Reviewer: Qwen2.5-7B (locale)

## Verdetto
$REVIEW

## Azione Suggerita
- [ ] MERGE se nessun problema critico
- [ ] FIX se problemi trovati
- [ ] SKIP se irrilevante
EOF

    echo "Saved: $REVIEW_FILE"
done
```

## 6. Cron per review automatica (ogni 4h)

```bash
# Sul Mac Mini
(crontab -l 2>/dev/null; echo "0 */4 * * * /path/to/elab-builder/automa/local-reviewer.sh") | crontab -
```

## 7. RAG Semplice (opzionale, per query piu' intelligenti)

```bash
pip3 install chromadb sentence-transformers

# Script che indicizza automa/knowledge/ e CLAUDE.md
python3 << 'PYEOF'
import chromadb, os, glob

client = chromadb.PersistentClient(path="./automa/rag-db")
collection = client.get_or_create_collection("elab-knowledge")

# Indicizza tutti i .md in knowledge/
for f in glob.glob("automa/knowledge/*.md"):
    with open(f) as fh:
        text = fh.read()
    collection.upsert(
        documents=[text[:8000]],
        ids=[os.path.basename(f)]
    )

# Indicizza CLAUDE.md
with open("CLAUDE.md") as fh:
    collection.upsert(documents=[fh.read()[:8000]], ids=["CLAUDE.md"])

print(f"Indicizzati {collection.count()} documenti")
PYEOF
```

## Note

- Il Mac Mini NON ha bisogno di Claude Code installato (usa solo Ollama)
- Puo' stare sulla stessa rete del Mac principale
- Se condividi la cartella ELAB via SMB/NFS, il reviewer legge i file in tempo reale
- Il reviewer locale e' un SECONDO PARERE — non sostituisce Claude
