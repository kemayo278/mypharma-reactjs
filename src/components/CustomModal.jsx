import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '@assets/css/customModal.css';

const CustomModal = ({ isOpen, onClose, title, children, nb }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return ReactDOM.createPortal(
    <>
      <div className={`custom-modal-overlay ${isClosing ? 'hide' : ''}`} onClick={handleClose}></div>
      <div className={`custom-modal ${isClosing ? 'hide' : ''}`}>
        <div className="custom-modal-header">
          <h3>{title} {nb >= 1 ? <span className="text-primary"> ( {nb} ) </span> : null}</h3>
          <button onClick={handleClose} className="custom-modal-close">
            &times;
          </button>
        </div>
        <div className="custom-modal-body">
          {children}
        </div>
        <div className="custom-modal-footer" style={{ float: "right" }}>
          <div className="link-login" style={{ width: "100px" }}>
            <button style={{ borderRadius: "3px", padding: "4px", boxShadow: "1px 3px 3px grey" }} onClick={handleClose} type="button" className="login-light btn-close">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CustomModal;
