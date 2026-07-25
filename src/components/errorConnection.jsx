import React from 'react';
import { TriangleAlert, Wifi, Info } from 'lucide-react';
import '@assets/css/error-connection.css';

const ConnectionError = ({ onRetry }) => {
  return (
    <div className="connection-error-wrapper">
      <div className="connection-error-card">
        <div className="connection-error-icon-wrap">
          <TriangleAlert size={44} strokeWidth={2.4} aria-hidden="true" />
        </div>

        <p className="connection-error-title">
          Impossible de joindre le serveur
        </p>

        <p className="connection-error-subtitle">
          L'application n'arrive pas a communiquer avec le serveur. Verifiez votre connexion reseau puis reessayez.
        </p>

        <div className="connection-error-wifi-tip">
          <div className="connection-error-wifi-tip-icon">
            <Wifi size={18} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className="connection-error-wifi-tip-body">
            <span className="connection-error-wifi-tip-label">
              <Info size={13} strokeWidth={2.5} style={{ marginRight: 4, verticalAlign: 'middle' }} aria-hidden="true" />
              Vous avez du WiFi mais l'application ne charge pas&nbsp;?
            </span>
            <span className="connection-error-wifi-tip-text">
              Il est possible que vous ayez acces a Internet (YouTube, Google…) mais que le serveur de l'application soit temporairement indisponible ou bloque par votre reseau. Ce sont deux choses differentes — votre WiFi fonctionne, mais notre serveur n'est pas accessible depuis votre connexion actuelle.
            </span>
          </div>
        </div>

        <div className="connection-error-button-wrap">
          <button type="button" className="connection-error-button" onClick={() => onRetry && typeof onRetry === 'function' && onRetry()}>
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