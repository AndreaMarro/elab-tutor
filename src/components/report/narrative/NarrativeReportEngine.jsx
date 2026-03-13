/**
 * NarrativeReportEngine — Motore di generazione report narrativi ELAB
 * Design fedele ai 3 volumi ELAB con colori, font e stile coerenti
 * Target: ragazzi 10-13 anni con metafore e storytelling
 */

import {
  STORY_THEMES,
  COMPONENT_STORIES,
  EXERCISE_TEMPLATES,
  ACHIEVEMENTS,
  getRandomTheme,
  getComponentStory,
  getExercises,
  getAchievements,
  getEncouragement
} from './NarrativeStoryDatabase.js';

let P = null;

// Colori fedeli ai volumi ELAB
const ELAB_COLORS = {
  navy: '#1E4D8C',
  lime: '#7CB342',      // Volume 1
  orange: '#E8941C',    // Volume 2
  red: '#E54B3C',       // Volume 3
  white: '#FFFFFF',
  offwhite: '#FAFAFA',
  lightGray: '#F5F5F5',
  gray: '#9E9E9E',
  darkGray: '#424242',
  black: '#212121'
};

// Font coerenti con i volumi
const ELAB_FONTS = {
  heading: 'Oswald',
  body: 'OpenSans',
  code: 'FiraCode'
};

async function loadRenderer() {
  if (!P) {
    P = await import('@react-pdf/renderer');
    
    // Registra font professionali
    P.Font.register({
      family: 'Oswald',
      fonts: [
        { src: '/fonts/Oswald-Bold.ttf', fontWeight: 700 },
        { src: '/fonts/Oswald-Regular.ttf', fontWeight: 400 },
        { src: '/fonts/Oswald-Light.ttf', fontWeight: 300 },
      ],
    });
    
    P.Font.register({
      family: 'OpenSans',
      fonts: [
        { src: '/fonts/OpenSans-Regular.ttf', fontWeight: 400 },
        { src: '/fonts/OpenSans-Bold.ttf', fontWeight: 700 },
        { src: '/fonts/OpenSans-Italic.ttf', fontStyle: 'italic' },
        { src: '/fonts/OpenSans-Light.ttf', fontWeight: 300 },
      ],
    });
    
    P.Font.register({
      family: 'FiraCode',
      src: '/fonts/FiraCode-Regular.ttf',
    });
  }
  return P;
}

// Helper per ottenere il colore del volume
function getVolumeColor(volumeNumber) {
  switch(volumeNumber) {
    case 1: return ELAB_COLORS.lime;
    case 2: return ELAB_COLORS.orange;
    case 3: return ELAB_COLORS.red;
    default: return ELAB_COLORS.lime;
  }
}

