/**
 * UnlimReport — FUMETTO ELAB della lezione
 * Report comic-style: pannelli irregolari, balloon con tail SVG, mascotte,
 * scene tipizzate (Scoperta/Oops/Eureka/Domandona), grafici SVG inline.
 * Il docente aggiunge screenshot e foto, poi stampa -> PDF.
 * Usa solo DOM methods sicuri.
 * SECURITY: All user text is escaped via esc() before template insertion.
 * The only non-escaped content is hardcoded SVG icon constants.
 * (c) Andrea Marro — 31/03/2026 — ELAB Tutor — Tutti i diritti riservati
 */

import { getSavedSessions, getLastSession } from '../../hooks/useSessionTracker';
import { getLessonPath } from '../../data/lesson-paths';

// ─── Helpers ────────────────────────────────────────────────────────

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDuration(start, end) {
  if (!start || !end) return '\u2014';
  const min = Math.round((new Date(end) - new Date(start)) / 60000);
  if (min < 1) return '< 1 min';
  return `${min} min`;
}

function esc(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Tronca il testo a maxLen caratteri, tagliando su una parola. */
function truncate(text, maxLen = 150) {
  if (!text || text.length <= maxLen) return text;
  const cut = text.lastIndexOf(' ', maxLen);
  return text.slice(0, cut > 0 ? cut : maxLen) + '...';
}

function humanize(id) {
  const m = {
    led_base: 'LED', resistenza_ohm: 'Legge di Ohm', circuito_serie: 'Serie',
    circuito_parallelo: 'Parallelo', condensatore_energia: 'Condensatore',
    carica_scarica_RC: 'RC', controllo_indiretto: 'Controllo indiretto',
    catena_reazione: 'Catena', potenziometro: 'Potenziometro',
    fotoresistore: 'LDR', pwm_duty: 'PWM', servo_angolo: 'Servo',
    digitalRead: 'digitalRead', analogRead: 'analogRead',
    digitalWrite: 'digitalWrite', analogWrite: 'analogWrite/PWM',
    tau_RC: '\u03C4 RC', R_varia_scarica: 'R scarica',
    multimetro_tensione: 'Multimetro V', scarica_esponenziale: 'Scarica exp',
  };
  return m[id] || id.replace(/_/g, ' ');
}

function volumeColor(expId) {
  if (!expId) return '#1E4D8C';
  if (expId.startsWith('v1')) return '#4A7A25';
  if (expId.startsWith('v2')) return '#E8941C';
  if (expId.startsWith('v3')) return '#E54B3D';
  return '#1E4D8C';
}

function volumeNum(expId) {
  if (!expId) return '';
  if (expId.startsWith('v1')) return '1';
  if (expId.startsWith('v2')) return '2';
  if (expId.startsWith('v3')) return '3';
  return '';
}

// ─── SVG Inline Icons (hardcoded constants — not user content) ──────

const SVG_ROBOT = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="12" rx="2"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><path d="M12 2v4"/><circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"/><path d="M3 14h2"/><path d="M19 14h2"/></svg>`;

const SVG_LIGHTBULB = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>`;

const SVG_WARNING = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

const SVG_TROPHY = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;

const SVG_STAR = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

const SVG_BOOK = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>`;

const SVG_QUESTION = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

const SVG_CAMERA = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg>`;

const SVG_PRINT = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;

const SVG_SCREENSHOT = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/><path d="M9 13h6"/></svg>`;

const SVG_X = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const SVG_STUDENT = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/><path d="M18 8h2"/><path d="M20 6v4"/></svg>`;

const SVG_ARROW_UP = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12l5-5 5 5"/><path d="M12 7v10"/></svg>`;

// ─── Scene builder ──────────────────────────────────────────────────
// Costruisce le scene del fumetto dalla VERA lezione:
// 1. Usa le fasi del lesson path (PREPARA, MOSTRA, CHIEDI, OSSERVA, CONCLUDI)
// 2. Inserisce i dialoghi reali della sessione nei punti giusti
// 3. Aggiunge esercizi, analogie, errori comuni dal curriculum
// 4. Linguaggio sempre per bambini 10-14

function buildScenes(session, lessonPath) {
  const scenes = [];
  const msgs = session?.messages || [];
  const errs = session?.errors || [];
  const phases = lessonPath?.phases || [];

  // ── INTRO: cosa abbiamo fatto oggi ──
  if (lessonPath?.title) {
    scenes.push({
      type: 'intro',
      title: lessonPath.title,
      text: lessonPath.objective || 'Scopriamo insieme qualcosa di nuovo!',
    });
  }

  // ── COMPONENTI: cosa abbiamo usato ──
  const components = lessonPath?.components_needed;
  if (components?.length > 0) {
    scenes.push({
      type: 'components',
      title: 'I nostri strumenti',
      items: components,
    });
  }

  // ── FASI + DIALOGHI: la storia della lezione ──
  // Mappa i messaggi alle fasi temporali
  let msgIdx = 0;
  const storyArc = [
    { title: 'La prima domanda', mood: 'discovery' },
    { title: 'Si va avanti!', mood: 'discovery' },
    { title: 'Un lampo di genio', mood: 'eureka' },
    { title: 'La curiosit\u00E0 cresce', mood: 'question' },
    { title: 'Sempre pi\u00F9 in profondo', mood: 'discovery' },
    { title: 'Verso la soluzione', mood: 'eureka' },
    { title: 'Ci siamo quasi!', mood: 'eureka' },
    { title: 'L\u2019ultimo pezzo', mood: 'eureka' },
  ];

  // Se ci sono fasi nel lesson path, usa quelle come struttura
  if (phases.length > 0) {
    for (const phase of phases) {
      // Pannello fase (es. CHIEDI con domanda provocatoria)
      if (phase.provocative_question) {
        scenes.push({
          type: 'challenge',
          title: 'La Domanda!',
          mood: 'question',
          question: phase.provocative_question,
          tip: phase.teacher_tip,
        });
      }

      // Analogie — perfette per il fumetto
      if (phase.analogies?.length > 0) {
        for (const a of phase.analogies) {
          scenes.push({
            type: 'analogy',
            title: 'Lo sapevi?',
            mood: 'eureka',
            concept: a.concept,
            text: a.text,
          });
        }
      }

      // Errori comuni — "La Sfida"
      if (phase.common_mistakes?.length > 0) {
        for (const m of phase.common_mistakes) {
          // Controlla se questo errore è successo davvero nella sessione
          const happened = errs.some(e =>
            (e.detail || '').toLowerCase().includes(m.mistake.toLowerCase().split(' ')[0])
          );
          if (happened || phase.common_mistakes.length <= 2) {
            scenes.push({
              type: 'mistake',
              title: 'La Sfida!',
              mood: 'oops',
              mistake: m.mistake,
              response: m.teacher_response,
              analogy: m.analogy,
              happened,
            });
          }
        }
      }
    }
  }

  // Dialoghi reali dalla chat — inseriti come scene dialog
  let pairIdx = 0;
  for (let i = 0; i < msgs.length; i++) {
    if (msgs[i].role === 'user') {
      const resp = msgs[i + 1]?.role === 'assistant' ? msgs[i + 1] : null;
      const t0 = msgs[i].timestamp ? new Date(msgs[i].timestamp).getTime() : 0;
      const t1 = resp?.timestamp ? new Date(resp.timestamp).getTime() : t0 + 60000;
      const sceneErrs = (!t0) ? [] : errs.filter(e => {
        if (!e.timestamp) return false;
        const t = new Date(e.timestamp).getTime();
        return t >= t0 - 5000 && t <= t1 + 5000;
      });

      let scene = storyArc[pairIdx % storyArc.length];
      const q = msgs[i].text.toLowerCase();
      if (sceneErrs.length) scene = { title: 'La sfida!', mood: 'oops' };
      else if (q.includes('cos\'') || q.includes('cosa ') || q.includes('che cos')) scene = { title: 'Domandona!', mood: 'question' };
      else if (q.includes('perch')) scene = { title: 'Ma perch\u00E9?', mood: 'question' };
      else if (q.includes('funzion')) scene = { title: 'Come funziona?', mood: 'discovery' };
      else if (q.includes('aiut') || q.includes('help') || q.includes('non riesco')) scene = { title: 'Aiuto!', mood: 'question' };
      else if (q.includes('non si accende') || q.includes('non funziona')) scene = { title: 'Qualcosa non va...', mood: 'oops' };
      else if (q.includes('ho capito') || q.includes('ho fatto')) scene = { title: 'Eureka!', mood: 'eureka' };
      else if (q.includes('provo') || q.includes('proviamo')) scene = { title: 'Si sperimenta!', mood: 'discovery' };

      scenes.push({
        type: 'dialog',
        title: scene.title,
        mood: scene.mood,
        question: msgs[i],
        answer: resp,
        errors: sceneErrs,
      });
      if (resp) i++;
      pairIdx++;
    }
  }

  // ── ESERCIZIO: prova a casa! ──
  const concludePhase = phases.find(p => p.name === 'CONCLUDI');
  if (concludePhase?.next_preview || lessonPath?.next_experiment?.preview) {
    scenes.push({
      type: 'exercise',
      title: 'Prova a casa!',
      text: concludePhase?.next_preview || lessonPath.next_experiment.preview,
      summary: concludePhase?.summary_for_class || '',
    });
  }

  scenes.push({
    type: 'finale',
    concepts: lessonPath?.session_save?.concepts_covered || [],
    nextId: lessonPath?.session_save?.next_suggested || null,
  });

  return scenes;
}

function captureSimulatorScreenshot() {
  const svg = document.querySelector('.simulator-canvas svg, [data-simulator-canvas] svg');
  if (!svg) return null;
  try {
    const clone = svg.cloneNode(true);
    const { width, height } = svg.getBoundingClientRect();
    clone.setAttribute('width', width);
    clone.setAttribute('height', height);
    const data = new XMLSerializer().serializeToString(clone);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
  } catch {
    return null;
  }
}

// ─── Photo slot helper ──────────────────────────────────────────────

function photoSlotHTML(idx) {
  return `
    <div class="photo-slot no-print" data-scene="${idx}">
      <button class="add-photo-btn" onclick="addPhoto(${idx})">${SVG_CAMERA} Aggiungi foto</button>
      <span class="photo-hint">Breadboard, circuito, classe...</span>
    </div>
    <div class="photo-container" id="photos-${idx}"></div>`;
}

// ─── SVG stat bar ───────────────────────────────────────────────────

function statBarSVG(label, value, max, color) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return `<div class="stat-bar-row">
    <span class="stat-bar-label">${esc(label)}</span>
    <div class="stat-bar-track">
      <div class="stat-bar-fill" style="width:${pct}%;background:${color}"></div>
    </div>
    <span class="stat-bar-value">${value}</span>
  </div>`;
}

