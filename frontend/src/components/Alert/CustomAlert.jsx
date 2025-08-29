import React, { useEffect } from 'react';
import './CustomAlert.css'; 

const CustomAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer); 
  }, [onClose]);

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-modal">
        <span className="custom-alert-close" onClick={onClose}>
          ×
        </span>
        <div>{message}</div>
      </div>
    </div>
  );
};

export default CustomAlert;