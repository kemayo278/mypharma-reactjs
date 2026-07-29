const KPAY_BASE = '/kpay/api/v1/payments';
const STORAGE_KEY = 'kpay_payment';
export const KPAY_EVENT = 'kpay:update';

let intervalId = null;

function getHeaders() {
  return {
    'X-API-Key': import.meta.env.VITE_KPAY_API_KEY,
    'X-Secret-Key': import.meta.env.VITE_KPAY_SECRET_KEY,
  };
}

function loadStored() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

function saveStored(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function stopInterval() {
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
}

function emit(detail) {
  window.dispatchEvent(new CustomEvent(KPAY_EVENT, { detail }));
}

async function pollOnce() {
  const s = loadStored();
  if (!s?.paymentId || s.status !== 'PENDING') { stopInterval(); return; }

  try {
    const res = await fetch(`${KPAY_BASE}/${s.paymentId}`, { headers: getHeaders() });
    const data = await res.json();

    if (data.status === 'COMPLETED') {
      stopInterval();
      const next = { ...s, status: 'COMPLETED' };
      saveStored(next);
      emit({ type: 'COMPLETED', data: next });
    } else if (data.status === 'FAILED') {
      stopInterval();
      const next = { ...s, status: 'FAILED', failureReason: data.failureReason || 'Paiement echoue.' };
      saveStored(next);
      emit({ type: 'FAILED', data: next });
    }
    // PENDING → keep polling
  } catch {
    // network error — keep polling silently
  }
}

export function start(paymentData) {
  stopInterval();
  saveStored({ ...paymentData, status: 'PENDING', startedAt: Date.now() });
  intervalId = setInterval(pollOnce, 5000);
}

export function getStored() {
  return loadStored();
}

export function clear() {
  stopInterval();
  localStorage.removeItem(STORAGE_KEY);
}

// Auto-resume polling if a PENDING payment survived a page reload
const _s = loadStored();
if (_s?.status === 'PENDING' && _s?.paymentId) {
  intervalId = setInterval(pollOnce, 5000);
}
