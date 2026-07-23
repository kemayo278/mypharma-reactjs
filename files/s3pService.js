/**
 * s3pService.js
 *
 * Service S3P / Smobilpay pour React (navigateur).
 * Gère l'authentification HMAC-SHA1 et les appels API.
 *
 * ⚠️  ATTENTION SÉCURITÉ :
 *     Les credentials (key, secret) sont visibles côté client.
 *     Pour la production, préférez passer par un backend proxy
 *     qui signe les requêtes côté serveur.
 */

// ─────────────────────────────────────────────────────────────
// Configuration par défaut
// ─────────────────────────────────────────────────────────────

const DEFAULT_CONFIG = {
  url:    "https://s3pv2cm.smobilpay.com/v2",
  key:    "d347e79f-be30-41d5-a113-6f8ce39c09c0",
  secret: "5faf8360-6083-4e5e-a223-5779dba90b9c",
};

// Staging :
// const DEFAULT_CONFIG = {
//   url:    "https://s3p.smobilpay.staging.maviance.info/v2",
//   key:    "0200f1db-cf86-49e4-9168-3534eb96e577",
//   secret: "d0908936-a4ae-45c5-96ad-797e6785ab5b",
// };

// ─────────────────────────────────────────────────────────────
// HMAC-SHA1 via Web Crypto API (natif navigateur)
// ─────────────────────────────────────────────────────────────

async function hmacSha1Base64(secret, message) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  // Convertir ArrayBuffer → Base64
  const bytes = new Uint8Array(signature);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

// ─────────────────────────────────────────────────────────────
// Génération de l'en-tête Authorization S3P
// ─────────────────────────────────────────────────────────────

async function buildAuthHeader(config, method, url, extraParams = {}) {
  const timestamp = Date.now().toString();
  const nonce     = timestamp;

  const s3pParams = {
    s3pAuth_nonce:            nonce,
    s3pAuth_timestamp:        timestamp,
    s3pAuth_signature_method: "HMAC-SHA1",
    s3pAuth_token:            config.key,
  };

  // Fusionner et nettoyer
  const allParams = {};
  for (const [k, v] of Object.entries({ ...extraParams, ...s3pParams })) {
    allParams[k] = typeof v === "string" ? v.trim() : String(v);
  }

  // Trier par ordre alphabétique
  const sortedKeys = Object.keys(allParams).sort();

  // Construire la chaîne de paramètres
  const parameterString = sortedKeys
    .map((k) => `${k}=${encodeURIComponent(allParams[k])}`)
    .join("&");

  // Construire la base string
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(parameterString)}`;

  // Signer
  const signature = await hmacSha1Base64(config.secret, baseString);

  return (
    `s3pAuth ` +
    `s3pAuth_timestamp="${timestamp}", ` +
    `s3pAuth_signature="${signature}", ` +
    `s3pAuth_nonce="${nonce}", ` +
    `s3pAuth_signature_method="HMAC-SHA1", ` +
    `s3pAuth_token="${config.key}"`
  );
}

// ─────────────────────────────────────────────────────────────
// Requête POST
// ─────────────────────────────────────────────────────────────

async function s3pPost(path, body, config = DEFAULT_CONFIG) {
  const url = `${config.url}${path}`;

  // Pour POST : signature inclut body + s3pParams
  const signParams = {};
  for (const [k, v] of Object.entries(body)) {
    signParams[k] = typeof v === "string" ? v.trim() : String(v);
  }

  const timestamp = Date.now().toString();
  const nonce     = timestamp;

  const s3pParams = {
    s3pAuth_nonce:            nonce,
    s3pAuth_timestamp:        timestamp,
    s3pAuth_signature_method: "HMAC-SHA1",
    s3pAuth_token:            config.key,
  };

  const allParams = {};
  for (const [k, v] of Object.entries({ ...signParams, ...s3pParams })) {
    allParams[k] = typeof v === "string" ? v.trim() : String(v);
  }

  const sortedKeys      = Object.keys(allParams).sort();
  const parameterString = sortedKeys.map((k) => `${k}=${allParams[k]}`).join("&");
  const baseString      = `POST&${encodeURIComponent(url)}&${encodeURIComponent(parameterString)}`;
  const signature       = await hmacSha1Base64(config.secret, baseString);

  const authHeader =
    `s3pAuth ` +
    `s3pAuth_timestamp="${timestamp}", ` +
    `s3pAuth_signature="${signature}", ` +
    `s3pAuth_nonce="${nonce}", ` +
    `s3pAuth_signature_method="HMAC-SHA1", ` +
    `s3pAuth_token="${config.key}"`;

  const response = await fetch(url, {
    method:  "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body:    JSON.stringify(body),
    signal:  AbortSignal.timeout(7000),
  });

  if (!response.ok) {
    throw new Error(`S3P POST ${path} — HTTP ${response.status}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────────────────────
// Requête GET
// ─────────────────────────────────────────────────────────────

async function s3pGet(path, queryParams = {}, config = DEFAULT_CONFIG) {
  const baseUrl = `${config.url}${path}`;

  const authHeader = await buildAuthHeader(config, "GET", baseUrl, queryParams);

  const finalUrl =
    Object.keys(queryParams).length > 0
      ? `${baseUrl}?${new URLSearchParams(queryParams).toString()}`
      : baseUrl;

  const response = await fetch(finalUrl, {
    method:  "GET",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    signal:  AbortSignal.timeout(7000),
  });

  if (!response.ok) {
    throw new Error(`S3P GET ${path} — HTTP ${response.status}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────────────────────
// API Publique
// ─────────────────────────────────────────────────────────────

/**
 * Étape 1 — Obtenir un quoteId avant le paiement
 * @param {string} payItemId
 * @param {number} amount
 * @param {object} [config]
 * @returns {Promise<string>} quoteId
 */
export async function getQuoteId(payItemId, amount, config = DEFAULT_CONFIG) {
  const data = await s3pPost(
    "/quotestd",
    { payItemId, amount: amount.toString() },
    config
  );

  if (!data?.quoteId) throw new Error("Aucun quoteId reçu");
  return data.quoteId.toString();
}

/**
 * Étape 2 — Déclencher le prélèvement Mobile Money
 * @param {object} params
 * @param {object} [config]
 * @returns {Promise<object>}
 */
export async function performWithdrawal(params, config = DEFAULT_CONFIG) {
  return s3pPost("/collectstd", params, config);
}

/**
 * Étape 3 — Vérifier le statut d'une transaction (un seul appel)
 * @param {string} trid
 * @param {object} [config]
 * @returns {Promise<object|null>}
 */
export async function verifyTransaction(trid, config = DEFAULT_CONFIG) {
  const data = await s3pGet("/verifytx", { trid }, config);

  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0];
}

export { DEFAULT_CONFIG };