// ─── Mood config ────────────────────────────────────────────────────

// Mascotte espressive — robot UNLIM con espressioni diverse per mood
const SVG_MASCOT_HAPPY = `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="12" rx="2"/><path d="M12 2v4"/><circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"/><path d="M3 14h2"/><path d="M19 14h2"/><circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none"/><path d="M9.5 16.5 Q12 18.5 14.5 16.5" stroke-width="1.5"/></svg>`;

const SVG_MASCOT_THINK = `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="12" rx="2"/><path d="M12 2v4"/><circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"/><path d="M3 14h2"/><path d="M19 14h2"/><circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none"/><line x1="10" y1="17" x2="14" y2="17" stroke-width="1.5"/><circle cx="20" cy="6" r="1" fill="#E8941C" stroke="#E8941C"/><circle cx="22" cy="4" r="0.6" fill="#E8941C" stroke="#E8941C"/></svg>`;

const SVG_MASCOT_SURPRISE = `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="12" rx="2"/><path d="M12 2v4"/><circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"/><path d="M3 14h2"/><path d="M19 14h2"/><circle cx="9" cy="12.5" r="1.8" stroke-width="1.5"/><circle cx="9" cy="12.5" r="0.6" fill="currentColor" stroke="none"/><circle cx="15" cy="12.5" r="1.8" stroke-width="1.5"/><circle cx="15" cy="12.5" r="0.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="17" rx="1.5" ry="1.2" stroke-width="1.5"/></svg>`;

