# Multi-Vendor Anti-Bias Workflow Schema — ELAB Tutor iter 38+

**Status**: PROPOSED iter 38 close (Andrea explicit "tutti proattivi + Claude ultima parola + più vendors + agile retroattivo + sfrutta capabilities")

**Goal**: Anti-inflation + anti-regression + Principio Zero + Morfismo Sense 2 compliance via specialized vendor swarm con Claude session synthesizer + last-word gate.

---

## §1 Vendor capabilities matrix (specialized roles)

| Vendor | Best capability | ELAB role | Cost | Status |
|---|---|---|---|---|
| **Claude Opus 4.7 1M** | Synthesis + last word + safety | ORCHESTRATOR + final decision | sub Andrea Max | ✅ active |
| **Codex CLI 0.128.0** | Code implementation fluent | Impl/refactor proposals | ChatGPT Plus Andrea | ✅ active |
| **Gemini 2.5 Flash** | Deep critique + reasoning | Architectural review primary | Pro Andrea | ✅ active |
| **Gemini 2.5 Pro 1M** | 1M context full-file diff | Long-doc whole-codebase review | Pro Andrea | ⚠️ env switch |
| **Mistral medium FR** | Italian language native | Italian K-12 user-facing review | Scale €18/mese Andrea | ✅ active |
| **Mistral Large** | Reasoning chain | Edge case detection | Scale Andrea | ⚠️ same key |
| **Kimi K2.6 256K** | 256K + multimodal + reasoning | Anti-bias + visual diff | Andrea Moonshot ~$15/m | ✅ post fix iter 38 |
| **Groq Llama 70B/Mixtral** | Ultra-fast ~500 tok/s | Quick iteration loop | FREE 14k req/day | ⏳ Andrea signup |
| **Cerebras Inference** | Faster ~2000 tok/s | Real-time validation | FREE limited | ⏳ Andrea signup |
| **z.ai GLM-4.6** | Free tier API | Cost-zero alternative | FREE web (no API) | ⏳ Andrea signup |
| **Together AI** | Llama 3.3 70B Italian | Backup Italian | gated emergency only | ⚠️ already wired |

**ALL vendors briefed con `scripts/three-agent/elab-context-preamble.md`** (Principio Zero + Morfismo Sense 2 + plurale Ragazzi + kit Omaric + volumi cartacei + Italian K-12 docente LIM).

---

## §2 Schema agile retroattivo 6-round (proattivo)

```
                          ┌─────────────────────────────────┐
                          │   CLAUDE OPUS 4.7 1M             │
                          │   ORCHESTRATOR + LAST WORD       │
                          │   (synthesizer + safety + apply) │
                          └─────────────────────────────────┘
                                       ║
                   ┌───────────────────╬───────────────────┐
                   ↓                   ↓                   ↓
         ROUND 1: IMPLEMENT     ROUND 2: REVIEW      ROUND 6: SYNTHESIS
         ┌──────────────┐       ┌──────────────┐    ┌──────────────┐
         │  CODEX CLI   │       │  GEMINI Pro  │    │ Claude Opus  │
         │  (write)     │       │  (1M deep)   │    │ (last word)  │
         └──────────────┘       └──────────────┘    └──────────────┘
                ║                       ║                   ↑
                ↓                       ↓                   ║
         ROUND 3: PARALLEL ANTI-BIAS                        ║
         ┌──────────┐ ┌──────────┐ ┌──────────┐             ║
         │ Mistral  │ │ Kimi K2.6│ │ Gemini   │             ║
         │ medium   │ │ 256K     │ │ 2.5 Flash│             ║
         │ IT K-12  │ │ multimod │ │ critic   │             ║
         └──────────┘ └──────────┘ └──────────┘             ║
                ║         ║         ║                       ║
                ↓         ↓         ↓                       ║
         ROUND 4: FAST CONSENSUS                            ║
         ┌──────────┐ ┌──────────┐                          ║
         │ Groq     │ │ Cerebras │ <--- FREE quick votes    ║
         │ Llama 70B│ │ Inference│                          ║
         └──────────┘ └──────────┘                          ║
                ║         ║                                 ║
                ↓         ↓                                 ║
         ROUND 5: CODEX ITER 2 FINALIZE                     ║
         ┌──────────────────────────┐                       ║
         │ Codex integrate findings │                       ║
         │ (Round 2+3+4 aggregate)  │                       ║
         └──────────────────────────┘                       ║
                ║                                           ║
                ╚═══════════════════════════════════════════╝
                                ↓
                ┌──────────────────────────────────┐
                │ M-AI-07 multi-vendor-anti-bias   │
                │ aggregator + dedup + outlier flag│
                └──────────────────────────────────┘
                                ↓
                ┌──────────────────────────────────┐
                │ CLAUDE Opus FINAL DECISION       │
                │ - Sintesi onesta NO compiacenza  │
                │ - Reject vendor if CLAUDE.md viol│
                │ - Apply selectively              │
                │ - Edit + commit + push origin    │
                └──────────────────────────────────┘
                                ↓
                ┌──────────────────────────────────┐
                │ M-AR-07 vendor-output-sanity     │
                │ validate JSON + check Principio  │
                │ Zero + Morfismo Sense 2 in props │
                └──────────────────────────────────┘
                                ↓
                ┌──────────────────────────────────┐
                │ Pre-commit hook + pre-push hook  │
                │ vitest baseline preserve         │
                └──────────────────────────────────┘
                                ↓
                ┌──────────────────────────────────┐
                │ Vercel deploy + Chrome MCP verify│
                │ + M-AR-06 branch verifier        │
                └──────────────────────────────────┘
```

