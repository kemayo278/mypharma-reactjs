import {
  ERROR_MESSAGES,
  DEFAULT_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
  POLL_INTERVAL_MS,
  TIMEOUT_MS,
} from "../constants/paymentErrors";
import axios from "axios";

const DEFAULT_CONFIG = {
  requestUrl: import.meta.env.DEV
    ? "/s3p/v2"
    : (import.meta.env.VITE_S3P_URL || "https://s3pv2cm.smobilpay.com/v2"),
  signatureUrl: import.meta.env.VITE_S3P_SIGNATURE_URL
    || import.meta.env.VITE_S3P_URL
    || "https://s3pv2cm.smobilpay.com/v2",
  key: import.meta.env.VITE_S3P_KEY || "d347e79f-be30-41d5-a113-6f8ce39c09c0",
  secret: import.meta.env.VITE_S3P_SECRET || "5faf8360-6083-4e5e-a223-5779dba90b9c",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const bytes = new Uint8Array(signature);

  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

export class PaymentService {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.isLoading = false;
  }

  _buildUrl(path, queryParams) {
    const baseUrl = `${this.config.requestUrl}${path}`;

    if (!queryParams || Object.keys(queryParams).length === 0) {
      return baseUrl;
    }

    const params = new URLSearchParams(queryParams).toString();
    return `${baseUrl}?${params}`;
  }

  _cleanParams(params = {}) {
    const cleaned = {};

    for (const [key, value] of Object.entries(params)) {
      cleaned[key] = typeof value === "string" ? value.trim() : String(value);
    }

    return cleaned;
  }

  async _buildAuthHeader({ method, url, inputParams }) {
    const timestamp = Date.now().toString();
    const nonce = timestamp;
    const signatureMethod = "HMAC-SHA1";

    const s3pParams = {
      s3pAuth_nonce: nonce,
      s3pAuth_timestamp: timestamp,
      s3pAuth_signature_method: signatureMethod,
      s3pAuth_token: this.config.key,
    };

    const mergedParams = {
      ...this._cleanParams(inputParams),
      ...s3pParams,
    };

    const sortedKeys = Object.keys(mergedParams).sort();
    const parameterString = sortedKeys
      .map((key) => {
        const value = mergedParams[key];
        return `${key}=${value}`;
      })
      .join("&");

    const baseString = `${method.toUpperCase()}&${encodeURIComponent(
      url
    )}&${encodeURIComponent(parameterString)}`;

    const signature = await hmacSha1Base64(this.config.secret, baseString);
    console.log("base string", baseString);

    const authHeader =
      "s3pAuth " +
      `s3pAuth_timestamp="${timestamp}", ` +
      `s3pAuth_signature="${signature}", ` +
      `s3pAuth_nonce="${nonce}", ` +
      `s3pAuth_signature_method="${signatureMethod}", ` +
      `s3pAuth_token="${this.config.key}"`;

    return authHeader;
  }

  async sendPaymentRequestPost({ path, method, queryParams = {}, body = {} }) {
    // 1) Construire l'URL
    const requestUrl = `${this.config.requestUrl}${path}`;
    const signatureUrl = `${this.config.signatureUrl}${path}`;
    // 2) body par defaut
    body = body || {};
    // 3) Fusion query/body pour la signature
    const input = { ...queryParams, ...body };

    const authHeader = await this._buildAuthHeader({
      method,
      url: signatureUrl,
      inputParams: input,
    });

    console.log(`Authorization: ${authHeader}`);
    console.log(`URL : ${requestUrl}`);

    const upperMethod = method.toUpperCase();
    let response;

    switch (upperMethod) {
      case "POST":
        response = await axios({
          url: requestUrl,
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          data: body,
          timeout: 7000,
          validateStatus: () => true,
        });
        break;
      case "GET":
        response = await axios({
          url: requestUrl,
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          timeout: 7000,
          validateStatus: () => true,
        });
        break;
      default:
        throw new Error("HTTP method not supported");
    }

    console.log(response.data);

    return response;
  }

  async sendPaymentRequestGet({ path, method, queryParams = {}, body = {} }) {
    const baseUrl = `${this.config.signatureUrl}${path}`;
    const input = { ...queryParams, ...body };

    const authHeader = await this._buildAuthHeader({
      method,
      url: baseUrl,
      inputParams: input,
    });

    console.log(`Authorization: ${authHeader}`);

    const finalUrl = this._buildUrl(path, queryParams);
    console.log(`URL : ${finalUrl}`);
    const upperMethod = method.toUpperCase();

    let response;

    switch (upperMethod) {
      case "POST":
        response = await axios({
          url: finalUrl,
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          data: body,
          timeout: 7000,
          validateStatus: () => true,
        });
        break;
      case "GET":
        response = await axios({
          url: finalUrl,
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          timeout: 7000,
          validateStatus: () => true,
        });
        break;
      default:
        throw new Error("HTTP method not supported");
    }

    console.log(response.data);

    return response;
  }

  async getQuoteId({ payItemId, amount }) {
    this.isLoading = true;

    try {
      const response = await this.sendPaymentRequestPost({
        path: "/quotestd",
        method: "POST",
        body: {
          payItemId : payItemId.toString(),
          amount: amount.toString(),
        },
      });

      if (response.status !== 200) {
        console.log("Failed to get quote ID, status:", response.status);
        this.isLoading = false;
        return "";
      }

      const responseData = response.data;
      console.log("Quote response data", responseData);
      return (responseData?.quoteId ?? "").toString();
    } catch (error) {
      console.log("Error getting quote ID", error.message);
      this.isLoading = false;
      return "";
    }
  }

  async performWithdrawal({
    quoteId,
    customerPhonenumber,
    customerEmailaddress,
    customerName,
    customerAddress,
    serviceNumber,
    trid,
  }) {
    try {
      const response = await this.sendPaymentRequestPost({
        path: "/collectstd",
        method: "POST",
        body: {
          quoteId,
          customerPhonenumber,
          customerEmailaddress,
          customerName,
          customerAddress,
          serviceNumber,
          trid,
        },
      });

      if (response.status !== 200) {
        this.isLoading = false;
        return null;
      }

      return response.data;
    } catch {
      this.isLoading = false;
      return null;
    }
  }

  _handleErrorCode(errorCode, trid) {
    const code = String(errorCode);

    return {
      code,
      trid,
      message: ERROR_MESSAGES[code] ?? DEFAULT_ERROR_MESSAGE,
    };
  }

  async _attemptSaveSubscription({ userId, days, amount, codepromo, onSaveSubscription }) {
    if (typeof onSaveSubscription !== "function") {
      return true;
    }

    try {
      await onSaveSubscription({ userId, days, amount, codepromo });
      return true;
    } catch {
      return false;
    }
  }

  async verifyTransaction({
    trid,
    userId,
    days,
    codepromo,
    amountFinal,
    onSaveSubscription,
    onTimeout,
    pollIntervalMs = POLL_INTERVAL_MS,
    timeoutMs = TIMEOUT_MS,
  }) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      try {
        const response = await this.sendPaymentRequestGet({
          path: "/verifytx",
          method: "GET",
          queryParams: { trid },
        });

        if (response.status === 200) {
          const responseData = response.data;

          if (Array.isArray(responseData) && responseData.length > 0) {
            const transactionData = responseData[0];

            if (transactionData?.status === "SUCCESS") {
              let saved = false;
              while (!saved) {
                saved = await this._attemptSaveSubscription({
                  userId,
                  days,
                  amount: Math.round(amountFinal),
                  codepromo,
                  onSaveSubscription,
                });

                if (!saved) {
                  await delay(3000);
                }
              }

              this.isLoading = false;
              return { status: "SUCCESS", trid };
            }

            if (transactionData?.status === "ERRORED") {
              this.isLoading = false;
              const error = this._handleErrorCode(transactionData?.errorCode, trid);
              return { status: "ERRORED", ...error };
            }
          }
        }
      } catch {
        // Keep polling (same behavior as the Dart controller).
      }

      await delay(pollIntervalMs);
    }

    this.isLoading = false;

    if (typeof onTimeout === "function") {
      onTimeout({ trid, message: TIMEOUT_ERROR_MESSAGE });
    }

    return {
      status: "TIMEOUT",
      code: "TIMEOUT",
      trid,
      message: TIMEOUT_ERROR_MESSAGE,
    };
  }

  async processWithdrawal({
    payItemId,
    amount,
    amountFinal,
    customerPhonenumber,
    customerEmailaddress,
    customerName,
    customerAddress,
    serviceNumber,
    trid,
    userId,
    days,
    codepromo = "",
    onSaveSubscription,
    onTimeout,
  }) {
    this.isLoading = true;

    const quoteId = await this.getQuoteId({ payItemId, amount });

    if (!quoteId) {
      this.isLoading = false;
      return {
        status: "QUOTE_ERROR",
        code: "QUOTE_ERROR",
        trid,
        message: "Unable to create quote. Please retry.",
      };
    }

    const withdrawalResponse = await this.performWithdrawal({
      quoteId,
      customerPhonenumber,
      customerEmailaddress,
      customerName,
      customerAddress,
      serviceNumber,
      trid,
    });

    if (!withdrawalResponse || Object.keys(withdrawalResponse).length === 0) {
      this.isLoading = false;
      return {
        status: "WITHDRAWAL_ERROR",
        code: "WITHDRAWAL_ERROR",
        trid,
        message: "An error occurred during withdrawal processing.",
      };
    }

    return this.verifyTransaction({
      trid,
      userId,
      days,
      codepromo,
      amountFinal,
      onSaveSubscription,
      onTimeout,
    });
  }
}

export default PaymentService;
export { DEFAULT_CONFIG };
