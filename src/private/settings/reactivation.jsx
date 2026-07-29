import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, ShieldCheck, Ticket, X, Check, Copy } from 'lucide-react';
import axiosClient from '@/axios-client';
import { AuthContext } from '@context/AuthContext';
import { getDelayFromLocalStorage, saveDelayToLocalStorage } from '@local/Delay.js';
import {
  generateActivationKey,
  isActivationKeyFormatValid,
  isSubscriptionExpired,
  normalizeActivationKey,
  parseNbDelay,
} from '@services/subscription.js';
import * as kpayPoller from '@services/kpayPoller';
import Select from 'react-select';
import '@assets/css/reactivation.css';
import logoOrange from '@assets/imgs/payment/orange-money.png';
import logoMtn from '@assets/imgs/payment/mtn-money.webp';
import Swal from 'sweetalert2';

const KPAY_BASE = '/kpay/api/v1/payments';

const COUNTRIES = [
  {
    code: 'CMR', name: 'Cameroun', dialCode: '237', flag: '🇨🇲', currency: 'XAF',
    providers: [
      { id: 'mtn_cmr',    name: 'MTN Mobile Money', kpayProvider: 'MTN_MOMO_CMR', logoType: 'mtn' },
      { id: 'orange_cmr', name: 'Orange Money',      kpayProvider: 'ORANGE_CMR',   logoType: 'orange' },
    ],
  },
  {
    code: 'BEN', name: 'Bénin', dialCode: '229', flag: '🇧🇯', currency: 'XOF',
    providers: [
      { id: 'mtn_ben',  name: 'MTN Mobile Money', kpayProvider: 'MTN_MOMO_BEN', logoType: 'mtn' },
      { id: 'moov_ben', name: 'Moov Money',        kpayProvider: 'MOOV_BEN',     logoType: 'moov' },
    ],
  },
  {
    code: 'CIV', name: "Côte d'Ivoire", dialCode: '225', flag: '🇨🇮', currency: 'XOF',
    providers: [
      { id: 'mtn_civ',    name: 'MTN Mobile Money', kpayProvider: 'MTN_MOMO_CIV', logoType: 'mtn' },
      { id: 'orange_civ', name: 'Orange Money',      kpayProvider: 'ORANGE_CIV',   logoType: 'orange' },
    ],
  },
  {
    code: 'COD', name: 'RD Congo', dialCode: '243', flag: '🇨🇩', currency: 'CDF',
    providers: [
      { id: 'vodacom_cod', name: 'Vodacom M-Pesa', kpayProvider: 'VODACOM_MPESA_COD', logoType: 'mpesa' },
      { id: 'airtel_cod',  name: 'Airtel Money',   kpayProvider: 'AIRTEL_COD',         logoType: 'airtel' },
      { id: 'orange_cod',  name: 'Orange Money',   kpayProvider: 'ORANGE_COD',         logoType: 'orange' },
    ],
  },
  {
    code: 'GAB', name: 'Gabon', dialCode: '241', flag: '🇬🇦', currency: 'XAF',
    providers: [
      { id: 'airtel_gab', name: 'Airtel Money', kpayProvider: 'AIRTEL_GAB', logoType: 'airtel' },
    ],
  },
  {
    code: 'KEN', name: 'Kenya', dialCode: '254', flag: '🇰🇪', currency: 'KES',
    providers: [
      { id: 'mpesa_ken', name: 'M-Pesa', kpayProvider: 'MPESA_KEN', logoType: 'mpesa' },
    ],
  },
  {
    code: 'COG', name: 'Congo', dialCode: '242', flag: '🇨🇬', currency: 'XAF',
    providers: [
      { id: 'airtel_cog', name: 'Airtel Money',   kpayProvider: 'AIRTEL_COG',   logoType: 'airtel' },
      { id: 'mtn_cog',    name: 'MTN Mobile Money', kpayProvider: 'MTN_MOMO_COG', logoType: 'mtn' },
    ],
  },
  {
    code: 'RWA', name: 'Rwanda', dialCode: '250', flag: '🇷🇼', currency: 'RWF',
    providers: [
      { id: 'airtel_rwa', name: 'Airtel Money',    kpayProvider: 'AIRTEL_RWA',    logoType: 'airtel' },
      { id: 'mtn_rwa',    name: 'MTN Mobile Money', kpayProvider: 'MTN_MOMO_RWA', logoType: 'mtn' },
    ],
  },
  {
    code: 'SEN', name: 'Sénégal', dialCode: '221', flag: '🇸🇳', currency: 'XOF',
    providers: [
      { id: 'free_sen',   name: 'Free Money',  kpayProvider: 'FREE_SEN',    logoType: 'free' },
      { id: 'orange_sen', name: 'Orange Money', kpayProvider: 'ORANGE_SEN', logoType: 'orange' },
    ],
  },
  {
    code: 'SLE', name: 'Sierra Leone', dialCode: '232', flag: '🇸🇱', currency: 'SLE',
    providers: [
      { id: 'orange_sle', name: 'Orange Money', kpayProvider: 'ORANGE_SLE', logoType: 'orange' },
    ],
  },
  {
    code: 'UGA', name: 'Ouganda', dialCode: '256', flag: '🇺🇬', currency: 'UGX',
    providers: [
      { id: 'airtel_uga', name: 'Airtel Money',    kpayProvider: 'AIRTEL_OAPI_UGA', logoType: 'airtel' },
      { id: 'mtn_uga',    name: 'MTN Mobile Money', kpayProvider: 'MTN_MOMO_UGA',   logoType: 'mtn' },
    ],
  },
  {
    code: 'ZMB', name: 'Zambie', dialCode: '260', flag: '🇿🇲', currency: 'ZMW',
    providers: [
      { id: 'airtel_zmb', name: 'Airtel Money',    kpayProvider: 'AIRTEL_OAPI_ZMB', logoType: 'airtel' },
      { id: 'mtn_zmb',    name: 'MTN Mobile Money', kpayProvider: 'MTN_MOMO_ZMB',   logoType: 'mtn' },
      { id: 'zamtel_zmb', name: 'Zamtel',           kpayProvider: 'ZAMTEL_ZMB',      logoType: 'zamtel' },
    ],
  },
];