---

## §3 Round-by-round agile retroactive detail

### Round 1: IMPLEMENT (Codex)
- Codex CLI exec con briefing + ELAB context preamble
- Output codice raw (1-200 LOC)
- Time ~30-60s

### Round 2: DEEP REVIEW (Gemini Pro 1M context)
- Gemini Pro 1M legge whole-codebase context + Codex output
- Critique deep architecturale
- Detect file:line side-effect ai limiti context window
- Time ~60-120s

### Round 3: PARALLEL ANTI-BIAS (Mistral + Kimi + Gemini Flash)
- **Mistral medium FR**: Italian K-12 plurale Ragazzi + linguaggio docente verifica
- **Kimi K2.6 256K**: anti-bias rejection consensus + Principio Zero violation check + multimodal (vision review SVG/screenshot if applicabile)
- **Gemini 2.5 Flash**: secondary architectural critic (different temperature/seed)
- 3 vendors PARALLEL = total ~30-60s wall-clock
- JSON output {agreed_with_consensus, new_finding, rejected_concerns}

### Round 4: FAST CONSENSUS (Groq + Cerebras)
- **Groq Llama 70B**: rapid sanity check ~5-15s
- **Cerebras Inference**: ultra-fast cross-validation ~3-10s
- Cheap parallel votes (FREE tier)
- Detect outlier vs majority

### Round 5: CODEX ITER 2 FINALIZE
- Codex receives Round 2+3+4 aggregate findings
- Integrates HIGH/MEDIUM findings into refined output
- Time ~30-60s

### Round 6: CLAUDE OPUS LAST WORD (Andrea explicit "ultima parola")
- Claude session synthesizer
- Reads: Codex original + Codex iter 2 + Round 2+3+4 findings + M-AI-07 aggregate
- Decision matrix:
  - ✅ Accept Codex iter 2 if no CLAUDE.md violation
  - ⚠️ Reject specific findings if vendor missed Principio Zero / Morfismo Sense 2
  - 🔄 Hybrid sintesi if 256K Kimi caught critical missing finding
  - ❌ Reject all + Andrea ratify if architectural risk
- Apply Edit tool + commit + push origin
- Document audit + reasoning per ratify trail

---

## §4 Mechanism portfolio (M-AI-XX + M-AR-XX) — anti-inflation + anti-regression

| ID | Type | Status | Function |
|---|---|---|---|
| M-AI-01 | anti-inflation | ✅ shipped | score-history-validator |
| M-AI-02 | anti-inflation | ✅ shipped | mechanical-cap-enforcer 8 caps |
| M-AI-03 | anti-inflation | ✅ shipped | claim-reality-gap-detector (file/git verify) |
| M-AI-04 | anti-inflation | ✅ shipped | doc-drift-detector (293 files scanned) |
| M-AI-05 | anti-inflation | ✅ shipped | multi-vote-G45-gate |
| M-AI-06 | anti-inflation | ✅ shipped iter 38 | prompt-state-validator (preempt iter prompt drift) |
| **M-AI-07** | **anti-inflation** | **🆕 PROPOSED** | **multi-vendor-anti-bias orchestrator (Round 1-6)** |
| **M-AI-08** | **anti-inflation** | **🆕 PROPOSED** | **vendor-context-injector (preamble enforce)** |
| **M-AI-09** | **anti-inflation** | **🆕 PROPOSED** | **retroactive-loop-coordinator (Round 5 iterate)** |
| M-AR-01 | anti-regression | ✅ shipped | auto-revert-pre-commit |
| M-AR-05 | anti-regression | ✅ shipped | smart-rollback |
| M-AR-06 | anti-regression | ✅ shipped iter 38 | vercel-deploy-branch-verifier |
| **M-AR-07** | **anti-regression** | **🆕 PROPOSED** | **vendor-output-sanity-check (validate JSON + Principio Zero in proposals)** |
| **M-AR-08** | **anti-regression** | **🆕 PROPOSED** | **retroactive-finding-applier (selective apply, NO compiacenza)** |

