/**
 * PaymentForm.jsx
 *
 * Composant de paiement Mobile Money (MoMo / Orange Money)
 * à intégrer dans n'importe quel projet React existant.
 *
 * Props :
 *   payItemId          {string}   ID de l'article S3P
 *   amount             {number}   Montant brut (pour le devis)
 *   amountFinal        {number}   Montant affiché et sauvegardé
 *   userId             {number}
 *   days               {number}   Durée de l'abonnement
 *   codepromo          {string}   Code promo (optionnel)
 *   onSaveSubscription {function} async ({ userId, days, amount, codepromo }) => void
 *   onSuccess          {function} Appelé après succès complet
 *   onError            {function} Appelé avec (errorMessage, trid, errorCode)
 *   s3pConfig          {object}   Override config S3P (optionnel)
 */

import { useState } from "react";
import { usePayment } from "../hooks/usePayment";

// ─────────────────────────────────────────────────────────────
// Icônes SVG inline (pas de dépendance externe)
// ─────────────────────────────────────────────────────────────

const IconPhone    = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>);
const IconMail     = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const IconUser     = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconMapPin   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const IconWallet   = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 3l-4 4-4-4"/><circle cx="16" cy="13" r="1" fill="currentColor"/></svg>);
const IconCheck    = () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const IconX        = () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>);
const IconRefresh  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>);

