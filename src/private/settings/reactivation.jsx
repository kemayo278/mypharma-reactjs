import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import '@assets/css/reactivation.css';
import logoOrange from '@assets/imgs/payment/orange-money.png';
import logoMtn from '@assets/imgs/payment/mtn-money.webp';

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
  const [showModal, setShowModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenses, setLicenses] = useState([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  const subscriptionPlans = [
    { id: '1month', duration: '1 mois', days: 30, price: 5000, label: '1 Mois' },
    { id: '3months', duration: '3 mois', days: 90, price: 13500, label: '3 Mois', popular: true },
    { id: '6months', duration: '6 mois', days: 180, price: 25000, label: '6 Mois' },
    { id: '1year', duration: '1 an', days: 365, price: 45000, label: '1 An', savings: '25%' },
  ];

  const paymentMethods = [
    { id: 'orange', name: 'Orange Money', logo: '🟠', color: '#FF6600', image : logoOrange },
    { id: 'mtn', name: 'MTN Mobile Money', logo: '🟡', color: '#FFCC00', image : logoMtn },
  ];

  const fetchLicenses = async () => {
    if (!currentUser?.id) {
      setLicenses([]);
      return;
    }

    setIsLoadingLicenses(true);
    try {
      const { data } = await axiosClient.get('/licenses', { user_id: currentUser.id });
      setLicenses(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setLicenses([]);
    } finally {
      setIsLoadingLicenses(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, [currentUser?.id]);

  const handleGenerateKey = () => {
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDuration(null);
    setSelectedPaymentMethod(null);
    setPhoneNumber('');
  };

  const handleConfirmPurchase = async () => {
    if (!selectedDuration || !selectedPaymentMethod) {
      setError('Veuillez selectionner une duree et une methode de paiement.');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Veuillez entrer un numero de telephone valide.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedPlan = subscriptionPlans.find(p => p.id === selectedDuration);
      
      // Simuler l'appel API pour initier le paiement
      const payload = {
        user_id: currentUser?.id,
        duration_days: selectedPlan.days,
        amount: selectedPlan.price,
        payment_method: selectedPaymentMethod,
        phone_number: phoneNumber,
      };

      const { data } = await axiosClient.post('/licenses', payload);

      // Générer une clé après paiement réussi
      const key = data?.license?.activationKey || generateActivationKey();
      setGeneratedKey(key);
      setActivationKey(key);
      setError('');
      fetchLicenses();
      
      setSuccess(`Paiement initie avec succes via ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}. Cle generee: ${key}`);
      handleCloseModal();
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      console.error('Erreur lors de l\'achat:', err);
      setError(apiMessage || 'Erreur lors de l\'achat. Veuillez reessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyChange = (event) => {
    setActivationKey(normalizeActivationKey(event.target.value));
  };

  const copyActivationKey = async (key) => {
    if (!key) {
      return;
    }

    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1600);
    } catch (err) {
      setError('Impossible de copier la cle automatiquement.');
    }
  };

  const handleReactivate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!isActivationKeyFormatValid(activationKey)) {
      setError('La cle doit respecter le format XXXX-XXXX-XXXX-XXXX.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        activation_key: activationKey,
        user_id: currentUser?.id,
      };

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
      setError(apiMessage || 'Activation impossible. Verifiez la cle et reessayez.');
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
            <button type="button" className="generate-btn" disabled={true}>
            {/* <button type="button" className="generate-btn" onClick={handleGenerateKey} disabled={true}> */}
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
                      {copiedKey === license.activationKey ? <Check size={16} color='white' /> : <Copy size={16} color='white' />}
                    </button>
                  </div>
                  <div className="license-meta">
                    <span>{license.durationDays} jours</span>
                    <span>{Number(license.amount || 0).toLocaleString()} FCFA</span>
                    <span>{license.paymentMethod || '-'}</span>
                    <span>
                      Periode: {(license.beginDate || license.config?.config_begin || '-')} au {(license.endDate || license.config?.config_end || '-')}
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

            <div className="modal-body">
              <div className="duration-section">
                <h3>Duree de l'abonnement</h3>
                <div className="duration-grid">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`duration-card ${
                        selectedDuration === plan.id ? 'selected' : ''
                      } ${plan.popular ? 'popular' : ''}`}
                      onClick={() => setSelectedDuration(plan.id)}
                    >
                      {plan.popular && <span className="popular-badge">Populaire</span>}
                      {plan.savings && <span className="savings-badge">-{plan.savings}</span>}
                      <div className="duration-label">{plan.label}</div>
                      <div className="duration-price">{plan.price.toLocaleString()} FCFA</div>
                      <div className="duration-detail">{plan.duration}</div>
                      {selectedDuration === plan.id && (
                        <div className="selected-icon">
                          <Check size={18} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="phone-section">
                <h3>Numero de telephone</h3>
                <input
                  type="tel"
                  className="phone-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Ex: 699123456"
                  maxLength={9}
                />
                <p className="phone-hint">Entrez le numero qui recevra la demande de paiement</p>
              </div>

              <div className="payment-section">
                <h3>Methode de paiement</h3>
                <div className="payment-grid">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`payment-card ${
                        selectedPaymentMethod === method.name ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.name)}
                    >
                      <div className="payment-logo" style={{ color: method.color }}>
                        <img src={method.image} alt={method.name} style={{ width: '114px', height: '94px', objectFit:"cover" }} />
                      </div>
                      <div className="payment-name">{method.name}</div>
                      {selectedPaymentMethod === method.name && (
                        <div className="selected-icon">
                          <Check size={18} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-summary">
                {selectedDuration && selectedPaymentMethod && (
                  <div className="summary-details">
                    <span>Total a payer:</span>
                    <strong>
                      {subscriptionPlans.find((p) => p.id === selectedDuration)?.price.toLocaleString()} FCFA
                    </strong>
                  </div>
                )}
              </div>

              <button
                className="confirm-purchase-btn"
                onClick={handleConfirmPurchase}
                disabled={!selectedDuration || !selectedPaymentMethod || !phoneNumber || phoneNumber.length < 9 || isSubmitting}
              >
                {isSubmitting ? 'Traitement...' : 'Confirmer l\'achat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
