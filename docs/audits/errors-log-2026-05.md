# Errors log 2026-05

**Project**: ELAB Tutor
**Source**: watchdog-elab

## Entries


### 2026-05-01T00:10:21Z — edge_unlim-chat_content_failed

**Detail**: Response success=false or empty. Raw: {"success":false,"error":"unauthorized","reason":"missing X-Elab-Api-Key header"}

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-05-01T00:10:21Z — edge_unlim-hints_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"hints":"Controlla che tutti i componenti elettronici siano collegati correttamente prima di accendere l'alimentazione. Assicurati che la polarità dei componenti sia rispettata per ev

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab

### 2026-05-01T00:10:21Z — edge_unlim-diagnose_content_failed

**Detail**: Response success=false or empty. Raw: {"success":true,"diagnosis":"C'è un problema con il circuito: non ci sono collegamenti ([AZIONE:highlight:wires]) tra i componenti, quindi il circuito non funziona. \nÈ un problema perché senza col

**Pattern hint**: Check Edge Function logs in Supabase dashboard

**Run**: regular | **Source**: watchdog-elab
