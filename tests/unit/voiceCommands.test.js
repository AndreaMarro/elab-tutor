import { describe, it, expect, vi, beforeEach } from 'vitest';
import { matchVoiceCommand, executeVoiceCommand, getAvailableCommands } from '../../src/services/voiceCommands.js';

describe('voiceCommands', () => {
  beforeEach(() => {
    // Mock __ELAB_API
    window.__ELAB_API = {
      play: vi.fn(),
      pause: vi.fn(),
      reset: vi.fn(),
      nextStep: vi.fn(),
      prevStep: vi.fn(),
      showPanel: vi.fn(),
      compile: vi.fn(),
      getEditorCode: vi.fn(() => 'void setup() {} void loop() {}'),
    };
  });

  describe('matchVoiceCommand', () => {
    it('matches exact Italian commands', () => {
      expect(matchVoiceCommand('avvia')).toBeTruthy();
      expect(matchVoiceCommand('avvia').command.action).toBe('play');

      expect(matchVoiceCommand('ferma')).toBeTruthy();
      expect(matchVoiceCommand('ferma').command.action).toBe('stop');

      expect(matchVoiceCommand('prossimo')).toBeTruthy();
      expect(matchVoiceCommand('prossimo').command.action).toBe('nextStep');
    });

    it('matches English commands', () => {
      expect(matchVoiceCommand('play').command.action).toBe('play');
      expect(matchVoiceCommand('stop').command.action).toBe('stop');
      expect(matchVoiceCommand('next').command.action).toBe('nextStep');
    });

    it('matches multi-word patterns', () => {
      expect(matchVoiceCommand('fai partire').command.action).toBe('play');
      expect(matchVoiceCommand('mostra codice').command.action).toBe('showEditor');
      expect(matchVoiceCommand('monitor seriale').command.action).toBe('showSerial');
    });

    it('is case-insensitive', () => {
      expect(matchVoiceCommand('AVVIA').command.action).toBe('play');
      expect(matchVoiceCommand('Ferma').command.action).toBe('stop');
    });

    it('strips punctuation', () => {
      expect(matchVoiceCommand('avvia!').command.action).toBe('play');
      expect(matchVoiceCommand('ferma.').command.action).toBe('stop');
    });

    it('matches within longer phrases', () => {
      expect(matchVoiceCommand('per favore avvia la simulazione').command.action).toBe('play');
      expect(matchVoiceCommand('per favore mostra codice').command.action).toBe('showEditor');
    });

    it('returns null for unrecognized text', () => {
      expect(matchVoiceCommand('come funziona un resistore')).toBeNull();
      expect(matchVoiceCommand('cosa succede se collego il LED al contrario')).toBeNull();
    });

    it('does not match patterns inside other words (word boundary)', () => {
      // "play" should NOT match inside "display"
      expect(matchVoiceCommand('display')).toBeNull();
      // "fit" should NOT match inside "profitto"
      expect(matchVoiceCommand('profitto')).toBeNull();
      // "back" should NOT match inside "feedback"
      expect(matchVoiceCommand('feedback')).toBeNull();
      // "start" should NOT match inside "restart"
      expect(matchVoiceCommand('restart')).toBeNull();
    });

    it('handles accented Italian STT output', () => {
      // Italian STT sometimes returns accented variants
      expect(matchVoiceCommand('avvià').command.action).toBe('play');
      expect(matchVoiceCommand('indìetro').command.action).toBe('prevStep');
    });

    it('returns null for empty/short text', () => {
      expect(matchVoiceCommand('')).toBeNull();
      expect(matchVoiceCommand('a')).toBeNull();
      expect(matchVoiceCommand(null)).toBeNull();
    });
  });

  describe('executeVoiceCommand', () => {
    it('calls __ELAB_API.play for play command', () => {
      const match = matchVoiceCommand('avvia');
      const feedback = executeVoiceCommand(match.command);
      expect(window.__ELAB_API.play).toHaveBeenCalled();
      expect(feedback).toBe('Simulazione avviata!');
    });

    it('calls __ELAB_API.pause for stop command', () => {
      const match = matchVoiceCommand('ferma');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.pause).toHaveBeenCalled();
    });

    it('calls __ELAB_API.compile with editor code for compile command', () => {
      const match = matchVoiceCommand('compila');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.getEditorCode).toHaveBeenCalled();
      expect(window.__ELAB_API.compile).toHaveBeenCalledWith('void setup() {} void loop() {}');
    });

    it('returns feedback even when __ELAB_API is undefined', () => {
      delete window.__ELAB_API;
      const match = matchVoiceCommand('avvia');
      const feedback = executeVoiceCommand(match.command);
      expect(feedback).toBe('Simulazione avviata!');
    });

    it('returns fallback feedback on error', () => {
      window.__ELAB_API.play = () => { throw new Error('test'); };
      const match = matchVoiceCommand('play');
      const feedback = executeVoiceCommand(match.command);
      expect(feedback).toBe('Comando non riuscito.');
    });
  });

  describe('getAvailableCommands', () => {
    it('returns all commands with action, patterns, feedback', () => {
      const cmds = getAvailableCommands();
      expect(cmds.length).toBeGreaterThan(5);
      for (const cmd of cmds) {
        expect(cmd.action).toBeTruthy();
        expect(cmd.patterns.length).toBeGreaterThan(0);
        expect(cmd.feedback).toBeTruthy();
      }
    });

    it('has at least 24 unique commands', () => {
      const cmds = getAvailableCommands();
      expect(cmds.length).toBeGreaterThanOrEqual(24);
    });

    it('has no duplicate actions', () => {
      const cmds = getAvailableCommands();
      const actions = cmds.map(c => c.action);
      expect(new Set(actions).size).toBe(actions.length);
    });
  });

  describe('UNLIM Onnipotente commands', () => {
    beforeEach(() => {
      window.__ELAB_API = {
        addComponent: vi.fn(),
        clearCircuit: vi.fn(),
        getCircuitDescription: vi.fn(() => '2 LED, 1 resistore'),
        undo: vi.fn(),
        redo: vi.fn(),
        mountExperiment: vi.fn(),
        setBuildMode: vi.fn(),
        getExperimentList: vi.fn(() => ({
          vol1: [{ id: 'v1-cap6-esp1', title: 'Accendi il tuo primo LED' }],
          vol3: [{ id: 'v3-cap6-semaforo', title: 'Il semaforo' }],
        })),
      };
    });

    it('addLed calls addComponent', () => {
      const match = matchVoiceCommand('aggiungi led');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.addComponent).toHaveBeenCalledWith('led');
    });

    it('addResistor calls addComponent', () => {
      const match = matchVoiceCommand('metti resistore');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.addComponent).toHaveBeenCalledWith('resistor');
    });

    it('clearCircuit calls clearCircuit', () => {
      const match = matchVoiceCommand('pulisci tutto');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.clearCircuit).toHaveBeenCalled();
    });

    it('describeCircuit returns circuit description', () => {
      const match = matchVoiceCommand('descrivi circuito');
      const feedback = executeVoiceCommand(match.command);
      expect(feedback).toBe('2 LED, 1 resistore');
    });

    it('undo calls undo', () => {
      const match = matchVoiceCommand('annulla');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.undo).toHaveBeenCalled();
    });

    it('redo calls redo', () => {
      const match = matchVoiceCommand('ripeti');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.redo).toHaveBeenCalled();
    });

    it('mountExpSemafor finds semaforo experiment', () => {
      const match = matchVoiceCommand('monta semaforo');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.mountExperiment).toHaveBeenCalledWith('v3-cap6-semaforo');
    });

    it('sandbox mode sets build mode', () => {
      const match = matchVoiceCommand('sandbox');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.setBuildMode).toHaveBeenCalledWith('sandbox');
    });

    it('guided mode sets build mode', () => {
      const match = matchVoiceCommand('passo passo');
      executeVoiceCommand(match.command);
      expect(window.__ELAB_API.setBuildMode).toHaveBeenCalledWith('guided');
    });
  });
});
