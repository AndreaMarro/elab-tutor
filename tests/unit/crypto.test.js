// ============================================
// ELAB Tutor - Test Unitari Crypto
// AES-256-GCM encryption/decryption
// © Andrea Marro — 15/02/2026
// ============================================

import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { mockLocalStorage } from '../setup';

// The crypto tests need the REAL Web Crypto API (not the mocked one from setup.js)
// because encrypt/decrypt round-trips require actual AES-GCM operations.
// We dynamically import the module AFTER restoring real crypto.

let encrypt, decrypt, setEncryptedItem, getEncryptedItem, removeEncryptedItem;
let getOrCreateMasterKey, clearAllSensitiveData;
let saveConfusioneLog, loadConfusioneLog, saveStudentProgress, loadStudentProgress;

// Save the mock and restore real crypto for these tests
const realCrypto = globalThis.crypto; // Node's built-in WebCrypto
let savedCrypto;

beforeAll(async () => {
    // The setup.js already replaced window.crypto with a mock.
    // We need the real one for actual encryption. Node 18+ provides crypto globally.
    savedCrypto = window.crypto;

    // Use Node's built-in WebCrypto API
    const nodeCrypto = await import('node:crypto');
    Object.defineProperty(window, 'crypto', {
        value: nodeCrypto.webcrypto || nodeCrypto.default.webcrypto,
        configurable: true,
    });

    // Reset module cache so crypto.js picks up the real crypto
    vi.resetModules();

    // Now dynamically import the crypto module so it picks up real crypto
    const mod = await import('../../src/utils/crypto');
    // In crypto.js, exports are in mod.default
    const modObj = mod.default || mod;

    encrypt = modObj.encrypt;
    decrypt = modObj.decrypt;
    setEncryptedItem = modObj.setEncryptedItem;
    getEncryptedItem = modObj.getEncryptedItem;
    removeEncryptedItem = modObj.removeEncryptedItem;
    getOrCreateMasterKey = modObj.getOrCreateMasterKey;
    clearAllSensitiveData = modObj.clearAllSensitiveData;
    saveConfusioneLog = modObj.saveConfusioneLog;
    loadConfusioneLog = modObj.loadConfusioneLog;
    saveStudentProgress = modObj.saveStudentProgress;
    loadStudentProgress = modObj.loadStudentProgress;
});

afterAll(() => {
    // Restore the mocked crypto so other tests are not affected
    if (savedCrypto) {
        Object.defineProperty(window, 'crypto', {
            value: savedCrypto,
            configurable: true,
        });
    }
});

