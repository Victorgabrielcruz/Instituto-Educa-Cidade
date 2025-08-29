import React from "react";
import "./ModalConfirm.css";

function ModalConfirm({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-generic">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons-generic">
          <button className="cancel-button-generic" onClick={onCancel}>
            Cancelar
          </button>
          <button className="delete-button-generic" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirm;