const LOGO_MAP = { mtn: logoMtn, orange: logoOrange };

const PROVIDER_COLORS = {
  mtn: '#FFCC00', orange: '#FF6600', airtel: '#E2001A',
  mpesa: '#00A651', moov: '#0070C0', free: '#FF0000',
  zamtel: '#006633',
};

function formatPhoneForKpay(phone, dialCode) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith(dialCode) ? digits : `${dialCode}${digits}`;
}

function kpayHeaders() {
  return {
    'X-API-Key': import.meta.env.VITE_KPAY_API_KEY,
    'X-Secret-Key': import.meta.env.VITE_KPAY_SECRET_KEY,
  };
}

const countryOptions = COUNTRIES.map((c) => ({
  value: c.code,
  label: c.name,
  flag: c.flag,
  dialCode: c.dialCode,
  country: c,
}));

const countrySelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: 12,
    border: `2px solid ${state.isFocused ? '#0f4a8a' : '#e2e8f0'}`,
    boxShadow: state.isFocused ? '0 0 0 4px rgba(15,74,138,0.1)' : 'none',
    padding: '2px 4px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    '&:hover': { borderColor: '#0f4a8a' },
  }),
  option: (base, state) => ({
    ...base,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: state.isSelected ? 700 : 500,
    backgroundColor: state.isSelected ? '#0f4a8a' : state.isFocused ? '#e6f0ff' : 'white',
    color: state.isSelected ? 'white' : '#102a43',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({ ...base, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }),
  menu: (base) => ({ ...base, borderRadius: 12, zIndex: 99999 }),
  indicatorSeparator: () => ({ display: 'none' }),
};

function formatCountryOption({ flag, label, dialCode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: '1.2rem' }}>{flag}</span>
      <span>{label}</span>
      <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: 'auto' }}>+{dialCode}</span>
    </div>
  );
}

function ProviderLogo({ provider }) {
  const img = LOGO_MAP[provider.logoType];
  if (img) {
    return <img src={img} alt={provider.name} style={{ width: '114px', height: '94px', objectFit: 'cover' }} />;
  }
  const color = PROVIDER_COLORS[provider.logoType] || '#888';
  return (
    <div style={{
      width: 80, height: 80, borderRadius: 12,
      background: color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.6rem',
    }}>
      {provider.name[0]}
    </div>
  );
}

const DEFAULT_COUNTRY = COUNTRIES.find(c => c.code === 'CMR');

