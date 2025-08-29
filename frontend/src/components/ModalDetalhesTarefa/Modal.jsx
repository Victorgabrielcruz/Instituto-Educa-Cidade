import React from "react";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}> × </button>
        {children}
      </div>
      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            position: relative;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .modal-close {
            position: absolute;
            top: 0px;
            right: 10px;
            background: #ff4d4f;
            color: white;
            border: none;
            border-radius: 5px;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          

          .modal-close:hover {
            background: #d9363e;
          }
        `}
      </style>
    </div>
  );
}

export default Modal;