describe('Crypto Service', () => {
    const masterPassword = 'test-master-key-123';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ============================================
    // TEST ENCRYPT/DECRYPT
    // ============================================

    describe('encrypt/decrypt', () => {
        it('dovrebbe cifrare e decifrare dati correttamente', async () => {
            const testData = { name: 'Mario', age: 10, scores: [1, 2, 3] };

            const encrypted = await encrypt(testData, masterPassword);

            // Verifica struttura cifrata
            expect(encrypted).toHaveProperty('encrypted');
            expect(encrypted).toHaveProperty('iv');
            expect(encrypted).toHaveProperty('salt');
            expect(encrypted).toHaveProperty('tag');
            expect(encrypted).toHaveProperty('version', '1');
            expect(encrypted).toHaveProperty('algorithm', 'AES-256-GCM');

            // Verifica che sia base64 valido
            expect(encrypted.encrypted).toMatch(/^[A-Za-z0-9+/=]+$/);
            expect(encrypted.iv).toMatch(/^[A-Za-z0-9+/=]+$/);
            expect(encrypted.salt).toMatch(/^[A-Za-z0-9+/=]+$/);
            expect(encrypted.tag).toMatch(/^[A-Za-z0-9+/=]+$/);
        });

        it('dovrebbe decifrare dati cifrati correttamente', async () => {
            const testData = {
                confusioneLog: [
                    { timestamp: '2026-02-15', mood: 'confused', level: 3 }
                ],
                studentId: 'student_123'
            };

            const encrypted = await encrypt(testData, masterPassword);
            const decrypted = await decrypt(encrypted, masterPassword);

            expect(decrypted).toEqual(testData);
        });

        it('dovrebbe fallire con password sbagliata', async () => {
            const testData = { secret: 'informazione sensibile' };

            const encrypted = await encrypt(testData, masterPassword);

            await expect(
                decrypt(encrypted, 'wrong-password')
            ).rejects.toThrow('Password errata o dati corrotti');
        });

        it('dovrebbe fallire con dati corrotti', async () => {
            const corruptedData = {
                encrypted: 'invalid-base64!!!',
                iv: 'dGVzdGl2',
                salt: 'dGVzdHNhbHQ=',
                tag: 'dGVzdHRhZw==',
            };

            await expect(
                decrypt(corruptedData, masterPassword)
            ).rejects.toThrow();
        });

        it('dovrebbe cifrare dati sensibili (confusioneLog)', async () => {
            const sensitiveData = {
                confusioneLog: [
                    { timestamp: '2026-02-15T10:00:00Z', mood: 'confused', difficulty: 'high' },
                    { timestamp: '2026-02-15T11:30:00Z', mood: 'frustrated', difficulty: 'medium' },
                ],
                emotionalStates: ['happy', 'confused', 'excited'],
            };

            const encrypted = await encrypt(sensitiveData, masterPassword);

            // I dati cifrati non dovrebbero contenere testo leggibile
            const encryptedString = JSON.stringify(encrypted);
            expect(encryptedString).not.toContain('confused');
            expect(encryptedString).not.toContain('frustrated');
            expect(encryptedString).not.toContain('happy');
        });
    });

    // ============================================
    // TEST STORAGE
    // ============================================

    describe('Storage cifrato', () => {
        it('dovrebbe salvare dati cifrati in localStorage', async () => {
            const key = 'test_data';
            const data = { test: 'value', number: 123 };

            const result = await setEncryptedItem(key, data, masterPassword);

            expect(result).toBe(true);
        });

        it('dovrebbe leggere dati cifrati da localStorage', async () => {
            const key = 'elab_test_data';
            const originalData = {
                esperimentiCompletati: ['exp1', 'exp2'],
                tempoTotale: 3600,
            };

            // Mock localStorage con dati cifrati
            const encrypted = await encrypt(originalData, masterPassword);
            mockLocalStorage(key, encrypted);

            const decrypted = await getEncryptedItem(key, masterPassword);

            expect(decrypted).toEqual(originalData);
        });

        it('dovrebbe restituire null per chiave inesistente', async () => {
            const result = await getEncryptedItem('nonexistent_key', masterPassword);

            expect(result).toBeNull();
        });

        it('dovrebbe rimuovere dati cifrati', () => {
            const key = 'test_key';

            removeEncryptedItem(key);

            // Verifica che localStorage.removeItem sia stato chiamato
            expect(localStorage.removeItem).toHaveBeenCalledWith(key);
        });

        it('dovrebbe gestire errore di storage pieno', async () => {
            // Simula errore di storage
            localStorage.setItem.mockImplementation(() => {
                throw new Error('QuotaExceededError');
            });

            const result = await setEncryptedItem('key', { data: 'test' }, masterPassword);

            expect(result).toBe(false);
        });
    });

    // ============================================
    // TEST MASTER KEY
    // ============================================

    describe('Master Key', () => {
        it('dovrebbe derivare master key da JWT token', async () => {
            const jwtToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.test.signature';

            const masterKey = await getOrCreateMasterKey(jwtToken);

            expect(masterKey).toBeTruthy();
            expect(typeof masterKey).toBe('string');
            expect(masterKey.length).toBe(64); // SHA-256 hex = 64 chars
        });

        it('dovrebbe generare la stessa chiave dallo stesso JWT', async () => {
            const jwtToken = 'same-jwt-token';

            const key1 = await getOrCreateMasterKey(jwtToken);
            const key2 = await getOrCreateMasterKey(jwtToken);

            expect(key1).toBe(key2);
        });

        it('dovrebbe generare chiavi diverse da JWT diversi', async () => {
            const key1 = await getOrCreateMasterKey('jwt-1');
            const key2 = await getOrCreateMasterKey('jwt-2');

            expect(key1).not.toBe(key2);
        });

        it('dovrebbe fallire senza JWT', async () => {
            await expect(getOrCreateMasterKey(null)).rejects.toThrow('JWT token richiesto');
            await expect(getOrCreateMasterKey('')).rejects.toThrow('JWT token richiesto');
        });
    });

    // ============================================
    // TEST DATI SENSIBILI
    // ============================================

    describe('Dati sensibili', () => {
        let memStore;

        beforeEach(() => {
            // Use an in-memory store so save→load round-trips work
            memStore = {};
            localStorage.setItem.mockImplementation((k, v) => { memStore[k] = v; });
            localStorage.getItem.mockImplementation((k) => memStore[k] ?? null);
        });

        it('dovrebbe salvare e caricare confusioneLog', async () => {
            const confusioneData = [
                { timestamp: '2026-02-15T10:00:00Z', stato: 'confuso', livello: 2 },
                { timestamp: '2026-02-15T11:00:00Z', stato: 'frustrato', livello: 3 },
            ];

            await saveConfusioneLog(confusioneData, masterPassword);
            const loaded = await loadConfusioneLog(masterPassword);

            expect(loaded).toEqual(confusioneData);
        });

        it('dovrebbe salvare e caricare progressi studente', async () => {
            const progressData = {
                esperimentiCompletati: 15,
                tempoTotale: 7200,
                livello: 3,
                badges: ['principiante', 'esploratore'],
            };

            await saveStudentProgress(progressData, masterPassword);
            const loaded = await loadStudentProgress(masterPassword);

            expect(loaded).toEqual(progressData);
        });

        it('dovrebbe restituire null se confusioneLog non esiste', async () => {
            const result = await loadConfusioneLog(masterPassword);

            expect(result).toBeNull();
        });
    });

    // ============================================
    // TEST CLEAR ALL
    // ============================================

    describe('Clear all data', () => {
        it('dovrebbe eliminare tutti i dati sensibili', () => {
            // Mock alcune chiavi
            Object.defineProperty(localStorage, 'length', { value: 5 });
            localStorage.key = vi.fn()
                .mockReturnValueOnce('elab_confusione_log')
                .mockReturnValueOnce('elab_student_progress')
                .mockReturnValueOnce('elab_session_data')
                .mockReturnValueOnce('elab_other_app')
                .mockReturnValueOnce('elab_project_history');

            clearAllSensitiveData();

            // Verifica che tutte le chiavi elab_ siano rimosse
            expect(localStorage.removeItem).toHaveBeenCalledWith('elab_confusione_log');
            expect(localStorage.removeItem).toHaveBeenCalledWith('elab_student_progress');
            expect(localStorage.removeItem).toHaveBeenCalledWith('elab_session_data');
            expect(localStorage.removeItem).toHaveBeenCalledWith('elab_project_history');
        });
    });

    // ============================================
    // TEST SICUREZZA
    // ============================================

    describe('Sicurezza', () => {
        it('dovrebbe usare salt diversi per ogni cifratura', async () => {
            const data = { test: 'data' };

            const encrypted1 = await encrypt(data, masterPassword);
            const encrypted2 = await encrypt(data, masterPassword);

            // Salt diversi
            expect(encrypted1.salt).not.toBe(encrypted2.salt);
            // IV diversi
            expect(encrypted1.iv).not.toBe(encrypted2.iv);
            // Ma i dati decifrati sono uguali
            const decrypted1 = await decrypt(encrypted1, masterPassword);
            const decrypted2 = await decrypt(encrypted2, masterPassword);
            expect(decrypted1).toEqual(decrypted2);
        });

        it('dovrebbe proteggere contro attacchi di manipolazione', async () => {
            const data = { important: 'data' };
            const encrypted = await encrypt(data, masterPassword);

            // Manipola il ciphertext
            encrypted.encrypted = encrypted.encrypted.substring(0, encrypted.encrypted.length - 4) + 'XXXX';

            await expect(decrypt(encrypted, masterPassword)).rejects.toThrow();
        });

        it('non dovrebbe esporre dati in memoria', async () => {
            const sensitiveData = {
                password: 'secret123',
                ssn: '123-45-6789',
                emotionalState: 'very confused'
            };

            const encrypted = await encrypt(sensitiveData, masterPassword);

            // Verifica che i dati sensibili non siano in chiaro
            const encryptedJson = JSON.stringify(encrypted);
            expect(encryptedJson).not.toContain('secret123');
            expect(encryptedJson).not.toContain('123-45-6789');
            expect(encryptedJson).not.toContain('very confused');
        });
    });
});