// ─────────────────────────────────────────────────────────────
// Styles injectés une seule fois
// ─────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

  .pf-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  .pf-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #0f1117;
    border-radius: 20px;
    padding: 36px 32px;
    max-width: 460px;
    width: 100%;
    color: #e8e9f0;
    position: relative;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }

  .pf-wrap::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,180,0,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .pf-header { margin-bottom: 28px; }

  .pf-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,180,0,0.12);
    border: 1px solid rgba(255,180,0,0.25);
    color: #ffb400;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 100px;
    margin-bottom: 14px;
  }

  .pf-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #ffb400;
    animation: pf-blink 1.4s infinite;
  }

  @keyframes pf-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .pf-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 6px;
  }

  .pf-subtitle {
    font-size: 13px;
    color: #6b7280;
  }

  .pf-amount-card {
    background: linear-gradient(135deg, #1a1f2e 0%, #1e2435 100%);
    border: 1px solid rgba(255,180,0,0.15);
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pf-amount-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
  .pf-amount-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #ffb400; }
  .pf-amount-unit  { font-size: 14px; color: #9ca3af; font-weight: 500; }
  .pf-amount-days  { font-size: 12px; color: #6b7280; margin-top: 2px; }

  .pf-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0 0 24px;
  }

  .pf-fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }

  .pf-field { display: flex; flex-direction: column; gap: 6px; }

  .pf-label {
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .pf-input-wrap {
    display: flex;
    align-items: center;
    background: #1a1f2e;
    border: 1.5px solid #2a2f3e;
    border-radius: 10px;
    padding: 0 14px;
    gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .pf-input-wrap:focus-within {
    border-color: #ffb400;
    box-shadow: 0 0 0 3px rgba(255,180,0,0.1);
  }

  .pf-input-icon { color: #4b5563; flex-shrink: 0; }

  .pf-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    padding: 13px 0;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #e8e9f0;
  }

  .pf-input::placeholder { color: #3d4452; }
  .pf-input:disabled { opacity: 0.5; cursor: not-allowed; }

  .pf-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #ffb400 0%, #ff8c00 100%);
    border: none;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #0f1117;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: opacity 0.2s, transform 0.1s;
    letter-spacing: 0.02em;
  }

  .pf-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .pf-btn:active:not(:disabled) { transform: translateY(0); }
  .pf-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .pf-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(15,17,23,0.3);
    border-top-color: #0f1117;
    border-radius: 50%;
    animation: pf-spin 0.7s linear infinite;
  }

  @keyframes pf-spin { to { transform: rotate(360deg); } }

  .pf-hint {
    margin-top: 14px;
    text-align: center;
    font-size: 12px;
    color: #4b5563;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .pf-hint-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #22c55e;
    animation: pf-blink 1.4s infinite;
  }

  /* ── États Success / Error ─────────────────────── */

  .pf-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 12px 0 8px;
    gap: 16px;
  }

  .pf-state-icon {
    width: 88px; height: 88px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  .pf-state-icon.success {
    background: rgba(34,197,94,0.12);
    color: #22c55e;
    box-shadow: 0 0 0 12px rgba(34,197,94,0.06);
  }

  .pf-state-icon.error {
    background: rgba(239,68,68,0.12);
    color: #ef4444;
    box-shadow: 0 0 0 12px rgba(239,68,68,0.06);
  }

  .pf-state-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
  }

  .pf-state-msg {
    font-size: 14px;
    color: #9ca3af;
    line-height: 1.6;
    max-width: 340px;
  }

  .pf-trid {
    background: #1a1f2e;
    border: 1px solid #2a2f3e;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 12px;
    color: #6b7280;
    width: 100%;
    word-break: break-all;
  }

  .pf-trid span { display: block; color: #4b5563; font-size: 11px; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em; }

  .pf-btn-outline {
    width: 100%;
    padding: 13px;
    background: transparent;
    border: 1.5px solid #2a2f3e;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #9ca3af;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: border-color 0.2s, color 0.2s;
    margin-top: 4px;
  }

  .pf-btn-outline:hover { border-color: #4b5563; color: #e8e9f0; }
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = STYLES;
  document.head.appendChild(el);
  stylesInjected = true;
}

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

export function PaymentForm({
  payItemId,
  amount,
  amountFinal,
  userId,
  days,
  codepromo = "",
  onSaveSubscription,
  onSuccess,
  onError,
  s3pConfig,
}) {
  injectStyles();

  const [phone,         setPhone]         = useState("");
  const [serviceNumber, setServiceNumber] = useState("");
  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [address,       setAddress]       = useState("");

  const { status, error, errorCode, trid, processPayment, reset } = usePayment(
    onSaveSubscription
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const generatedTrid = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    await processPayment({
      payItemId,
      amount,
      amountFinal,
      customerPhonenumber:   phone,
      customerEmailaddress:  email,
      customerName:          name,
      customerAddress:       address || "Cameroun",
      serviceNumber,
      trid:                  generatedTrid,
      userId,
      days,
      codepromo,
      s3pConfig,
    });
  }

  // ── Succès ───────────────────────────────────────────────────
  if (status === "success") {
    onSuccess?.();
    return (
      <div className="pf-wrap">
        <div className="pf-state">
          <div className="pf-state-icon success"><IconCheck /></div>
          <div className="pf-state-title">Paiement réussi !</div>
          <p className="pf-state-msg">
            Votre abonnement de <strong>{days} jours</strong> a été activé avec succès.
          </p>
          {trid && (
            <div className="pf-trid">
              <span>Référence transaction</span>
              {trid}
            </div>
          )}
          <button className="pf-btn-outline" onClick={reset}>
            <IconRefresh /> Nouveau paiement
          </button>
        </div>
      </div>
    );
  }

  // ── Erreur ───────────────────────────────────────────────────
  if (status === "error") {
    onError?.(error, trid, errorCode);
    return (
      <div className="pf-wrap">
        <div className="pf-state">
          <div className="pf-state-icon error"><IconX /></div>
          <div className="pf-state-title">Échec du paiement</div>
          <p className="pf-state-msg">{error}</p>
          {trid && (
            <div className="pf-trid">
              <span>Référence transaction</span>
              {trid}
            </div>
          )}
          <button className="pf-btn" onClick={reset}>
            <IconRefresh /> Réessayer
          </button>
        </div>
      </div>
    );
  }

  const isLoading = status === "loading";

  // ── Formulaire ───────────────────────────────────────────────
  return (
    <div className="pf-wrap">
      <div className="pf-header">
        <div className="pf-badge">
          <span className="pf-badge-dot" />
          Mobile Money
        </div>
        <div className="pf-title">Paiement sécurisé</div>
        <div className="pf-subtitle">MoMo · Orange Money · Cameroun</div>
      </div>

      <div className="pf-amount-card">
        <div>
          <div className="pf-amount-label">Montant à payer</div>
          <div className="pf-amount-value">
            {amountFinal.toLocaleString("fr-CM")}
            <span className="pf-amount-unit"> XAF</span>
          </div>
          <div className="pf-amount-days">{days} jours d'abonnement</div>
        </div>
        <IconWallet />
      </div>

      <div className="pf-divider" />

      <form onSubmit={handleSubmit}>
        <div className="pf-fields">
          <div className="pf-field">
            <label className="pf-label">Numéro de téléphone *</label>
            <div className="pf-input-wrap">
              <span className="pf-input-icon"><IconPhone /></span>
              <input className="pf-input" type="tel" placeholder="6XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isLoading} />
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">Numéro de service MoMo / OM *</label>
            <div className="pf-input-wrap">
              <span className="pf-input-icon"><IconPhone /></span>
              <input className="pf-input" type="tel" placeholder="6XXXXXXXX" value={serviceNumber} onChange={(e) => setServiceNumber(e.target.value)} required disabled={isLoading} />
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">Nom complet *</label>
            <div className="pf-input-wrap">
              <span className="pf-input-icon"><IconUser /></span>
              <input className="pf-input" type="text" placeholder="Jean Dupont" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">Email *</label>
            <div className="pf-input-wrap">
              <span className="pf-input-icon"><IconMail /></span>
              <input className="pf-input" type="email" placeholder="jean@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">Adresse</label>
            <div className="pf-input-wrap">
              <span className="pf-input-icon"><IconMapPin /></span>
              <input className="pf-input" type="text" placeholder="Yaoundé, Cameroun" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isLoading} />
            </div>
          </div>
        </div>

        <button className="pf-btn" type="submit" disabled={isLoading}>
          {isLoading ? (
            <><span className="pf-spinner" /> Traitement en cours…</>
          ) : (
            <>Payer {amountFinal.toLocaleString("fr-CM")} XAF</>
          )}
        </button>

        {isLoading && (
          <div className="pf-hint">
            <span className="pf-hint-dot" />
            Confirmez la demande sur votre téléphone
          </div>
        )}
      </form>
    </div>
  );
}

export default PaymentForm;
