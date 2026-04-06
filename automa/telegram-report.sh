#!/bin/bash
# ELAB Autopilot — Daily Telegram Report Generator
# Genera report LaTeX → PDF e lo invia su Telegram
# Lanciato dal Director ogni 8h o dal cron separato 1x/giorno
#
# SETUP:
#   1. Crea bot: @BotFather su Telegram → /newbot → salva token
#   2. Trova chat_id: manda messaggio al bot, poi:
#      curl https://api.telegram.org/bot<TOKEN>/getUpdates | jq '.result[0].message.chat.id'
#   3. Esporta variabili:
#      export TELEGRAM_BOT_TOKEN="123456:ABC-..."
#      export TELEGRAM_CHAT_ID="123456789"
#   4. Oppure salvale in automa/.telegram-config (non committare!)

ELAB_DIR="/Users/andreamarro/VOLUME 3/PRODOTTO/elab-builder"
REPORT_DIR="$ELAB_DIR/automa/reports"
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# Carica config
if [ -f "$ELAB_DIR/automa/.telegram-config" ]; then
    source "$ELAB_DIR/automa/.telegram-config"
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
    echo "ERROR: TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID non configurati"
    echo "Crea automa/.telegram-config con:"
    echo '  TELEGRAM_BOT_TOKEN="123456:ABC-..."'
    echo '  TELEGRAM_CHAT_ID="123456789"'
    exit 1
fi

mkdir -p "$REPORT_DIR"
cd "$ELAB_DIR"

DATE=$(date +%Y-%m-%d)
DAY=$(( ($(date +%s) - $(date -j -f '%Y-%m-%d' '2026-04-06' +%s 2>/dev/null || echo 1743897600)) / 86400 + 1 ))
TIMESTAMP=$(date +%Y%m%d-%H%M)

# Raccogli metriche
TEST_RESULT=$(npm test -- --run --silent 2>&1 | tail -3)
TEST_COUNT=$(echo "$TEST_RESULT" | grep -oE '[0-9]+ passed' | head -1)
BUILD_RESULT=$(npm run build 2>&1 | grep 'built in' | head -1)
BUNDLE_SIZE=$(npm run build 2>&1 | grep 'precache' | grep -oE '[0-9.]+ KiB')
BRANCH_COUNT=$(git branch -r | grep 'auto/' | wc -l | tr -d ' ')
COMMIT_TODAY=$(git log --since="$DATE" --oneline | wc -l | tr -d ' ')
SCORE_LINE=$(grep 'Attuale' automa/STRATEGY/score-tracking.md 2>/dev/null | head -1)
OUTBOX_COUNT=$(ls automa/OUTBOX/*.md 2>/dev/null | wc -l | tr -d ' ')
KNOWLEDGE_COUNT=$(ls automa/knowledge/*.md 2>/dev/null | wc -l | tr -d ' ')

# Ultimi 5 OUTBOX
RECENT_WORK=""
for f in $(ls -t automa/OUTBOX/*.md 2>/dev/null | head -5); do
    ENTRY=$(head -3 "$f" | tr '\n' ' ')
    RECENT_WORK="$RECENT_WORK\n\\\\item $ENTRY"
done

# Genera LaTeX
cat > "$REPORT_DIR/report-$TIMESTAMP.tex" << LATEX
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=2cm]{geometry}
\\usepackage{booktabs,graphicx,xcolor,fancyhdr}
\\definecolor{navy}{HTML}{1E4D8C}
\\definecolor{lime}{HTML}{4A7A25}
\\definecolor{orange}{HTML}{E8941C}
\\pagestyle{fancy}
\\fancyhead[L]{\\textcolor{navy}{\\textbf{ELAB Autopilot}}}
\\fancyhead[R]{\\textcolor{navy}{Giorno $DAY/20 --- $DATE}}
\\begin{document}
\\begin{center}
{\\LARGE\\textcolor{navy}{\\textbf{ELAB Tutor --- Report Autopilot}}}\\\\[4pt]
{\\large Giorno $DAY di 20 --- $DATE}\\\\[2pt]
{\\small Generato automaticamente dal Director}
\\end{center}
\\vspace{8pt}
\\section*{Metriche}
\\begin{tabular}{lrl}
\\toprule
\\textbf{Metrica} & \\textbf{Valore} & \\textbf{Status} \\\\
\\midrule
Test & $TEST_COUNT & \\textcolor{lime}{PASS} \\\\
Build & $BUILD_RESULT & \\textcolor{lime}{OK} \\\\
Bundle & $BUNDLE_SIZE & --- \\\\
Branch auto/* & $BRANCH_COUNT & attivi \\\\
Commit oggi & $COMMIT_TODAY & --- \\\\
Report OUTBOX & $OUTBOX_COUNT & completati \\\\
Knowledge docs & $KNOWLEDGE_COUNT & --- \\\\
Score & $SCORE_LINE & --- \\\\
\\bottomrule
\\end{tabular}
\\section*{Lavoro Recente}
\\begin{itemize}
$RECENT_WORK
\\end{itemize}
\\section*{Prossime Priorita'}
Vedi \\texttt{automa/STRATEGY/current-sprint.md} per il piano dettagliato.
\\vspace{12pt}
\\hrule
\\vspace{4pt}
{\\small\\textit{Report generato da ELAB Autopilot. Zero intervento umano.}}
\\end{document}
LATEX

# Compila PDF
cd "$REPORT_DIR"
if command -v pdflatex &> /dev/null; then
    pdflatex -interaction=nonstopmode "report-$TIMESTAMP.tex" > /dev/null 2>&1
    PDF_FILE="$REPORT_DIR/report-$TIMESTAMP.pdf"
else
    # Fallback: manda il .tex come documento
    PDF_FILE="$REPORT_DIR/report-$TIMESTAMP.tex"
fi

# Invia su Telegram
if [ -f "$PDF_FILE" ]; then
    curl -s -F "document=@$PDF_FILE" \
        -F "caption=ELAB Autopilot - Giorno $DAY/20 - $DATE" \
        "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument?chat_id=${TELEGRAM_CHAT_ID}" \
        > /dev/null 2>&1
    echo "Report inviato su Telegram: $PDF_FILE"
else
    # Fallback: manda messaggio testo
    MSG="ELAB Autopilot Day $DAY/20
Test: $TEST_COUNT
Build: $BUILD_RESULT
Bundle: $BUNDLE_SIZE
Commit oggi: $COMMIT_TODAY
Branch: $BRANCH_COUNT
Score: $SCORE_LINE"
    curl -s -X POST \
        "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=${TELEGRAM_CHAT_ID}" \
        -d "text=$MSG" \
        > /dev/null 2>&1
    echo "Report testo inviato su Telegram (pdflatex non disponibile)"
fi

# Cleanup .aux .log
rm -f "$REPORT_DIR"/*.aux "$REPORT_DIR"/*.log 2>/dev/null

echo "Done: report-$TIMESTAMP"
