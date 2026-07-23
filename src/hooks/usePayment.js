/**
 * usePayment.js
 *
 * Hook React qui orchestre le flux de paiement S3P complet :
 *   1. getQuoteId()
 *   2. performWithdrawal()
 *   3. verifyTransaction() — polling toutes les 10s, timeout 4min
 *   4. saveSubscription()  — en cas de succès
 */

import { useState, useRef, useCallback } from "react";
import { getQuoteId, performWithdrawal, verifyTransaction } from "../services/s3pService";
import {
  ERROR_MESSAGES,
  DEFAULT_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
  POLL_INTERVAL_MS,
  TIMEOUT_MS,
} from "../constants/paymentErrors";

// ─────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

/**
 * @param {function} onSaveSubscription  Callback async appelé en cas de succès.
 *                                        Reçoit { userId, days, amount, codepromo }.
 *                                        Doit throw en cas d'échec.
 */
export function usePayment(onSaveSubscription) {
  const [status, setStatus]       = useState("idle"); // idle | loading | success | error
  const [error, setError]         = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [trid, setTrid]           = useState(null);

  const stopRef = useRef(false); // pour interrompre le polling si besoin

  // ── Polling de vérification ──────────────────────────────────

  const pollVerify = useCallback(
    async (tridValue, userId, days, codepromo, amountFinal, s3pConfig) => {
      const deadline = Date.now() + TIMEOUT_MS;
      stopRef.current = false;

      while (Date.now() < deadline && !stopRef.current) {
        try {
          const tx = await verifyTransaction(tridValue, s3pConfig);

          if (tx?.status === "SUCCESS") {
            // Boucle de sauvegarde — réessaie jusqu'au succès
            let saved = false;
            while (!saved && !stopRef.current) {
              try {
                await onSaveSubscription({
                  userId,
                  days,
                  amount: Math.round(amountFinal),
                  codepromo,
                });
                saved = true;
              } catch {
                await delay(3000);
              }
            }
            setStatus("success");
            return;
          }

          if (tx?.status === "ERRORED") {
            const code = tx.errorCode?.toString() ?? "unknown";
            setError(ERROR_MESSAGES[code] ?? DEFAULT_ERROR_MESSAGE);
            setErrorCode(code);
            setStatus("error");
            return;
          }

          // PENDING ou null → on continue le polling
        } catch {
          // Erreur réseau silencieuse — on continue (comme dans le Flutter original)
        }

        await delay(POLL_INTERVAL_MS);
      }

      // Timeout atteint
      if (!stopRef.current) {
        setError(TIMEOUT_ERROR_MESSAGE);
        setErrorCode("TIMEOUT");
        setStatus("error");
      }
    },
    [onSaveSubscription]
  );

  // ── Point d'entrée principal ─────────────────────────────────

  /**
   * Lance le flux de paiement complet.
   *
   * @param {object} params
   * @param {string}  params.payItemId
   * @param {number}  params.amount               Montant brut pour le devis
   * @param {number}  params.amountFinal           Montant réel à sauvegarder
   * @param {string}  params.customerPhonenumber
   * @param {string}  params.customerEmailaddress
   * @param {string}  params.customerName
   * @param {string}  params.customerAddress
   * @param {string}  params.serviceNumber
   * @param {string}  params.trid                 ID de transaction unique (généré par toi)
   * @param {number}  params.userId
   * @param {number}  params.days
   * @param {string}  [params.codepromo]
   * @param {object}  [params.s3pConfig]          Config S3P optionnelle (override)
   */
  const processPayment = useCallback(
    async ({
      payItemId,
      amount,
      amountFinal,
      customerPhonenumber,
      customerEmailaddress,
      customerName,
      customerAddress,
      serviceNumber,
      trid: tridValue,
      userId,
      days,
      codepromo = "",
      s3pConfig,
    }) => {
      // Reset state
      setStatus("loading");
      setError(null);
      setErrorCode(null);
      setTrid(tridValue);

      try {
        // ── Étape 1 : Devis ────────────────────────────────────
        const quoteId = await getQuoteId(payItemId, amount, s3pConfig);

        // ── Étape 2 : Prélèvement ──────────────────────────────
        const withdrawalResult = await performWithdrawal(
          {
            quoteId,
            customerPhonenumber,
            customerEmailaddress,
            customerName,
            customerAddress,
            serviceNumber,
            trid: tridValue,
          },
          s3pConfig
        );

        if (!withdrawalResult || Object.keys(withdrawalResult).length === 0) {
          throw new Error(
            "Une erreur s'est produite lors du traitement de votre demande."
          );
        }

        // ── Étape 3 : Vérification (polling) ───────────────────
        await pollVerify(
          tridValue,
          userId,
          days,
          codepromo,
          amountFinal,
          s3pConfig
        );
      } catch (err) {
        setError(
          err?.message ?? "Vérifiez votre connexion et relancez le paiement."
        );
        setErrorCode(null);
        setStatus("error");
      }
    },
    [pollVerify]
  );

  // ── Reset ────────────────────────────────────────────────────

  const reset = useCallback(() => {
    stopRef.current = true; // stoppe le polling en cours
    setStatus("idle");
    setError(null);
    setErrorCode(null);
    setTrid(null);
  }, []);

  return {
    status,     // "idle" | "loading" | "success" | "error"
    error,      // string | null
    errorCode,  // string | null  (code S3P ex: "703108")
    trid,       // string | null
    processPayment,
    reset,
  };
}