export async function generateNarrativeReport(sessionData, circuitScreenshot, options = {}) {
  const R = await loadRenderer();
  const { 
    theme = getRandomTheme(), 
    includeExercises = true,
    includeAchievements = true,
    includeStory = true,
    volumeNumber = 1
  } = options;
  
  const volColor = getVolumeColor(volumeNumber);
  const storyTheme = STORY_THEMES[theme];
  const watermark = `ELAB Volumi — Volume ${volumeNumber} — ${new Date().toLocaleDateString('it-IT')}`;
  
  // Raccolta dati
  const exp = sessionData.experiment;
  const components = sessionData.components || exp?.components || [];
  const achievements = includeAchievements ? getAchievements(sessionData) : [];
  const exercises = includeExercises ? getExercises(3, 'mixed') : [];
  
  // Stili coerenti con i volumi
  const styles = R.StyleSheet.create({
    // Page layout
    page: {
      fontFamily: ELAB_FONTS.body,
      fontSize: 11,
      color: ELAB_COLORS.darkGray,
      paddingTop: 50,
      paddingBottom: 70,
      paddingHorizontal: 45,
      backgroundColor: ELAB_COLORS.white
    },
    
    // Header con banda colore volume
    headerBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 12,
      backgroundColor: volColor
    },
    
    // Footer stile volume
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 45,
      borderTopWidth: 4,
      borderTopColor: volColor,
      backgroundColor: ELAB_COLORS.offwhite
    },
    
    footerLeft: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    
    footerLogo: {
      width: 30,
      height: 30,
      marginRight: 10,
      backgroundColor: ELAB_COLORS.navy,
      borderRadius: 4
    },
    
    footerText: {
      fontSize: 9,
      color: ELAB_COLORS.gray,
      fontFamily: ELAB_FONTS.body
    },
    
    footerRight: {
      fontSize: 9,
      color: ELAB_COLORS.gray,
      fontFamily: ELAB_FONTS.code
    },
    
    // Cover page
    coverContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60
    },
    
    coverBadge: {
      backgroundColor: volColor,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 30
    },
    
    coverBadgeText: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 12,
      fontWeight: 700,
      color: ELAB_COLORS.white,
      textTransform: 'uppercase',
      letterSpacing: 2
    },
    
    coverTitle: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 36,
      fontWeight: 700,
      color: ELAB_COLORS.navy,
      textAlign: 'center',
      marginBottom: 10,
      lineHeight: 1.2
    },
    
    coverSubtitle: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 22,
      fontWeight: 400,
      color: volColor,
      textAlign: 'center',
      marginBottom: 40
    },
    
    coverMeta: {
      fontSize: 11,
      color: ELAB_COLORS.gray,
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: ELAB_FONTS.body
    },
    
    coverDuration: {
      fontSize: 14,
      fontWeight: 700,
      color: ELAB_COLORS.navy,
      textAlign: 'center',
      marginTop: 20,
      padding: 12,
      backgroundColor: ELAB_COLORS.lightGray,
      borderRadius: 8
    },
    
    // Story box
    storyBox: {
      backgroundColor: `${volColor}15`,
      borderLeftWidth: 5,
      borderLeftColor: volColor,
      padding: 20,
      marginVertical: 15,
      borderRadius: 4
    },
    
    storyTitle: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 14,
      fontWeight: 700,
      color: ELAB_COLORS.navy,
      marginBottom: 8
    },
    
    storyText: {
      fontSize: 11,
      lineHeight: 1.7,
      color: ELAB_COLORS.darkGray,
      marginBottom: 6
    },
    
    // Section headers
    sectionTitle: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 24,
      fontWeight: 700,
      color: ELAB_COLORS.navy,
      marginBottom: 15,
      marginTop: 10,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: volColor
    },
    
    sectionSubtitle: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 16,
      fontWeight: 700,
      color: volColor,
      marginBottom: 10,
      marginTop: 15
    },
    
    // Content text
    paragraph: {
      fontSize: 11,
      lineHeight: 1.7,
      color: ELAB_COLORS.darkGray,
      marginBottom: 12,
      textAlign: 'justify'
    },
    
    highlight: {
      fontSize: 11,
      lineHeight: 1.7,
      color: volColor,
      fontWeight: 700
    },
    
    // Circuit image
    circuitContainer: {
      marginVertical: 20,
      padding: 15,
      backgroundColor: ELAB_COLORS.offwhite,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0'
    },
    
    circuitImage: {
      width: '100%',
      maxHeight: 380,
      objectFit: 'contain'
    },
    
    circuitCaption: {
      fontSize: 10,
      color: ELAB_COLORS.gray,
      textAlign: 'center',
      marginTop: 10,
      fontStyle: 'italic'
    },
    
    // Success/Encourage boxes
    successBox: {
      backgroundColor: '#E8F5E9',
      borderWidth: 1,
      borderColor: '#4CAF50',
      borderLeftWidth: 5,
      padding: 15,
      marginVertical: 12,
      borderRadius: 6
    },
    
    encourageBox: {
      backgroundColor: '#FFF8E1',
      borderWidth: 1,
      borderColor: '#FFB300',
      borderLeftWidth: 5,
      padding: 15,
      marginVertical: 12,
      borderRadius: 6
    },
    
    infoBox: {
      backgroundColor: '#E3F2FD',
      borderWidth: 1,
      borderColor: '#2196F3',
      borderLeftWidth: 5,
      padding: 15,
      marginVertical: 12,
      borderRadius: 6
    },
    
    boxEmoji: {
      fontSize: 24,
      marginBottom: 8
    },
    
    boxText: {
      fontSize: 11,
      lineHeight: 1.6,
      color: ELAB_COLORS.darkGray
    },
    
    // Component cards
    componentGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginVertical: 15
    },
    
    componentCard: {
      width: '48%',
      backgroundColor: ELAB_COLORS.offwhite,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0'
    },
    
    componentEmoji: {
      fontSize: 28,
      textAlign: 'center',
      marginBottom: 8
    },
    
    componentName: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 11,
      fontWeight: 700,
      color: ELAB_COLORS.navy,
      textAlign: 'center',
      marginBottom: 4
    },
    
    componentStory: {
      fontSize: 9,
      color: ELAB_COLORS.gray,
      textAlign: 'center',
      lineHeight: 1.4
    },
    
    // Exercise cards
    exerciseCard: {
      backgroundColor: ELAB_COLORS.white,
      borderWidth: 2,
      borderColor: volColor,
      borderRadius: 10,
      padding: 18,
      marginVertical: 12
    },
    
    exerciseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10
    },
    
    exerciseIcon: {
      fontSize: 24,
      marginRight: 10
    },
    
    exerciseType: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 10,
      fontWeight: 700,
      color: volColor,
      textTransform: 'uppercase',
      letterSpacing: 1
    },
    
    exerciseTitle: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 14,
      fontWeight: 700,
      color: ELAB_COLORS.navy,
      marginBottom: 8
    },
    
    exerciseText: {
      fontSize: 10,
      lineHeight: 1.6,
      color: ELAB_COLORS.darkGray,
      marginBottom: 10
    },
    
    exerciseOption: {
      fontSize: 10,
      paddingVertical: 5,
      paddingLeft: 15,
      borderLeftWidth: 2,
      borderLeftColor: '#E0E0E0',
      marginVertical: 3
    },
    
    // Achievements
    achievementRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: ELAB_COLORS.offwhite,
      borderRadius: 8,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: '#E0E0E0'
    },
    
    achievementEmoji: {
      fontSize: 28,
      marginRight: 12
    },
    
    achievementName: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 12,
      fontWeight: 700,
      color: ELAB_COLORS.navy
    },
    
    achievementDesc: {
      fontSize: 9,
      color: ELAB_COLORS.gray
    },
    
    // Fun fact box
    funFactBox: {
      backgroundColor: `${ELAB_COLORS.navy}10`,
      borderWidth: 1,
      borderColor: ELAB_COLORS.navy,
      borderRadius: 8,
      padding: 15,
      marginVertical: 15
    },
    
    funFactLabel: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 10,
      fontWeight: 700,
      color: ELAB_COLORS.navy,
      marginBottom: 6,
      textTransform: 'uppercase'
    },
    
    funFactText: {
      fontSize: 10,
      fontStyle: 'italic',
      color: ELAB_COLORS.darkGray,
      lineHeight: 1.5
    },
    
    // Timeline
    timelineContainer: {
      marginVertical: 15
    },
    
    timelineItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      paddingLeft: 20,
      borderLeftWidth: 2,
      borderLeftColor: volColor
    },
    
    timelineTime: {
      width: 50,
      fontSize: 9,
      color: ELAB_COLORS.gray,
      fontFamily: ELAB_FONTS.code
    },
    
    timelineIcon: {
      fontSize: 14,
      marginHorizontal: 8
    },
    
    timelineText: {
      flex: 1,
      fontSize: 10,
      color: ELAB_COLORS.darkGray,
      lineHeight: 1.5
    },
    
    // Code block
    codeBlock: {
      backgroundColor: '#263238',
      padding: 15,
      borderRadius: 8,
      marginVertical: 12
    },
    
    codeText: {
      fontFamily: ELAB_FONTS.code,
      fontSize: 8,
      color: '#AED581',
      lineHeight: 1.6
    },
    
    // Quote box
    quoteBox: {
      backgroundColor: ELAB_COLORS.offwhite,
      borderLeftWidth: 4,
      borderLeftColor: volColor,
      padding: 20,
      marginVertical: 20,
      borderRadius: 4
    },
    
    quoteText: {
      fontSize: 14,
      fontStyle: 'italic',
      color: ELAB_COLORS.navy,
      lineHeight: 1.6,
      textAlign: 'center'
    },
    
    quoteAuthor: {
      fontSize: 10,
      color: ELAB_COLORS.gray,
      textAlign: 'right',
      marginTop: 10
    },
    
    // Final page
    finalPage: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 100
    },
    
    finalEmoji: {
      fontSize: 72,
      marginBottom: 30
    },
    
    finalTitle: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 28,
      fontWeight: 700,
      color: ELAB_COLORS.navy,
      textAlign: 'center',
      marginBottom: 15
    },
    
    finalText: {
      fontSize: 12,
      color: ELAB_COLORS.gray,
      textAlign: 'center',
      lineHeight: 1.8,
      maxWidth: 400
    },
    
    nextStepBox: {
      backgroundColor: volColor,
      padding: 20,
      borderRadius: 10,
      marginTop: 30,
      width: '80%'
    },
    
    nextStepText: {
      fontFamily: ELAB_FONTS.heading,
      fontSize: 12,
      fontWeight: 700,
      color: ELAB_COLORS.white,
      textAlign: 'center'
    }
  });
  
  // Componente wrapper per le pagine
  const PageWrap = ({ children, style = {} }) => (
    <R.Page size="A4" style={[styles.page, style]}>
      <R.View style={styles.headerBar} fixed />
      {children}
      <R.View style={styles.footer} fixed>
        <R.View style={styles.footerLeft}>
          <R.View style={styles.footerLogo} />
          <R.Text style={styles.footerText}>ELAB Volumi — Volume {volumeNumber}</R.Text>
        </R.View>
        <R.Text style={styles.footerRight} render={({ pageNumber, totalPages }) => 
          `${pageNumber} / ${totalPages}`
        } />
      </R.View>
    </R.Page>
  );
  
  const pages = [];
  
  // === PAGINA 1: COPERTINA ===
  pages.push(
    <PageWrap key="cover">
      <R.View style={styles.coverContainer}>
        <R.View style={styles.coverBadge}>
          <R.Text style={styles.coverBadgeText}>Volume {volumeNumber}</R.Text>
        </R.View>
        
        <R.Text style={styles.coverTitle}>
          {storyTheme.intro}
        </R.Text>
        
        <R.Text style={styles.coverSubtitle}>
          {exp?.title || 'Esperimento ELAB'}
        </R.Text>
        
        <R.Text style={styles.coverMeta}>
          {sessionData.sessionDate} — Ore {sessionData.sessionTime}
        </R.Text>
        
        <R.Text style={styles.coverMeta}>
          {sessionData.studentName || 'Giovane Inventore'}
        </R.Text>
        
        <R.Text style={styles.coverDuration}>
          ⏱️ Durata: {sessionData.duration} minuti di avventura!
        </R.Text>
        
        {includeStory && (
          <R.View style={{ marginTop: 40, maxWidth: 400 }}>
            <R.Text style={{ ...styles.paragraph, textAlign: 'center', fontStyle: 'italic' }}>
              "{storyTheme.metaphor}"
            </R.Text>
          </R.View>
        )}
      </R.View>
    </PageWrap>
  );
  
  // === PAGINA 2: LA STORIA ===
  if (includeStory) {
    pages.push(
      <PageWrap key="story">
        <R.Text style={styles.sectionTitle}>📖 La Tua Avventura</R.Text>
        
        <R.View style={styles.storyBox}>
          <R.Text style={styles.storyTitle}>Benvenuto, Esploratore!</R.Text>
          <R.Text style={styles.storyText}>
            {storyTheme.intro} Oggi hai intrapreso una missione speciale: {exp?.title}.
          </R.Text>
          <R.Text style={styles.storyText}>
            {storyTheme.metaphor}
          </R.Text>
        </R.View>
        
        <R.Text style={styles.paragraph}>
          {storyTheme.energy}
        </R.Text>
        
        <R.View style={styles.infoBox}>
          <R.Text style={styles.boxEmoji}>🎯</R.Text>
          <R.Text style={styles.boxText}>
            <R.Text style={{ fontWeight: 700 }}>La tua missione: </R.Text>
            {exp?.desc || 'Esplora il circuito e scopri i suoi segreti!'}
          </R.Text>
        </R.View>
        
        {exp?.concept && (
          <R.View style={styles.funFactBox}>
            <R.Text style={styles.funFactLabel}>💡 Concetto Chiave</R.Text>
            <R.Text style={styles.funFactText}>{exp.concept}</R.Text>
          </R.View>
        )}
        
        <R.View style={styles.quoteBox}>
          <R.Text style={styles.quoteText}>
            "{storyTheme.energy}"
          </R.Text>
          <R.Text style={styles.quoteAuthor}>— UNLIM, il Tutor Digitale</R.Text>
        </R.View>
      </PageWrap>
    );
  }
  
  // === PAGINA 3: I PERSONAGGI (COMPONENTI) ===
  if (components.length > 0) {
    pages.push(
      <PageWrap key="components">
        <R.Text style={styles.sectionTitle}>🎭 I Personaggi del Circuito</R.Text>
        
        <R.Text style={styles.paragraph}>
          Ogni componente nel tuo circuito ha una storia speciale e un superpotere unico. 
          Eccoli tutti, pronti per l'avventura:
        </R.Text>
        
        <R.View style={styles.componentGrid}>
          {components.map((comp, idx) => {
            const story = getComponentStory(comp.type);
            return (
              <R.View key={idx} style={styles.componentCard}>
                <R.Text style={styles.componentEmoji}>{story.emoji}</R.Text>
                <R.Text style={styles.componentName}>{story.name}</R.Text>
                <R.Text style={styles.componentStory}>{story.story}</R.Text>
              </R.View>
            );
          })}
        </R.View>
        
        <R.View style={styles.funFactBox}>
          <R.Text style={styles.funFactLabel}>🤔 Lo sapevi che?</R.Text>
          <R.Text style={styles.funFactText}>
            {getComponentStory(components[0]?.type).funFact}
          </R.Text>
        </R.View>
      </PageWrap>
    );
  }
  
  // === PAGINA 4: IL CIRCUITO ===
  pages.push(
    <PageWrap key="circuit">
      <R.Text style={styles.sectionTitle}>🔌 Il Tuo Capolavoro</R.Text>
      
      <R.Text style={styles.paragraph}>
        Ecco il circuito che hai costruito con le tue mani! Ogni filo, ogni componente, 
        ogni connessione è frutto del tuo lavoro. Guarda che bel risultato!
      </R.Text>
      
      <R.View style={styles.circuitContainer}>
        {circuitScreenshot ? (
          <>
            <R.Image src={circuitScreenshot} style={styles.circuitImage} />
            <R.Text style={styles.circuitCaption}>
              Screenshot del tuo circuito — {new Date().toLocaleDateString('it-IT')}
            </R.Text>
          </>
        ) : (
          <R.Text style={{ textAlign: 'center', color: ELAB_COLORS.gray, padding: 40 }}>
            🎨 Spazio per lo schema del circuito
          </R.Text>
        )}
      </R.View>
      
      {sessionData.isCircuitComplete ? (
        <R.View style={styles.successBox}>
          <R.Text style={styles.boxEmoji}>🏆</R.Text>
          <R.Text style={styles.boxText}>
            <R.Text style={{ fontWeight: 700 }}>{storyTheme.success}</R.Text>
            {'\n\n'}
            Hai completato tutti i collegamenti e il circuito funziona perfettamente! 
            Sei pronto per la prossima sfida.
          </R.Text>
        </R.View>
      ) : (
        <R.View style={styles.encourageBox}>
          <R.Text style={styles.boxEmoji}>💪</R.Text>
          <R.Text style={styles.boxText}>
            <R.Text style={{ fontWeight: 700 }}>{storyTheme.encouragement}</R.Text>
            {'\n\n'}
            Hai completato {sessionData.buildProgress?.current || 'alcuni'} passi su {sessionData.buildProgress?.total || 'tutti'}. 
            Continua così, stai andando alla grande!
          </R.Text>
        </R.View>
      )}
    </PageWrap>
  );
  
  // === PAGINA 5: ESERCIZI ===
  if (includeExercises && exercises.length > 0) {
    pages.push(
      <PageWrap key="exercises">
        <R.Text style={styles.sectionTitle}>🎮 Sfide e Quiz</R.Text>
        
        <R.Text style={styles.paragraph}>
          Metti alla prova quello che hai imparato oggi! Queste sfide ti aiuteranno 
          a diventare un vero esperto di elettronica.
        </R.Text>
        
        {exercises.map((ex, idx) => (
          <R.View key={idx} style={styles.exerciseCard}>
            <R.View style={styles.exerciseHeader}>
              <R.Text style={styles.exerciseIcon}>
                {ex.type === 'quiz' ? '❓' : ex.type === 'challenge' ? '🎯' : '✏️'}
              </R.Text>
              <R.Text style={styles.exerciseType}>
                {ex.type === 'quiz' ? 'Quiz' : ex.type === 'challenge' ? 'Sfida' : 'Creativo'}
              </R.Text>
            </R.View>
            
            <R.Text style={styles.exerciseTitle}>{ex.question || ex.title}</R.Text>
            
            {ex.description && (
              <R.Text style={styles.exerciseText}>{ex.description}</R.Text>
            )}
            
            {ex.options && ex.options.map((opt, oidx) => (
              <R.Text key={oidx} style={styles.exerciseOption}>
                {String.fromCharCode(65 + oidx)}) {opt}
              </R.Text>
            ))}
            
            {ex.explanation && (
              <R.Text style={{ ...styles.exerciseText, fontStyle: 'italic', color: volColor, marginTop: 10 }}>
                💡 {ex.explanation}
              </R.Text>
            )}
          </R.View>
        ))}
      </PageWrap>
    );
  }
  
  // === PAGINA 6: RISULTATI E TIMELINE ===
  if (sessionData.timeline && sessionData.timeline.length > 0) {
    pages.push(
      <PageWrap key="timeline">
        <R.Text style={styles.sectionTitle}>⏱️ Cronologia dell'Avventura</R.Text>
        
        <R.Text style={styles.paragraph}>
          Ecco tutto quello che hai fatto durante la tua sessione. Ogni azione, ogni scoperta, 
          ogni momento di successo:
        </R.Text>
        
        <R.View style={styles.timelineContainer}>
          {sessionData.timeline.slice(0, 20).map((event, idx) => {
            const eventIcons = {
              'experiment_loaded': '📋',
              'simulation_started': '▶️',
              'simulation_stopped': '⏸️',
              'code_compiled': '⚙️',
              'component_placed': '🔧',
              'wire_connected': '🔌',
              'quiz_answered': '❓',
              'error_occurred': '⚠️'
            };
            
            const eventLabels = {
              'experiment_loaded': 'Esperimento caricato',
              'simulation_started': 'Simulazione avviata',
              'simulation_stopped': 'Simulazione fermata',
              'code_compiled': 'Codice compilato',
              'component_placed': 'Componente aggiunto',
              'wire_connected': 'Filo collegato',
              'quiz_answered': 'Quiz completato',
              'error_occurred': 'Errore corretto'
            };
            
            const formatTime = (ms) => {
              const mins = Math.floor(ms / 60000);
              const secs = Math.floor((ms % 60000) / 1000);
              return `${mins}:${secs.toString().padStart(2, '0')}`;
            };
            
            return (
              <R.View key={idx} style={styles.timelineItem}>
                <R.Text style={styles.timelineTime}>{formatTime(event.elapsed)}</R.Text>
                <R.Text style={styles.timelineIcon}>{eventIcons[event.type] || '•'}</R.Text>
                <R.Text style={styles.timelineText}>
                  {eventLabels[event.type] || event.type}
                  {event.experimentName ? `: ${event.experimentName}` : ''}
                </R.Text>
              </R.View>
            );
          })}
        </R.View>
        
        {sessionData.timeline.length > 20 && (
          <R.Text style={{ ...styles.paragraph, fontStyle: 'italic', color: ELAB_COLORS.gray }}>
            ... e altri {sessionData.timeline.length - 20} eventi
          </R.Text>
        )}
      </PageWrap>
    );
  }
  
  // === PAGINA 7: ACHIEVEMENTS ===
  if (includeAchievements && achievements.length > 0) {
    pages.push(
      <PageWrap key="achievements">
        <R.Text style={styles.sectionTitle}>🏅 I Tuoi Trofei</R.Text>
        
        <R.Text style={styles.paragraph}>
          Durante questa avventura hai conquistato questi traguardi speciali. 
          Complimenti, sei una vera star!
        </R.Text>
        
        {achievements.map((ach, idx) => (
          <R.View key={idx} style={styles.achievementRow}>
            <R.Text style={styles.achievementEmoji}>{ach.emoji}</R.Text>
            <R.View>
              <R.Text style={styles.achievementName}>{ach.name}</R.Text>
              <R.Text style={styles.achievementDesc}>{ach.desc}</R.Text>
            </R.View>
          </R.View>
        ))}
        
        <R.View style={{ marginTop: 30, padding: 20, backgroundColor: `${volColor}10`, borderRadius: 10 }}>
          <R.Text style={{ textAlign: 'center', fontSize: 14, color: ELAB_COLORS.navy, fontWeight: 700 }}>
            🎉 Complimenti! Hai sbloccato {achievements.length} trofei!
          </R.Text>
        </R.View>
      </PageWrap>
    );
  }
  
  // === PAGINA FINALE: CONCLUSIONE ===
  pages.push(
    <PageWrap key="final">
      <R.View style={styles.finalPage}>
        <R.Text style={styles.finalEmoji}>
          {sessionData.isCircuitComplete ? '🏆' : sessionData.buildProgress?.current > 0 ? '⭐' : '🌟'}
        </R.Text>
        
        <R.Text style={styles.finalTitle}>
          {getEncouragement(
            sessionData.quizResults?.score || 0,
            sessionData.quizResults?.total || 1
          )}
        </R.Text>
        
        <R.Text style={styles.finalText}>
          Hai completato l'esperimento "{exp?.title}" in {sessionData.duration} minuti.{'\n\n'}
          {sessionData.isCircuitComplete 
            ? 'Il circuito funziona perfettamente e hai dimostrato di essere un vero esperto!'
            : 'Hai fatto grandi progressi e imparato tantissimo. Continua così!'
          }
        </R.Text>
        
        <R.View style={styles.nextStepBox}>
          <R.Text style={styles.nextStepText}>
            🚀 Prossima missione: Prova l'esperimento successivo!
          </R.Text>
        </R.View>
        
        <R.Text style={{ ...styles.finalText, marginTop: 40, fontSize: 10 }}>
          Generato con ELAB Tutor — Volume {volumeNumber}{'\n'}
          elabtutor.school
        </R.Text>
      </R.View>
    </PageWrap>
  );
  
  // Genera PDF
  const doc = (
    <R.Document 
      title={`${exp?.title || 'Report'} — ELAB Volume ${volumeNumber}`}
      author="ELAB Tutor"
      subject={`Report narrativo sessione ${sessionData.sessionDate}`}
    >
      {pages}
    </R.Document>
  );
  
  const blob = await R.pdf(doc).toBlob();
  const filename = `ELAB-Volume${volumeNumber}-${exp?.id || 'report'}-${new Date().toISOString().slice(0, 10)}.pdf`;
  
  return { blob, filename, pageCount: pages.length };
}

export default generateNarrativeReport;
