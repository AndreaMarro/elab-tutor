# Ricerca Verificata: Sviluppo Autonomo AI 20 Giorni
> Data: 2026-04-06 | 3 agenti paralleli + 8 ricerche web dirette | Tutti i numeri verificati via GitHub API

## Claim Verificati

| Claim | Status | Valore Reale | Fonte |
|-------|--------|-------------|-------|
| DeepSeek R1: 37B attivi / 671B totali MoE | VERO | Confermato | api-docs.deepseek.com |
| Kimi K2.5: 256K context, 1T params, 32B attivi | VERO | 384 esperti MoE | build.nvidia.com |
| SlopCodeBench: codice AI 2.2x piu verboso | VERO | arXiv:2603.24755 | arxiv.org |
| SlopCodeBench: 89.8% verbosity increase | VERO | Abstract: "verbosity in 89.8%" | arxiv.org/abs/2603.24755 |
| claude-mem: 45K star | VERO | 45,683 | GitHub API |
| BMAD Method: 43K star | VERO | 43,687 | GitHub API |
| Ralph: ~500 star | FALSO | 8,494 (17x sottostimato) | GitHub API |
| Karpathy autoresearch: 3.2K star | FALSO | 66,760 (21x sottostimato) | GitHub API |
| IBM 2% degradation per step → 40% at 20 | FALSO | Numeri fabricati. Paper reale: 42% decline over 500 interactions | arXiv:2601.04170 |
| Alibaba SWE-CI 75% break code | VERO | Claude Opus unico >50% zero-regression | arXiv:2603.03823 |
| OpenClaw 170K star | VECCHIO | Ora 349K. Claw-code 172K | GitHub API |
| Kimi K2.5 200-300 tool calls no drift | VERO | End-to-end trained, nearly 100% accuracy | kimi.com/blog |
| Ralph 556 tests | QUASI VERO | Ora 566 tests (v0.11.5) | github.com |
| ARIS: 5.5K star | VERO | 5,601 | GitHub API |
| DeepSeek R1 API OpenAI compatible | VERO | $0.55/M in, $2.19/M out | api-docs.deepseek.com |
| Nessuno ha fatto 20 giorni autonomi | VERO | Max: overnight 8-12h | Ricerca multipla |

## Benchmark Mac Mini M4 16GB

| Modello | Quant | Tok/s | RAM |
|---------|-------|-------|-----|
| Qwen2.5-7B | Q4_K_M | 32-35 | ~5GB |
| Llama 3.3-8B | Q4_K_M | ~30 | ~5.5GB |
| DeepSeek-R1-Distill-7B | Q4_K_M | ~28 | ~5GB |

MLX puo essere 30-50% piu veloce di Ollama su Apple Silicon.

## Anti-Degradazione Concreta

1. ESLint complexity (built-in): max CC=20, max 150 lines/func
2. eslint-plugin-sonarjs: cognitive complexity max 15
3. jscpd: duplicazione max 5%, GitHub Action disponibile
4. Git diff size limit: max 500 righe/commit via hook
5. DeepSeek R1 cross-review: ~€3-5/mese per volume ELAB

## Anti-Sleep Mac (corretto)

pmset -c sleep 0 (NON caffeinate — configurazione di sistema, piu affidabile)

## Budget AI Reale

DeepSeek R1: €3-5/mese | Kimi K2.5: €5-10/mese | ChatGPT Plus: €20/mese | Totale: €28-35