---

## §5 Anti-pattern enforcement (Andrea explicit "non compiacere")

**Vendor compiacenza patterns (rejected by Claude last word)**:
1. Vendor agrees with majority WITHOUT independent reasoning → flag suspicious
2. Vendor proposes change that violates Principio Zero → reject regardless of finding quality
3. Vendor preserves Andrea past work AT COST of CLAUDE.md violation → Claude rejects (apply Kimi-style anti-bias)
4. Vendor reword same finding 4× pretending diversity → M-AI-07 dedup detect
5. Vendor outputs JSON that doesn't follow briefing schema → M-AR-07 reject

**Claude last word criteria (NON COMPIACENZA gate)**:
- ✅ Apply finding if file:line evidence + CLAUDE.md compliant + reversible
- ❌ Reject finding if violates Principio Zero / Morfismo Sense 2 / kit fisico Omaric / volumi cartacei coerenza
- ⚠️ Andrea ratify required if architectural change OR Tea/Davide/Omaric impact
- 🔄 Hybrid sintesi if 256K vendor caught critical finding 3-vendor missed

---

## §6 Vendor expansion path Andrea ratify (~30 min total)

**Andrea action signup ~30 min totale**:
1. **Groq**: https://console.groq.com → API Keys → Create (FREE 14k req/day, ~30 sec)
2. **Cerebras**: https://inference.cerebras.ai → signup (FREE limited, ~2 min)
3. **z.ai GLM-4.6**: https://chat.z.ai → free signup (web only, ~2 min) [no API yet]

Save keys to `~/.elab-credentials/sprint-s-tokens.env` (chmod 600 directory).

Memory file shipped `mistral-cloudflare-credentials.md` per future bootstrap.

---

## §7 Implementation order iter 39+

1. **Iter 39 P0**: Andrea ratify schema (this doc)
2. **Iter 39 P0**: Ship M-AI-07 multi-vendor-anti-bias.sh (~150 LOC bash orchestrator)
3. **Iter 39 P0**: Ship M-AI-08 vendor-context-injector.sh (~50 LOC preamble enforce)
4. **Iter 39 P1**: Andrea signup Groq + Cerebras + z.ai
5. **Iter 39 P1**: Ship M-AR-07 vendor-output-sanity-check.sh (~80 LOC JSON + Principio Zero validate)
6. **Iter 40 P0**: Ship M-AR-08 retroactive-finding-applier.sh (~120 LOC selective apply)
7. **Iter 40 P0**: Ship M-AI-09 retroactive-loop-coordinator.sh (~150 LOC Round 5 iterate)
8. **Iter 40 P1**: Integrate Groq + Cerebras into M-AI-07 (Round 4)
9. **Iter 41+**: Sprint T close gate Andrea Opus G45 indipendente review (cumulative iter 41-43)

---

## §8 Anti-pattern G45 enforced

- ✅ Claude session HAS LAST WORD (Andrea explicit)
- ✅ Tutti vendors PROATTIVI con context preamble preinjected
- ✅ Più vendors specialized capabilities (8 vendors enumerated, 5 ready)
- ✅ Agile retroactive 6-round (iterate Codex Round 5 if findings demand)
- ✅ NO compiacenza (Claude rejects vendor proposals violating CLAUDE.md)
- ✅ NO single-shot (multi-round iterate aggregate)
- ✅ NO env keys printed (preamble references file location only)
- ✅ Cost incremental ~$0.005-0.020 per atom (subs Andrea esistenti + FREE tiers)

---

End schema multi-vendor anti-bias workflow ELAB Tutor iter 38+.