const SVG_MASCOT_OOPS = `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="12" rx="2"/><path d="M12 2v4"/><circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"/><path d="M3 14h2"/><path d="M19 14h2"/><line x1="8" y1="12" x2="10" y2="14" stroke-width="2"/><line x1="10" y1="12" x2="8" y2="14" stroke-width="2"/><line x1="14" y1="12" x2="16" y2="14" stroke-width="2"/><line x1="16" y1="12" x2="14" y2="14" stroke-width="2"/><path d="M9.5 17.5 Q12 16 14.5 17.5" stroke-width="1.5"/></svg>`;

function moodConfig(mood, volCol) {
  const configs = {
    discovery: { bg: '#F0F8FF', border: volCol, icon: SVG_MASCOT_HAPPY, accent: volCol, label: 'Scoperta' },
    eureka: { bg: '#FFFEF0', border: '#E8941C', icon: SVG_MASCOT_SURPRISE, accent: '#E8941C', label: 'Eureka' },
    oops: { bg: '#FFF5F5', border: '#D32F2F', icon: SVG_MASCOT_OOPS, accent: '#D32F2F', label: 'La Sfida' },
    question: { bg: '#F5F0FF', border: '#1E4D8C', icon: SVG_MASCOT_THINK, accent: '#1E4D8C', label: 'Domanda' },
  };
  return configs[mood] || configs.discovery;
}

// ─── Photo JS (safe DOM-only, no user-content in markup) ────────────

function photoScript(volCol, svgX) {
  // NOTE: The svgX variable contains a hardcoded SVG close icon constant.
  // It is NOT user input. The btn.textContent approach won't work for SVG,
  // so we use a safe, pre-sanitized constant via DOM createRange/createContextualFragment.
  return `
function addPhoto(sceneIdx){
  var inp=document.createElement('input');
  inp.type='file';inp.accept='image/*';inp.capture='environment';inp.multiple=true;
  inp.onchange=function(e){
    Array.from(e.target.files).forEach(function(f){
      if(f.size>5*1024*1024)return;
      var r=new FileReader();
      r.onload=function(ev){
        var c=document.getElementById('photos-'+sceneIdx);if(!c)return;
        var img2=new Image();
        img2.onload=function(){
          var maxW=800,maxH=600,w=img2.width,h=img2.height;
          if(w>maxW||h>maxH){var ratio=Math.min(maxW/w,maxH/h);w*=ratio;h*=ratio;}
          var canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
          canvas.getContext('2d').drawImage(img2,0,0,w,h);
          var dataUrl=canvas.toDataURL('image/jpeg',0.7);
          var w2=document.createElement('div');w2.className='photo-wrapper';
          var imgEl=document.createElement('img');imgEl.src=dataUrl;imgEl.alt='Foto';
          w2.appendChild(imgEl);
          var caption=document.createElement('input');caption.className='photo-caption no-print';
          caption.placeholder='Didascalia...';caption.type='text';
          w2.appendChild(caption);
          var btn=document.createElement('button');btn.className='photo-remove no-print';
          btn.textContent='\\u00D7';
          btn.onclick=function(){w2.remove()};w2.appendChild(btn);
          c.appendChild(w2);
        };
        img2.src=ev.target.result;
      };r.readAsDataURL(f);
    });
  };inp.click();
}
function addPhotoGlobal(){
  var slots=document.querySelectorAll('.photo-slot');
  if(slots.length>0){
    var last=slots[slots.length-1];
    addPhoto(Number(last.dataset.scene)||0);
  }
}
function addScreenshot(){
  var inp=document.createElement('input');
  inp.type='file';inp.accept='image/*';
  inp.onchange=function(e){
    var f=e.target.files[0];if(!f)return;
    var r=new FileReader();
    r.onload=function(ev){
      var grid=document.querySelector('.comic-grid');
      if(!grid)return;
      var div=document.createElement('div');
      div.className='panel panel-screenshot';
      div.style.setProperty('--panel-accent','${volCol}');
      var header=document.createElement('div');header.className='panel-header';
      var titleEl=document.createElement('span');titleEl.className='panel-title';
      titleEl.style.color='${volCol}';titleEl.textContent='Il nostro circuito';
      header.appendChild(titleEl);div.appendChild(header);
      var wrap=document.createElement('div');wrap.className='screenshot-wrap';
      var pw=document.createElement('div');pw.className='photo-wrapper';
      var img=document.createElement('img');img.src=ev.target.result;img.alt='Circuito';img.className='screenshot-img';
      pw.appendChild(img);
      var rm=document.createElement('button');rm.className='photo-remove no-print';
      rm.textContent='\\u00D7';
      rm.onclick=function(){div.remove()};pw.appendChild(rm);
      wrap.appendChild(pw);div.appendChild(wrap);
      grid.insertBefore(div,grid.firstChild);
    };r.readAsDataURL(f);
  };inp.click();
}`;
}

