// ─────────────────────────────────────────────────────────────
// S3P / Smobilpay — Codes d'erreur et messages localisés
// ─────────────────────────────────────────────────────────────

export const ERROR_MESSAGES = {
  "42001":
    "🔍 Le numéro de service ou la facture est introuvable. Veuillez vérifier les informations saisies et réessayer.",
  "703112":
    "⛔ Le destinataire a atteint la limite quotidienne, hebdomadaire ou mensuelle de son compte. Veuillez réessayer plus tard.",
  "703111":
    "⛔ Vous avez atteint la limite quotidienne de votre compte. Veuillez réessayer après la réinitialisation de vos limites.",
  "703203":
    "⚠️ Le code PIN ou le jeton de confirmation saisi est invalide. Veuillez vérifier et réessayer.",
  "703108":
    "💸 Fonds insuffisants. Veuillez approvisionner votre compte et réessayer.",
  "703117":
    "🚫 Vous n'avez pas un compte MoMo ou OM sur ce numéro. Veuillez contacter votre fournisseur de services.",
  "703202":
    "❌ Vous avez refusé la demande d'approbation. Vous pouvez relancer la transaction à tout moment.",
  "703201":
    "⚠️ Vous n'avez pas confirmé la demande de prélèvement. Veuillez vérifier vos notifications.",
  "702103":
    "⚠️ Le montant de la transaction dépasse le seuil acceptable. Veuillez saisir un montant inférieur.",
  "703000":
    "⚠️ La transaction a échoué en raison d'une erreur commerciale générale.",
  "702000":
    "⚠️ La transaction a échoué en raison d'une erreur de paiement générale.",
};

export const DEFAULT_ERROR_MESSAGE =
  "La transaction a échoué pour une raison technique. Veuillez réessayer.";

export const TIMEOUT_ERROR_MESSAGE =
  "La transaction prend plus de temps que prévu. Elle est en cours de vérification en arrière-plan. À défaut, veuillez contacter le support technique.";

export const POLL_INTERVAL_MS = 10_000;   // 10 secondes
export const TIMEOUT_MS       = 4 * 60_000; // 4 minutes
