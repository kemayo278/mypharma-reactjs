/**
 * Exemple d'utilisation de PaymentForm dans ton projet React existant
 *
 * Copie les fichiers suivants dans ton projet :
 *   src/services/s3pService.js
 *   src/hooks/usePayment.js
 *   src/constants/paymentErrors.js
 *   src/components/PaymentForm.jsx
 */

import PaymentForm from "./components/PaymentForm";

// ─────────────────────────────────────────────────────────────
// Exemple 1 — Intégration minimale
// ─────────────────────────────────────────────────────────────

function CheckoutPage() {
  // Callback appelé si SUCCESS — sauvegarde l'abonnement sur ton backend
  async function handleSaveSubscription({ userId, days, amount, codepromo }) {
    const res = await fetch("/api/subscription/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, days, amount, codepromo }),
    });
    if (!res.ok) throw new Error("Sauvegarde échouée");
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 16px" }}>
      <PaymentForm
        payItemId="CM_MTN_MMO_WALLET_00001"  // ← ton payItemId S3P
        amount={5000}                          // ← montant brut pour le devis
        amountFinal={5000}                     // ← montant affiché / sauvegardé
        userId={42}
        days={30}
        codepromo="PROMO10"
        onSaveSubscription={handleSaveSubscription}
        onSuccess={() => console.log("✅ Succès")}
        onError={(msg, trid, code) => console.error("❌", msg, trid, code)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Exemple 2 — Avec config S3P custom (staging)
// ─────────────────────────────────────────────────────────────

const STAGING_CONFIG = {
  url:    "https://s3p.smobilpay.staging.maviance.info/v2",
  key:    "0200f1db-cf86-49e4-9168-3534eb96e577",
  secret: "d0908936-a4ae-45c5-96ad-797e6785ab5b",
};

function CheckoutPageStaging() {
  return (
    <PaymentForm
      payItemId="CM_MTN_MMO_WALLET_00001"
      amount={5000}
      amountFinal={5000}
      userId={1}
      days={7}
      onSaveSubscription={async (params) => { /* ... */ }}
      s3pConfig={STAGING_CONFIG}  // ← override la config par défaut
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Exemple 3 — usePayment directement (sans le formulaire UI)
// ─────────────────────────────────────────────────────────────

import { usePayment } from "./hooks/usePayment";

function CustomPayButton() {
  const { status, error, trid, processPayment, reset } = usePayment(
    async ({ userId, days, amount, codepromo }) => {
      await fetch("/api/subscription/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, days, amount, codepromo }),
      });
    }
  );

  async function handlePay() {
    await processPayment({
      payItemId:             "CM_MTN_MMO_WALLET_00001",
      amount:                5000,
      amountFinal:           5000,
      customerPhonenumber:   "699000000",
      customerEmailaddress:  "user@example.com",
      customerName:          "Jean Dupont",
      customerAddress:       "Yaoundé",
      serviceNumber:         "699000000",
      trid:                  `TXN-${Date.now()}`,
      userId:                42,
      days:                  30,
      codepromo:             "",
    });
  }

  if (status === "success") return <p>✅ Abonnement activé !</p>;
  if (status === "error")   return <p>❌ {error} <button onClick={reset}>Réessayer</button></p>;

  return (
    <button onClick={handlePay} disabled={status === "loading"}>
      {status === "loading" ? "En cours…" : "Payer 5 000 XAF"}
    </button>
  );
}
