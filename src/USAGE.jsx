import React from 'react'
import PaymentForm from './components/PaymentForm'

export default function USAGE() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 16px" }}>
      <PaymentForm
        payItemId="CM_MTN_MMO_WALLET_00001"  // ← ton payItemId S3P
        amount={5000}                          // ← montant brut pour le devis
        amountFinal={5000}                     // ← montant affiché / sauvegardé
        userId={42}
        days={30}
        codepromo="PROMO10"
        onSaveSubscription={(subscription) => console.log("💾 Subscription saved", subscription)}
        onSuccess={() => console.log("✅ Succès")}
        onError={(msg, trid, code) => console.error("❌", msg, trid, code)}
      />
    </div>
  )
}
