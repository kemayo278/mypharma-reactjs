import React, { useState } from 'react';

const Alert = ({ type, message,className }) => {
  const [visible, setVisible] = useState(true);

  const closeAlert = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
        <div className={`alert ${className}`}>
        <span className="closebtn" onClick={closeAlert}>&times;</span>
        <strong>{type}!</strong> {message}
        </div><br />
    </>
  );
};

export default Alert;
