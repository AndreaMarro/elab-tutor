// ============================================
// ELAB Tutor - Componente Eliminazione Dati
// GDPR Art. 17 - Diritto all'oblio
// © Andrea Marro — 15/02/2026
// ============================================

import React, { useState } from 'react';
import { clearAllSensitiveData } from '../../utils/crypto';
import { requestDataDeletion } from '../../services/gdprService';

/**
 * Componente per l'eliminazione completa dei dati utente (diritto all'oblio).
 * 
 * GDPR Art. 17: L'utente ha il diritto di ottenere la cancellazione dei dati
 * personali che lo riguardano senza ingiustificato ritardo.
 * 
 * @param {Object} props
 * @param {Object} props.user - Utente corrente
 * @param {Function} props.onDataDeleted - Callback quando i dati sono eliminati
 * @param {Function} props.onCancel - Callback per annullare
 */
export default function DataDeletion({ user, onDataDeleted, onCancel }) {
    const [step, setStep] = useState(1);
    const [confirmation, setConfirmation] = useState('');
    const [password, setPassword] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const reasons = [
        { value: 'no_longer_use', label: 'Non uso più il servizio' },
        { value: 'privacy_concerns', label: 'Preoccupazioni sulla privacy' },
        { value: 'data_breach', label: 'Sospetto di violazione dati' },
        { value: 'incorrect_data', label: 'Dati non corretti' },
        { value: 'other', label: 'Altro motivo' },
    ];

    const handleStep1 = (e) => {
        e.preventDefault();
        if (!reason) {
            setError('Seleziona un motivo per continuare');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleStep2 = (e) => {
        e.preventDefault();
        if (confirmation !== 'ELIMINA') {
            setError('Digita ELIMINA per confermare');
            return;
        }
        setError('');
        setStep(3);
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (!password) {
            setError('Inserisci la tua password per confermare');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Elimina dati locali cifrati
            clearAllSensitiveData();

            // 2. Chiamata backend GDPR (webhook → Notion)
            // requestDataDeletion gestisce anche la pulizia localStorage/sessionStorage
            await requestDataDeletion(user?.id || 'anonymous', password, reason);

            setSuccess(true);
            onDataDeleted?.();
        } catch (err) {
            setError('Errore durante l\'eliminazione. Riprova più tardi.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={styles.container}>
                <div style={styles.successCard}>
                    <div style={{ ...styles.successIcon, color: '#28a745' }}>&#10003;</div>
                    <h2 style={styles.successTitle}>Dati Eliminati</h2>
                    <p style={styles.successMessage}>
                        Tutti i tuoi dati personali sono stati eliminati con successo.
                    </p>
                    <p style={styles.successSubmessage}>
                        Hai ricevuto un'email di conferma all'indirizzo registrato.
                    </p>
                    <div style={styles.successNotice}>
                        <strong>Nota:</strong> I backup potrebbero contenere i tuoi dati 
                        per un massimo di 30 giorni per motivi di sicurezza, dopodiché 
                        saranno cancellati definitivamente.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.icon}>&#9888;</div>
                    <h2 style={styles.title}>Elimina Account e Dati</h2>
                </div>

                <div style={styles.warningBanner}>
                    <strong>Attenzione:</strong> Questa azione è irreversibile. 
                    Tutti i tuoi dati saranno eliminati permanentemente.
                </div>

                {/* Step 1: Motivo */}
                {step === 1 && (
                    <form onSubmit={handleStep1} style={styles.form}>
                        <p style={styles.description}>
                            Ci dispiace vederti andare via. 
                            Ci aiuterebbe sapere perché vuoi eliminare il tuo account:
                        </p>

                        <div style={styles.reasonsList}>
                            {reasons.map(r => (
                                <label key={r.value} style={styles.reasonLabel}>
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={r.value}
                                        checked={reason === r.value}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                    <span>{r.label}</span>
                                </label>
                            ))}
                        </div>

                        {error && <div style={styles.error}>{error}</div>}

                        <div style={styles.buttons}>
                            <button type="submit" style={styles.continueBtn}>
                                Continua
                            </button>
                            <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                                Annulla
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: Conferma ELIMINA */}
                {step === 2 && (
                    <form onSubmit={handleStep2} style={styles.form}>
                        <p style={styles.description}>
                            Per confermare l'eliminazione, digita <strong>ELIMINA</strong> nel campo sottostante:
                        </p>

                        <div style={styles.field}>
                            <input
                                type="text"
                                value={confirmation}
                                onChange={(e) => setConfirmation(e.target.value)}
                                placeholder="Digita ELIMINA"
                                style={styles.input}
                                autoFocus
                            />
                        </div>

                        <div style={styles.dataList}>
                            <h4 style={styles.dataListTitle}>I seguenti dati saranno eliminati:</h4>
                            <ul style={styles.dataListItems}>
                                <li>Profilo utente</li>
                                <li>Progressi e completamenti</li>
                                <li>Log stati emotivi</li>
                                <li>Progetti salvati</li>
                                <li>Post e commenti</li>
                                <li>Dati di sessione</li>
                            </ul>
                        </div>

                        {error && <div style={styles.error}>{error}</div>}

                        <div style={styles.buttons}>
                            <button type="submit" style={styles.continueBtn}>
                                Continua
                            </button>
                            <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>
                                Indietro
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Password finale */}
                {step === 3 && (
                    <form onSubmit={handleFinalSubmit} style={styles.form}>
                        <p style={styles.description}>
                            Inserisci la tua password per confermare definitivamente 
                            l'eliminazione dell'account:
                        </p>

                        <div style={styles.field}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="La tua password"
                                style={styles.input}
                                autoFocus
                                disabled={loading}
                            />
                        </div>

                        {error && <div style={styles.error}>{error}</div>}

                        <div style={styles.buttons}>
                            <button 
                                type="submit" 
                                style={{ ...styles.deleteBtn, opacity: loading ? 0.7 : 1 }}
                                disabled={loading}
                            >
                                {loading ? 'Eliminazione in corso...' : 'Elimina Definitivamente'}
                            </button>
                            <button type="button" onClick={() => setStep(2)} style={styles.backBtn}>
                                Indietro
                            </button>
                        </div>
                    </form>
                )}

                <div style={styles.gdprInfo}>
                    <span style={styles.gdprIcon}>*</span>
                    <span>
                        Questa funzione è fornita in conformità con l'
                        <strong>Art. 17 del GDPR</strong> (Diritto all'oblio).
                        Per maggiori informazioni, consulta la nostra 
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" style={styles.link}>
                            Privacy Policy
                        </a>.
                    </span>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        overflowY: 'auto',
        padding: '20px',
        background: 'linear-gradient(135deg, var(--elab-navy) 0%, #0d1b2a 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    card: {
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    },
    successCard: {
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '16px',
    },
    icon: {
        fontSize: '48px',
        marginBottom: '12px',
    },
    title: {
        color: '#dc3545',
        fontSize: '24px',
        fontWeight: '700',
        margin: 0,
    },
    warningBanner: {
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '24px',
        color: '#856404',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    description: {
        color: '#333',
        fontSize: '14px',
        lineHeight: '1.6',
        margin: 0,
    },
    reasonsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    reasonLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        color: '#333',
        fontSize: '14px',
        fontWeight: '600',
    },
    input: {
        padding: '12px 16px',
        fontSize: '15px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        background: '#fff',
        outline: 'none',
    },
    dataList: {
        background: '#f8f9fa',
        borderRadius: '10px',
        padding: '16px',
    },
    dataListTitle: {
        margin: '0 0 12px 0',
        fontSize: '14px',
        color: '#333',
    },
    dataListItems: {
        margin: 0,
        paddingLeft: '20px',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.8',
    },
    error: {
        color: '#dc3545',
        fontSize: '14px',
        padding: '12px',
        background: '#f8d7da',
        borderRadius: '8px',
        border: '1px solid #f5c6cb',
    },
    buttons: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    continueBtn: {
        flex: 1,
        padding: '14px 24px',
        fontSize: '15px',
        fontWeight: '600',
        borderRadius: '10px',
        border: 'none',
        background: 'var(--elab-navy)',
        color: '#fff',
        cursor: 'pointer',
    },
    cancelBtn: {
        padding: '14px 24px',
        fontSize: '15px',
        fontWeight: '600',
        borderRadius: '10px',
        border: '1px solid #ddd',
        background: '#fff',
        color: '#666',
        cursor: 'pointer',
    },
    backBtn: {
        padding: '14px 24px',
        fontSize: '15px',
        fontWeight: '600',
        borderRadius: '10px',
        border: '1px solid #ddd',
        background: '#f8f9fa',
        color: '#666',
        cursor: 'pointer',
    },
    deleteBtn: {
        flex: 1,
        padding: '14px 24px',
        fontSize: '15px',
        fontWeight: '600',
        borderRadius: '10px',
        border: 'none',
        background: '#dc3545',
        color: '#fff',
        cursor: 'pointer',
    },
    gdprInfo: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #eee',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5',
    },
    gdprIcon: {
        fontSize: '16px',
    },
    link: {
        color: 'var(--elab-navy)',
        textDecoration: 'underline',
    },
    successIcon: {
        fontSize: '64px',
        marginBottom: '16px',
    },
    successTitle: {
        color: '#28a745',
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 12px 0',
    },
    successMessage: {
        color: '#333',
        fontSize: '16px',
        margin: '0 0 8px 0',
    },
    successSubmessage: {
        color: '#666',
        fontSize: '14px',
        margin: '0 0 16px 0',
    },
    successNotice: {
        background: '#e8f4fd',
        border: '1px solid #bee5eb',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '14px',
        color: '#0c5460',
    },
};