// ─── HTML Builder ───────────────────────────────────────────────────

function buildReportHTML(session, lessonPath, screenshotDataUrl) {
  const title = lessonPath?.title || session?.experimentId || 'Sessione ELAB';
  const date = formatDate(session?.startTime);
  const dur = formatDuration(session?.startTime, session?.endTime);
  const nMsg = session?.messages?.length || 0;
  const nErr = session?.errors?.length || 0;
  const concepts = lessonPath?.session_save?.concepts_covered || [];
  const volCol = volumeColor(session?.experimentId);
  const volN = volumeNum(session?.experimentId);
  const nextPath = lessonPath?.session_save?.next_suggested
    ? getLessonPath(lessonPath.session_save.next_suggested) : null;

  const scenes = buildScenes(session, lessonPath);
  const maxMsgs = Math.max(nMsg, nErr, concepts.length, 1);

  const scenesHTML = scenes.map((sc, idx) => {
    const num = idx + 1;

    if (sc.type === 'intro') {
      return `
      <div class="panel panel-intro" style="--panel-accent:${volCol}">
        <div class="panel-num">${num}</div>
        <div class="panel-body intro-body">
          <div class="mascot-circle" style="border-color:${volCol}">${SVG_ROBOT}</div>
          <div class="intro-content">
            <h2 class="intro-title" style="color:${volCol}">${esc(sc.title)}</h2>
            <p class="intro-text">${esc(sc.text)}</p>
            ${volN ? `<span class="vol-badge" style="background:${volCol}">Volume ${volN}</span>` : ''}
          </div>
        </div>
        ${photoSlotHTML(idx)}
      </div>`;
    }

    if (sc.type === 'components') {
      const items = (sc.items || []).map(c =>
        `<span class="comp-pill">${esc(c.name)} ${c.quantity > 1 ? '\u00D7' + c.quantity : ''}</span>`
      ).join('');
      return `
      <div class="panel panel-components" style="--panel-accent:${volCol}">
        <div class="panel-num" style="background:${volCol}">${num}</div>
        <div class="panel-header">
          <span class="mood-icon" style="color:${volCol}">${SVG_BOOK}</span>
          <span class="panel-title" style="color:${volCol}">${esc(sc.title)}</span>
        </div>
        <div class="comp-grid">${items}</div>
      </div>`;
    }

    if (sc.type === 'challenge') {
      const mc = moodConfig('question', volCol);
      return `
      <div class="panel panel-challenge" style="--panel-accent:${mc.border};background:${mc.bg}">
        <div class="panel-num" style="background:${mc.border}">${num}</div>
        <div class="panel-header">
          <span class="mood-icon" style="color:${mc.accent}">${mc.icon}</span>
          <span class="panel-title" style="color:${mc.accent}">${esc(sc.title)}</span>
          <span class="mood-label" style="color:${mc.accent}">${mc.label}</span>
        </div>
        <div class="challenge-box">
          <p class="challenge-q">${esc(sc.question)}</p>
        </div>
        ${sc.tip ? `<p class="challenge-tip">${esc(sc.tip)}</p>` : ''}
        ${photoSlotHTML(idx)}
      </div>`;
    }

    if (sc.type === 'analogy') {
      const mc = moodConfig('eureka', volCol);
      return `
      <div class="panel panel-analogy" style="--panel-accent:${mc.border};background:${mc.bg}">
        <div class="panel-num" style="background:${mc.border}">${num}</div>
        <div class="panel-header">
          <span class="mood-icon" style="color:${mc.accent}">${mc.icon}</span>
          <span class="panel-title" style="color:${mc.accent}">${esc(sc.title)}</span>
          <span class="mood-label" style="color:${mc.accent}">Analogia</span>
        </div>
        <div class="analogy-box">
          <p class="analogy-text">${esc(sc.text)}</p>
        </div>
      </div>`;
    }

    if (sc.type === 'mistake') {
      const mc = moodConfig('oops', volCol);
      return `
      <div class="panel panel-mistake" style="--panel-accent:${mc.border};background:${mc.bg}">
        <div class="panel-num" style="background:${mc.border}">${num}</div>
        <div class="panel-header">
          <span class="mood-icon" style="color:${mc.accent}">${mc.icon}</span>
          <span class="panel-title" style="color:${mc.accent}">${esc(sc.title)}</span>
          <span class="mood-label" style="color:${mc.accent}">${sc.happened ? 'Successo!' : 'Attenzione'}</span>
        </div>
        <div class="mistake-box">
          <p class="mistake-what"><strong>Errore:</strong> ${esc(sc.mistake)}</p>
          <p class="mistake-fix">${esc(sc.response)}</p>
          ${sc.analogy ? `<p class="mistake-analogy">${esc(sc.analogy)}</p>` : ''}
        </div>
        ${photoSlotHTML(idx)}
      </div>`;
    }

    if (sc.type === 'exercise') {
      return `
      <div class="panel panel-exercise" style="--panel-accent:${volCol};background:linear-gradient(135deg,#FFF8E1,#FFFDE7)">
        <div class="panel-num" style="background:${volCol}">${num}</div>
        <div class="panel-header">
          <span class="mood-icon" style="color:${volCol}">${SVG_STAR}</span>
          <span class="panel-title" style="color:${volCol}">${esc(sc.title)}</span>
          <span class="mood-label" style="color:${volCol}">Esercizio</span>
        </div>
        ${sc.summary ? `<p class="exercise-summary">${esc(sc.summary)}</p>` : ''}
        <div class="exercise-box">
          <p class="exercise-text">${esc(sc.text)}</p>
        </div>
      </div>`;
    }

    if (sc.type === 'dialog') {
      const mc = moodConfig(sc.mood, volCol);
      const qT = formatTime(sc.question.timestamp);

      return `
      <div class="panel panel-dialog" style="--panel-accent:${mc.border};background:${mc.bg}">
        <div class="panel-num" style="background:${mc.border}">${num}</div>
        <div class="panel-header">
          <span class="mood-icon" style="color:${mc.accent}">${mc.icon}</span>
          <span class="panel-title" style="color:${mc.accent}">${esc(sc.title)}</span>
          <span class="mood-label" style="color:${mc.accent}">${mc.label}</span>
          ${qT ? `<span class="panel-time">${qT}</span>` : ''}
        </div>
        <div class="comic-row">
          <div class="char-col">
            <div class="char-avatar char-student">${SVG_STUDENT}</div>
            <div class="char-name">Classe</div>
          </div>
          <div class="balloon balloon-q">
            <div class="balloon-content">${esc(sc.question.text)}</div>
            <svg class="balloon-tail-svg tail-left-svg" width="16" height="20" viewBox="0 0 16 20">
              <path d="M16 0 C12 6, 2 8, 0 20 C4 14, 10 10, 16 8 Z" fill="#D6E4F5"/>
            </svg>
          </div>
        </div>
        ${sc.errors.map(e => `
        <div class="error-strip">
          <span class="error-icon">${SVG_WARNING}</span>
          <span><strong>Oops!</strong> ${esc(e.detail || e.type)}</span>
        </div>`).join('')}
        ${sc.answer ? `
        <div class="comic-row row-flip">
          <div class="balloon balloon-a">
            <div class="balloon-content">${esc(truncate(sc.answer.text, 180))}</div>
            <svg class="balloon-tail-svg tail-right-svg" width="16" height="20" viewBox="0 0 16 20">
              <path d="M0 0 C4 6, 14 8, 16 20 C12 14, 6 10, 0 8 Z" fill="#D6F0D6"/>
            </svg>
          </div>
          <div class="char-col">
            <div class="char-avatar char-robot" style="border-color:${volCol}">${SVG_ROBOT}</div>
            <div class="char-name" style="color:${volCol}">UNLIM</div>
          </div>
        </div>` : ''}
        ${photoSlotHTML(idx)}
      </div>`;
    }

    if (sc.type === 'finale') {
      const pills = sc.concepts.length > 0
        ? sc.concepts.map(c => `<span class="pill" style="--pill-color:${volCol}">${esc(humanize(c))}</span>`).join('')
        : '<span class="pill pill-empty">Sessione libera</span>';

      return `
      <div class="panel panel-finale" style="--panel-accent:${volCol}">
        <div class="panel-num" style="background:${volCol}">${num}</div>
        <div class="panel-body finale-body">
          <div class="trophy-circle" style="color:${volCol}">${SVG_TROPHY}</div>
          <div class="finale-content">
            <h2 class="finale-title" style="color:${volCol}">Missione completata!</h2>
            <div class="stats-mini">
              ${statBarSVG('Domande', nMsg, maxMsgs, volCol)}
              ${statBarSVG('Errori', nErr, maxMsgs, '#D32F2F')}
              ${statBarSVG('Concetti', concepts.length, maxMsgs, '#4A7A25')}
            </div>
            <p class="finale-label">Concetti conquistati:</p>
            <div class="pills">${pills}</div>
            ${nErr > 0
              ? `<p class="finale-note">${SVG_ARROW_UP} ${nErr} ${nErr === 1 ? 'errore superato' : 'errori superati'} — sbagliando si impara!</p>`
              : `<p class="finale-note">${SVG_STAR} Zero errori — sessione perfetta!</p>`}
            ${nextPath ? `<div class="next-box" style="border-color:${volCol}40">${SVG_BOOK} <strong>Prossima avventura:</strong> ${esc(nextPath.title)}</div>` : ''}
          </div>
        </div>
        ${photoSlotHTML(idx)}
      </div>`;
    }
    return '';
  }).join('');

  const screenshotHTML = screenshotDataUrl
    ? `<div class="panel panel-screenshot" style="--panel-accent:${volCol}">
        <div class="panel-num" style="background:${volCol}">${SVG_SCREENSHOT}</div>
        <div class="panel-header"><span class="panel-title" style="color:${volCol}">Il nostro circuito</span></div>
        <div class="screenshot-wrap"><img src="${screenshotDataUrl}" alt="Screenshot circuito" class="screenshot-img"></div>
       </div>` : '';

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fumetto ELAB — ${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Open Sans',system-ui,sans-serif;color:#1A1A2E;background:#E8E8F0;line-height:1.55}
@media print{body{background:#fff}.no-print{display:none!important}.wrap{box-shadow:none;margin:0;max-width:none;border-radius:0}.cover-page{break-after:page}.panel{break-inside:avoid}.panel-finale{break-before:page}@page{margin:1cm 1.4cm;size:A4}}
.wrap{max-width:840px;margin:0 auto;background:#fff;border-radius:18px;box-shadow:0 6px 30px rgba(0,0,0,0.1);overflow:hidden}
.toolbar{position:sticky;top:0;z-index:100;background:#fff;padding:12px 20px;display:flex;justify-content:center;gap:10px;border-bottom:1px solid #E0E0E0;box-shadow:0 2px 8px rgba(0,0,0,0.05);flex-wrap:wrap}
.tb{padding:10px 24px;font-size:14px;font-weight:700;font-family:'Oswald',sans-serif;letter-spacing:.5px;border:none;border-radius:8px;cursor:pointer;transition:.15s;display:inline-flex;align-items:center;gap:6px}
.tb svg{vertical-align:middle}
.tb-pr{background:#1E4D8C;color:#fff}.tb-pr:hover{background:#163B6C}
.tb-sc{background:#F0F2F5;color:#1E4D8C}.tb-sc:hover{background:#E0E4EA}
.tb-photo{background:${volCol};color:#fff}.tb-photo:hover{filter:brightness(0.9)}
.cover-page{background:linear-gradient(145deg,${volCol} 0%,#1E4D8C 60%,#0D2B52 100%);color:#fff;padding:64px 36px 56px;text-align:center;position:relative;overflow:hidden}
.cover-page::before{content:'';position:absolute;inset:0;background:radial-gradient(circle 3px at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 3px);background-size:50px 50px}
.cover-page::after{content:'';position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to top,rgba(0,0,0,.15),transparent)}
.cover-inner{position:relative;z-index:1}
.cover-mascot{width:120px;height:120px;border-radius:28px;background:rgba(255,255,255,.18);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:#fff;box-shadow:0 8px 32px rgba(0,0,0,.2);border:2px solid rgba(255,255,255,.15)}
.cover-h1{font-family:'Oswald',sans-serif;font-size:36px;font-weight:700;letter-spacing:-.5px;margin-bottom:6px;text-shadow:0 2px 8px rgba(0,0,0,.3)}
.cover-sub{font-family:'Oswald',sans-serif;font-size:22px;font-weight:500;opacity:.9;text-shadow:0 1px 4px rgba(0,0,0,.2)}
.cover-meta{font-size:15px;opacity:.75;margin-top:10px}
.cover-badge{display:inline-block;background:rgba(255,255,255,.22);padding:6px 20px;border-radius:24px;font-size:15px;letter-spacing:.5px;margin-top:10px;font-weight:700;border:1px solid rgba(255,255,255,.2)}
.stats{display:flex;border-bottom:2px solid #F0F0F0}
.st{flex:1;text-align:center;padding:16px 8px;border-right:1px solid #F0F0F0}.st:last-child{border:none}
.st-v{font-family:'Oswald',sans-serif;font-size:28px;font-weight:700;color:${volCol}}
.st-l{font-size:14px;color:#555;text-transform:uppercase;letter-spacing:.6px;margin-top:3px;font-weight:600}
.comic-grid{padding:20px 24px;display:flex;flex-direction:column;gap:22px}
.panel{border:3px solid var(--panel-accent,#1E4D8C);border-radius:18px 6px 18px 6px;padding:24px 26px;position:relative;background:#FAFBFE;box-shadow:0 3px 12px rgba(0,0,0,.04)}
.panel:nth-child(even){border-radius:6px 18px 6px 18px}
.panel-num{position:absolute;top:-14px;left:18px;width:28px;height:28px;border-radius:50%;background:var(--panel-accent,#1E4D8C);color:#fff;font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.15)}
.panel-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-top:4px}
.mood-icon{display:flex;align-items:center}
.panel-title{font-family:'Oswald',sans-serif;font-size:18px;font-weight:700;letter-spacing:.3px;text-transform:uppercase}
.mood-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:.6;padding:2px 8px;border-radius:10px;background:currentColor;color:inherit!important}
.mood-label{-webkit-text-fill-color:#fff;background:var(--panel-accent,#1E4D8C);opacity:.7}
.panel-time{font-size:14px;color:#737373;margin-left:auto;font-weight:600}
.panel-intro{background:linear-gradient(135deg,#FAFFFE,#F0F8F0)}
.panel-finale{background:linear-gradient(135deg,#F0FFF4,#E8F5E9);border-width:4px}
.intro-body,.finale-body{display:flex;align-items:center;gap:20px;margin-top:8px}
.mascot-circle{width:80px;height:80px;border-radius:50%;border:3px solid #1E4D8C;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#fff;color:#1E4D8C;box-shadow:0 4px 12px rgba(0,0,0,0.08)}
.intro-content,.finale-content{flex:1}
.intro-title,.finale-title{font-family:'Oswald',sans-serif;font-size:22px}
.intro-text{font-size:15px;color:#444;margin-top:4px}
.vol-badge{display:inline-block;color:#fff;padding:3px 12px;border-radius:12px;font-size:14px;font-weight:700;margin-top:8px}
.trophy-circle{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:linear-gradient(135deg,#FFF8E1,#FFFDE7);box-shadow:0 4px 12px rgba(0,0,0,0.08)}
.stats-mini{margin:12px 0}
.stat-bar-row{display:flex;align-items:center;gap:8px;margin:4px 0}
.stat-bar-label{font-size:14px;font-weight:700;color:#737373;text-transform:uppercase;width:70px;text-align:right}
.stat-bar-track{flex:1;height:8px;background:#E8E8F0;border-radius:4px;overflow:hidden}
.stat-bar-fill{height:100%;border-radius:4px}
.stat-bar-value{font-family:'Oswald',sans-serif;font-size:16px;font-weight:700;width:30px}
.finale-label{font-size:14px;font-weight:700;color:#737373;text-transform:uppercase;letter-spacing:.4px;margin-top:8px}
.pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.pill{padding:5px 12px;border-radius:16px;font-size:14px;font-weight:700;background:color-mix(in srgb, var(--pill-color) 12%, white);color:var(--pill-color);border:1.5px solid color-mix(in srgb, var(--pill-color) 30%, white)}
.pill-empty{background:#F5F5F5;color:#737373;border-color:#E0E0E0}
.finale-note{font-size:14px;margin-top:10px;color:#444;display:flex;align-items:center;gap:6px}
.finale-note svg{flex-shrink:0}
.next-box{margin-top:12px;padding:12px 16px;border-radius:12px;background:#F0FFF4;border:1.5px solid;font-size:14px;color:#2D5A1A;display:flex;align-items:center;gap:8px}
.comic-row{display:flex;align-items:flex-start;gap:12px;margin:10px 0}
.row-flip{flex-direction:row-reverse}
.char-col{text-align:center;flex-shrink:0;width:56px}
.char-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,0.08)}
.char-student{background:#E3ECFA;border:2px solid #B8CCE8;color:#1E4D8C}
.char-robot{background:#E3F5E3;border:2px solid #B8D8B8;color:#2D5A1A}
.char-name{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;color:#737373;margin-top:3px}
.balloon{flex:1;padding:16px 20px;border-radius:20px;font-size:15px;line-height:1.65;position:relative;word-wrap:break-word;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.balloon-q{background:#D6E4F5;border:2px solid #B8CCE8}
.balloon-a{background:#D6F0D6;border:2px solid #B8D8B8}
.balloon-content{position:relative;z-index:1}
.balloon-tail-svg{position:absolute;filter:drop-shadow(0 1px 1px rgba(0,0,0,0.05))}
.tail-left-svg{left:-14px;top:14px}
.tail-right-svg{right:-14px;top:14px}
.error-strip{display:flex;align-items:center;gap:8px;margin:6px 0 8px 68px;padding:10px 14px;background:#FFF3E0;border:2px solid #FFCC80;border-radius:12px;font-size:14px;color:#BF360C}
.error-icon{flex-shrink:0;color:#BF360C}
.panel-screenshot{text-align:center}
.screenshot-wrap{margin-top:8px}
.screenshot-img{max-width:100%;border-radius:12px;border:2px solid #E0E0E0}
.photo-slot{margin-top:12px;text-align:center}
.add-photo-btn{padding:8px 18px;border:2px dashed #B0BEC5;border-radius:10px;background:transparent;color:#607D8B;font-size:14px;font-family:'Open Sans',sans-serif;cursor:pointer;transition:.15s;display:inline-flex;align-items:center;gap:6px}
.add-photo-btn:hover{border-color:#1E4D8C;color:#1E4D8C;background:#F0F4F8}
.add-photo-btn svg{vertical-align:middle}
.photo-hint{display:block;font-size:14px;color:#737373;margin-top:2px}
.photo-container{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;justify-content:center}
.photo-container img{max-width:240px;max-height:180px;border-radius:12px;border:2px solid #E0E0E0;object-fit:cover}
.photo-wrapper{position:relative;display:inline-block}
.photo-caption{display:block;width:100%;padding:4px 8px;border:1px solid #E0E0E0;border-radius:6px;margin-top:4px;font-size:14px;font-family:'Open Sans',sans-serif;text-align:center;outline:none}
.photo-caption:focus{border-color:#1E4D8C}
.photo-remove{position:absolute;top:-6px;right:-6px;width:24px;height:24px;border-radius:50%;border:2px solid #fff;background:#D32F2F;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.2);padding:0;line-height:1}
.comp-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.comp-pill{padding:8px 16px;border-radius:12px;font-size:14px;font-weight:600;background:#F0F4F8;border:1.5px solid #D0D8E0;color:#1A1A2E}
.challenge-box{background:rgba(30,77,140,.06);border-radius:14px;padding:18px 22px;margin:8px 0}
.challenge-q{font-size:18px;font-weight:700;font-family:'Oswald',sans-serif;color:#1E4D8C;line-height:1.4}
.challenge-tip{font-size:14px;color:#555;margin-top:8px;font-style:italic;padding-left:12px;border-left:3px solid #D0D8E0}
.analogy-box{background:rgba(232,148,28,.08);border-radius:14px;padding:18px 22px;margin:8px 0}
.analogy-text{font-size:16px;color:#5D4037;line-height:1.6;font-weight:500}
.mistake-box{margin:8px 0}
.mistake-what{font-size:15px;color:#BF360C;margin-bottom:6px;padding:10px 14px;background:rgba(211,47,47,.06);border-radius:10px}
.mistake-fix{font-size:15px;color:#2E7D32;padding:10px 14px;background:rgba(46,125,50,.06);border-radius:10px}
.mistake-analogy{font-size:14px;color:#555;margin-top:6px;font-style:italic}
.exercise-box{background:rgba(74,122,37,.08);border-radius:14px;padding:18px 22px;margin:8px 0;border:2px dashed rgba(74,122,37,.3)}
.exercise-text{font-size:16px;color:#2D5A1A;line-height:1.6;font-weight:600}
.exercise-summary{font-size:15px;color:#444;margin:8px 0;line-height:1.5}
.footer{text-align:center;padding:20px 24px;border-top:2px solid #E8E8E8;font-size:14px;color:#555;background:#FAFBFE}
.footer a{color:#1E4D8C;text-decoration:none;font-weight:700}
.footer a:hover{text-decoration:underline}
</style>
</head>
<body>
<div class="toolbar no-print">
  <button class="tb tb-pr" onclick="window.print()">${SVG_PRINT} STAMPA / SALVA PDF</button>
  <button class="tb tb-photo" onclick="addPhotoGlobal()">${SVG_CAMERA} AGGIUNGI FOTO</button>
  <button class="tb tb-sc" onclick="addScreenshot()">${SVG_SCREENSHOT} SCREENSHOT</button>
  <button class="tb tb-sc" onclick="window.close()">${SVG_X} CHIUDI</button>
</div>
<div class="wrap">
  <div class="cover-page">
    <div class="cover-inner">
      <div class="cover-mascot">${SVG_ROBOT}</div>
      <h1 class="cover-h1">${esc(title)}</h1>
      <div class="cover-sub">Il Fumetto della Lezione</div>
      <div class="cover-meta">${date} · ${dur} · ${nMsg} messaggi</div>
      <div class="cover-badge">ELAB Tutor${volN ? ' — Volume ' + volN : ''}</div>
    </div>
  </div>
  <div class="stats">
    <div class="st"><div class="st-v">${dur}</div><div class="st-l">Durata</div></div>
    <div class="st"><div class="st-v">${nMsg}</div><div class="st-l">Domande</div></div>
    <div class="st"><div class="st-v">${nErr}</div><div class="st-l">${nErr === 1 ? 'Errore' : 'Errori'}</div></div>
    <div class="st"><div class="st-v">${concepts.length}</div><div class="st-l">Concetti</div></div>
  </div>
  ${screenshotHTML}
  <div class="comic-grid">
    ${scenesHTML}
  </div>
  <div class="footer">
    <a href="https://elabtutor.school">elabtutor.school</a> &mdash; ELAB Tutor &mdash; ${date}
  </div>
</div>
<script>
${photoScript(volCol, SVG_X)}
<\/script>
</body>
</html>`;
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Apre il fumetto e lancia STAMPA automaticamente.
 * Strategia: iframe fullscreen nella stessa pagina (no popup blocker).
 * Barra in alto con: STAMPA/PDF, Scarica HTML, Chiudi.
 */
export function openReportWindow(experimentId) {
  let session;
  if (experimentId) {
    const sessions = getSavedSessions();
    session = [...sessions].reverse().find(s => s.experimentId === experimentId);
  }
  if (!session) session = getLastSession();

  if (!session || (!session.messages?.length && !session.errors?.length && !session.actions?.length)) {
    return false;
  }

  const lessonPath = getLessonPath(session.experimentId);
  const screenshot = captureSimulatorScreenshot();
  const html = buildReportHTML(session, lessonPath, screenshot);
  const filename = `fumetto-elab-${session.experimentId || 'sessione'}`;

  try {
    // Rimuovi iframe precedente se esiste
    const old = document.getElementById('elab-report-frame');
    if (old) old.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'elab-report-frame';
    iframe.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;border:none;background:#fff;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Barra di controllo in cima (DOM methods, no innerHTML)
    const closeBar = doc.createElement('div');
    closeBar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:10000;background:#1E4D8C;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:8px 16px;font-family:Open Sans,sans-serif;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,.3);';

    const label = doc.createElement('span');
    label.style.fontWeight = '700';
    label.textContent = 'Anteprima Fumetto \u2014 Clicca STAMPA per salvare come PDF';
    closeBar.appendChild(label);

    const btnGroup = doc.createElement('span');
    btnGroup.style.cssText = 'display:flex;gap:8px;';

    const btnStyle = 'border:none;padding:8px 20px;border-radius:6px;font-size:15px;font-weight:700;cursor:pointer;min-height:44px;';

    const printBtn = doc.createElement('button');
    printBtn.style.cssText = btnStyle + 'background:#4A7A25;color:#fff;';
    printBtn.textContent = 'STAMPA / SALVA PDF';
    printBtn.addEventListener('click', () => iframe.contentWindow.print());
    btnGroup.appendChild(printBtn);

    const dlBtn = doc.createElement('button');
    dlBtn.style.cssText = btnStyle + 'background:#E8941C;color:#fff;font-weight:600;font-size:14px;';
    dlBtn.textContent = 'Scarica HTML';
    dlBtn.addEventListener('click', () => _downloadHTML(html, filename));
    btnGroup.appendChild(dlBtn);

    const closeBtn = doc.createElement('button');
    closeBtn.style.cssText = btnStyle + 'background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4);font-size:14px;font-weight:600;';
    closeBtn.textContent = 'Chiudi';
    closeBtn.addEventListener('click', () => iframe.remove());
    btnGroup.appendChild(closeBtn);

    closeBar.appendChild(btnGroup);
    doc.body.insertBefore(closeBar, doc.body.firstChild);
    doc.body.style.paddingTop = '56px';
    // Nascondi la toolbar originale del fumetto (duplicata dalla barra iframe)
    const origToolbar = doc.querySelector('.toolbar');
    if (origToolbar) origToolbar.style.display = 'none';

    // ESC per chiudere
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') iframe.remove(); });

    return true;
  } catch {
    _downloadHTML(html, filename);
    return 'downloaded';
  }
}

function _downloadHTML(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function isReportCommand(text) {
  if (!text) return false;
  const l = text.toLowerCase().trim();
  return [
    /^(crea|genera|fai|apri|mostra|stampa)\s+(il\s+)?(report|fumetto)$/,
    /^(report|fumetto)$/,
    /^(report|fumetto)\s+(della\s+)?(sessione|lezione)$/,
  ].some(p => p.test(l));
}
