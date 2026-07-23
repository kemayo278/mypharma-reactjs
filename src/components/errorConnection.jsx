import React from 'react';
import { TriangleAlert } from 'lucide-react';
import '@assets/css/error-connection.css';

const ConnectionError = ({ onRetry }) => {
  return (
    <div className="connection-error-wrapper">
      <div className="connection-error-card">
        <div className="connection-error-icon-wrap">
          <TriangleAlert size={44} strokeWidth={2.4} aria-hidden="true" />
        </div>

        <p className="connection-error-title">
          Verification de connexion requise
        </p>

        <p className="connection-error-subtitle">
          Verifiez votre connexion reseau puis relancez la requete avec le bouton ci-dessous.
        </p>

        <div className="connection-error-button-wrap">
          <button type="button" className="connection-error-button" onClick={onRetry}>
            Reessayer
          </button>
        </div>

        <p className="connection-error-help-text">
          Si le probleme persiste, il peut provenir du fournisseur reseau (MTN, Orange, Camtel). Effectuez l'operation manuellement puis revenez pour la mise a jour.
        </p>
      </div>
    </div>
  );
};

export default ConnectionError;