export default function Reactivation() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const delayState = getDelayFromLocalStorage();
  const remainingDays = parseNbDelay(delayState.nbDelay);
  const subscriptionExpired = useMemo(() => isSubscriptionExpired(remainingDays), [remainingDays]);

  const [generatedKey, setGeneratedKey] = useState('');
  const [activationKey, setActivationKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const showError = (msg) => {
    setError(msg);
    Swal.fire({
      toast: true, position: 'top-end', icon: 'error', title: msg,
      showConfirmButton: false, timer: 4000, timerProgressBar: true,
      customClass: { container: 'swal-above-modal' },
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('698495395');
  const [licenses, setLicenses] = useState([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');
  const [modalPaymentError, setModalPaymentError] = useState('');
  const [modalPaymentInfo, setModalPaymentInfo] = useState('');
  const [isPaymentInBackground, setIsPaymentInBackground] = useState(false);
  const [isPaymentTimedOut, setIsPaymentTimedOut] = useState(false);

  const timeoutRef = useRef(null);
  const PAYMENT_TIMEOUT_MS = 90_000;

  const clearPaymentTimeout = () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  };

  const schedulePaymentTimeout = (startedAt) => {
    clearPaymentTimeout();
    const remaining = PAYMENT_TIMEOUT_MS - (Date.now() - startedAt);
    if (remaining <= 0) { setIsPaymentTimedOut(true); return; }
    timeoutRef.current = setTimeout(() => setIsPaymentTimedOut(true), remaining);
  };

  const handleCancelPayment = () => {
    clearPaymentTimeout();
    kpayPoller.clear();
    setIsPaymentInBackground(false);
    setIsPaymentTimedOut(false);
    setModalPaymentInfo('');
    setModalPaymentError('');
    setError('');
    setSelectedDuration(null);
    setSelectedProvider(null);
    setPhoneNumber('');
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedProvider(null);
    setPhoneNumber('');
  };

  const subscriptionPlans = [
    { id: '1month',  duration: '1 mois', days: 30,  price: 50000,  label: '1 Mois' },
    { id: '3months', duration: '3 mois', days: 90,  price: 150000, label: '3 Mois', popular: true },
    { id: '6months', duration: '6 mois', days: 180, price: 285000, label: '6 Mois', savings: '5%' },
    { id: '9months', duration: '9 mois', days: 270, price: 450000, label: '9 Mois' },
    { id: '1year',   duration: '1 an',   days: 365, price: 498000, label: '1 An',   savings: '17%' },
  ];

  const fetchLicenses = async () => {
    if (!currentUser?.id) { setLicenses([]); return; }
    setIsLoadingLicenses(true);
    try {
      const { data } = await axiosClient.get('/licenses', { user_id: currentUser.id });
      setLicenses(Array.isArray(data?.data) ? data.data : []);
    } catch {
      setLicenses([]);
    } finally {
      setIsLoadingLicenses(false);
    }
  };

  useEffect(() => { fetchLicenses(); }, [currentUser?.id]);

  const onPollerCompletedRef = useRef(null);
  onPollerCompletedRef.current = async (stored) => {
    setIsPaymentInBackground(true);
    try {
      const { data: licenseData } = await axiosClient.post('/licenses', {
        user_id: currentUser?.id,
        duration_days: stored.planSnapshot.days,
        amount: stored.planSnapshot.price,
        payment_method: stored.methodSnapshot,
        phone_number: stored.formattedPhone,
        trid: stored.paymentId,
      });
      const createdLicense =
        licenseData?.license || licenseData?.data?.license || licenseData?.data || null;
      const key = createdLicense?.activationKey || generateActivationKey();
      await fetchLicenses();
      setGeneratedKey(key);
      setActivationKey(key);
      setSuccess(`Paiement confirme via ${stored.methodSnapshot}. Cle generee: ${key}`);
      setModalPaymentInfo('');
      setModalPaymentError('');
      setError('');
    } catch (licErr) {
      const apiMsg = licErr?.response?.data?.message;
      const msg = apiMsg || 'Paiement reçu mais erreur lors de la creation de la licence.';
      showError(msg);
      setModalPaymentError(msg);
      setModalPaymentInfo('');
    } finally {
      setIsPaymentInBackground(false);
      setIsPaymentTimedOut(false);
      clearPaymentTimeout();
      kpayPoller.clear();
    }
  };

  useEffect(() => {
    const stored = kpayPoller.getStored();

    if (stored?.status === 'COMPLETED') {
      onPollerCompletedRef.current(stored);
    } else if (stored?.status === 'FAILED') {
      const msg = stored.failureReason || 'Paiement echoue. Veuillez reessayer.';
      showError(msg);
      setIsPaymentInBackground(false);
      kpayPoller.clear();
    } else if (stored?.status === 'PENDING') {
      setIsPaymentInBackground(true);
      setModalPaymentInfo('Paiement en cours en arriere-plan. Validez la demande sur votre telephone.');
      if (stored.startedAt) schedulePaymentTimeout(stored.startedAt);
    }

    const onUpdate = (e) => {
      const { type, data } = e.detail;
      if (type === 'COMPLETED') {
        clearPaymentTimeout();
        onPollerCompletedRef.current(data);
      } else if (type === 'FAILED') {
        clearPaymentTimeout();
        const msg = data.failureReason || 'Paiement echoue. Veuillez reessayer.';
        showError(msg);
        setModalPaymentError(msg);
        setModalPaymentInfo('');
        setIsPaymentInBackground(false);
        setIsPaymentTimedOut(false);
        kpayPoller.clear();
      }
    };

    window.addEventListener(kpayPoller.KPAY_EVENT, onUpdate);
    return () => window.removeEventListener(kpayPoller.KPAY_EVENT, onUpdate);
  }, []);

  const handleGenerateKey = () => {
    setShowModal(true);
    setError('');
    setSuccess('');
    if (!isPaymentInBackground) {
      setModalPaymentError('');
      setModalPaymentInfo('');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!isPaymentInBackground) {
      setSelectedDuration(null);
      setSelectedProvider(null);
      setPhoneNumber('');
    }
  };

  const handleConfirmPurchase = async () => {
    if (!selectedDuration || !selectedProvider) {
      const msg = 'Veuillez selectionner une duree et une methode de paiement.';
      showError(msg); setModalPaymentError(msg); return;
    }
    if (!currentUser?.id) {
      const msg = 'Utilisateur invalide. Veuillez vous reconnecter.';
      showError(msg); setModalPaymentError(msg); return;
    }

    const selectedPlan = subscriptionPlans.find(p => p.id === selectedDuration);
    if (!selectedPlan) {
      const msg = 'Forfait invalide. Veuillez reessayer.';
      showError(msg); setModalPaymentError(msg); return;
    }

    const formattedPhone = formatPhoneForKpay(phoneNumber, selectedCountry.dialCode);
    const externalId = `ORDER-${currentUser.id}-${Date.now()}`;

    setIsSubmitting(true);
    setModalPaymentError('');
    setError('');
    setModalPaymentInfo('');

    try {
      const initRes = await fetch(`${KPAY_BASE}/init`, {
        method: 'POST',
        headers: { ...kpayHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.price,
          provider: selectedProvider.kpayProvider,
          phoneNumber: formattedPhone,
          externalId,
        }),
      });

      const initData = await initRes.json();

      if (!initRes.ok || !initData.id) {
        throw new Error(initData.message || `Erreur HTTP ${initRes.status}`);
      }

      const startedAt = Date.now();
      kpayPoller.start({
        paymentId: initData.id,
        planSnapshot: { ...selectedPlan },
        methodSnapshot: selectedProvider.name,
        formattedPhone,
        userId: currentUser.id,
        startedAt,
      });

      setIsPaymentTimedOut(false);
      schedulePaymentTimeout(startedAt);
      setIsPaymentInBackground(true);
      setIsSubmitting(false);
      setModalPaymentInfo(
        initData.message ||
        'Paiement initie. Validez la demande sur votre telephone. Le statut est verifie en arriere-plan.'
      );
    } catch (err) {
      const msg = err.message || "Erreur lors de l'initiation du paiement.";
      showError(msg);
      setModalPaymentError(msg);
      setIsPaymentInBackground(false);
      setIsSubmitting(false);
    }
  };

  const handleKeyChange = (event) => {
    setActivationKey(normalizeActivationKey(event.target.value));
  };

  const copyActivationKey = async (key) => {
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1600);
    } catch {
      showError('Impossible de copier la cle automatiquement.');
    }
  };

  const handleReactivate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!isActivationKeyFormatValid(activationKey)) {
      showError('La cle doit respecter le format XXXX-XXXX-XXXX-XXXX.');
      return;
    }

    Swal.fire({
      title: "Confirmer l'achat",
      text: `Vous vous apprêtez à acheter un forfait de ${subscriptionPlans.find(p => p.id === selectedDuration)?.label} pour ${subscriptionPlans.find(p => p.id === selectedDuration)?.price.toLocaleString()} FCFA via ${selectedProvider?.name}. Confirmez-vous cette action ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Non, annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('User confirmed purchase');
      }
    });

    setIsSubmitting(true);

    try {
      const payload = { activation_key: activationKey, user_id: currentUser?.id };
      const { data } = await axiosClient.post('/licenses/reactivate', payload);

      const nextDateEnd = data?.dateEnd ?? data?.data?.dateEnd;
      const nextMessage = data?.message ?? data?.data?.message ?? 'Forfait reactive avec succes.';
      const nextNbDelay = data?.nbDelay ?? data?.data?.nbDelay;

      if (nextNbDelay !== undefined) {
        saveDelayToLocalStorage(nextDateEnd, nextMessage, nextNbDelay);
      }

      setSuccess('Forfait reactive avec succes.');
      if (!isSubscriptionExpired(nextNbDelay)) {
        setTimeout(() => navigate('/home'), 1200);
      }
    } catch (err) {
      const apiMessage = err?.response?.data?.error;
      showError(apiMessage || 'Activation impossible. Verifiez la cle et reessayez.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reactivation-page">
      <div className="reactivation-bg-shape shape-a"></div>
      <div className="reactivation-bg-shape shape-b"></div>

      <div className="reactivation-card">
        <div className="reactivation-head">
          <div className="reactivation-badge">
            <ShieldCheck size={20} />
            <span>{subscriptionExpired ? 'Acces verrouille' : 'Gestion du forfait'}</span>
          </div>

          {!subscriptionExpired && (
            <button type="button" className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Retour
            </button>
          )}
        </div>

        <h1>Reactivation du forfait</h1>
        <p className="reactivation-subtitle">
          {subscriptionExpired
            ? "Votre forfait est expire. L'application est verrouillee jusqu'a reactivation."
            : 'Generez une cle et activez un nouveau forfait.'}
        </p>

        <div className="subscription-state">
          <span>Etat actuel:</span>
          <strong className={subscriptionExpired ? 'state-expired' : 'state-active'}>
            {subscriptionExpired ? 'Expire' : `${remainingDays} jour(s) restant(s)`}
          </strong>
        </div>

        <form onSubmit={handleReactivate} className="reactivation-form">
          <label htmlFor="activation-key">Cle de reactivation</label>
          <input
            id="activation-key"
            type="text"
            value={activationKey}
            onChange={handleKeyChange}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            maxLength={19}
            autoComplete="off"
          />

          <div className="reactivation-actions">
            <button type="button" className="generate-btn" onClick={handleGenerateKey}>
              <Ticket size={16} /> Generer une cle
            </button>
            <button type="submit" className="activate-btn" disabled={isSubmitting}>
              <RefreshCcw size={16} /> {isSubmitting ? 'Activation...' : 'Activer le forfait'}
            </button>
          </div>
        </form>

        {generatedKey && (
          <p className="generated-key">
            Cle generee: <code>{generatedKey}</code>
          </p>
        )}

        {error && <p className="reactivation-message error">{error}</p>}
        {success && <p className="reactivation-message success">{success}</p>}
        {isPaymentInBackground && !showModal && (
          <div className="payment-bg-banner">
            <p className="reactivation-message info" style={{ margin: 0 }}>
              Paiement en cours en arriere-plan. Ouvrez "Generer une cle" pour suivre l'etat.
            </p>
            {isPaymentTimedOut && (
              <button type="button" className="cancel-payment-btn" onClick={handleCancelPayment}>
                Paiement bloque — Annuler et reessayer
              </button>
            )}
          </div>
        )}

        <div className="licenses-block">
          <div className="licenses-head">
            <h3>Licences</h3>
            <button
              type="button"
              className="licenses-refresh"
              onClick={fetchLicenses}
              disabled={isLoadingLicenses}
            >
              {isLoadingLicenses ? 'Chargement...' : 'Actualiser'}
            </button>
          </div>

          {!isLoadingLicenses && licenses.length === 0 && (
            <p className="licenses-empty">Aucune licence disponible.</p>
          )}

          {licenses.length > 0 && (
            <div className="licenses-list">
              {licenses.map((license) => (
                <div className="license-item" key={license.id}>
                  <div className="license-top">
                    <code>{license.activationKey}</code>
                    <button
                      type="button"
                      className="copy-key-btn"
                      onClick={() => copyActivationKey(license.activationKey)}
                      title="Copier la cle"
                      aria-label="Copier la cle"
                    >
                      {copiedKey === license.activationKey
                        ? <Check size={16} color='white' />
                        : <Copy size={16} color='white' />}
                    </button>
                  </div>
                  <div className="license-meta">
                    <span>{license.durationDays} jours</span>
                    <span>{Number(license.amount || 0).toLocaleString()} FCFA</span>
                    <span>{license.paymentMethod || '-'}</span>
                    <span>
                      Periode: {license.beginDate || license.config?.config_begin || '-'} au{' '}
                      {license.endDate || license.config?.config_end || '-'}
                    </span>
                    <span className={license.isActive ? 'license-active' : 'license-inactive'}>
                      {license.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="subscription-modal-overlay" onClick={handleCloseModal}>
          <div className="subscription-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Choisissez votre forfait</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <p className="reactivation-message info modal-warning" style={{ width: '94%', marginLeft: 'auto', marginRight: 'auto' }}>
              Opération sensible : si vous avez besoin d'aide pour effectuer cette opération,
              veuillez contacter le support pour assistance (support.erp@kokitechgroup.com)
            </p>

            <div className="modal-body">

              {/* Durée */}
              <div className="duration-section">
                <h3>Duree de l'abonnement</h3>
                <div className="duration-grid">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`duration-card ${selectedDuration === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                      onClick={() => setSelectedDuration(plan.id)}
                    >
                      {plan.popular && <span className="popular-badge">Populaire</span>}
                      {plan.savings && <span className="savings-badge">-{plan.savings}</span>}
                      <div className="duration-label">{plan.label}</div>
                      <div className="duration-price">{plan.price.toLocaleString()} FCFA</div>
                      <div className="duration-detail">{plan.duration}</div>
                      {selectedDuration === plan.id && (
                        <div className="selected-icon"><Check size={18} /></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pays */}
              <div className="country-section">
                <h3>Pays</h3>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(o => o.value === selectedCountry.code)}
                  onChange={(opt) => handleCountryChange(opt.country)}
                  styles={countrySelectStyles}
                  formatOptionLabel={formatCountryOption}
                  isSearchable
                  placeholder="Choisir un pays..."
                />
              </div>

              {/* Téléphone */}
              <div className="phone-section">
                <h3>Numero de telephone</h3>
                <div className="phone-input-wrapper">
                  <span className="phone-dial-code">+{selectedCountry.dialCode}</span>
                  <input
                    type="tel"
                    className="phone-input with-dial"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="699123456"
                  />
                </div>
                <p className="phone-hint">Entrez le numero qui recevra la demande de paiement</p>
              </div>

              {/* Méthode de paiement — dépend du pays */}
              <div className="payment-section">
                <h3>Methode de paiement</h3>
                <div className="payment-grid">
                  {selectedCountry.providers.map((provider) => (
                    <div
                      key={provider.id}
                      className={`payment-card ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      <div className="payment-logo">
                        <ProviderLogo provider={provider} />
                      </div>
                      <div className="payment-name">{provider.name}</div>
                      {selectedProvider?.id === provider.id && (
                        <div className="selected-icon"><Check size={18} /></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Récapitulatif */}
              <div className="modal-summary">
                {selectedDuration && selectedProvider && (
                  <div className="summary-details">
                    <span>Total a payer:</span>
                    <strong>
                      {subscriptionPlans.find((p) => p.id === selectedDuration)?.price.toLocaleString()} {selectedCountry.currency}
                    </strong>
                  </div>
                )}
              </div>

              {modalPaymentInfo && <p className="reactivation-message info">{modalPaymentInfo}</p>}
              {modalPaymentError && <p className="reactivation-message error">{modalPaymentError}</p>}

              {isPaymentInBackground && isPaymentTimedOut && (
                <div className="payment-timeout-banner">
                  <p className="payment-timeout-msg">
                    Le paiement est en attente depuis plus d'1 min 30. Vous pouvez l'annuler et en lancer un nouveau.
                  </p>
                  <button type="button" className="cancel-payment-btn" onClick={handleCancelPayment}>
                    Annuler et reessayer
                  </button>
                </div>
              )}
              <br />

              <button
                className="confirm-purchase-btn"
                onClick={handleConfirmPurchase}
                disabled={
                  !selectedDuration || !selectedProvider ||
                  !phoneNumber || phoneNumber.length < 6 ||
                  isSubmitting || (isPaymentInBackground && !isPaymentTimedOut)
                }
              >
                {isSubmitting
                  ? 'Traitement...'
                  : (isPaymentInBackground && !isPaymentTimedOut)
                    ? 'Paiement en cours...'
                    : "Confirmer l'achat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
