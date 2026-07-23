import React from 'react';
import Empty from '@assets/imgs/empty.png'
import '@assets/css/empty-state.css';

const EmptyFetch = ({ onRetry, title }) => {
  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-card">
        <img src={Empty} alt="Aucune donnee" className="empty-state-image" />

        <p className="empty-state-title">{title || 'Aucune donnee disponible pour le moment.'}</p>
        <p className="empty-state-subtitle">Verifiez votre connexion ou relancez le chargement.</p>

        <div className="empty-state-button-wrap">
          <button type="button" className="empty-state-button" onClick={onRetry}>
            Actualiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyFetch;