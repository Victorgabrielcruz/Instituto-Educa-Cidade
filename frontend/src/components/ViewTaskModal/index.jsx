import React from "react";
import "./style.css"; // Assumindo que você tem um arquivo CSS para modais

export function ViewTaskModal({ isOpen, onClose, task }) {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3 className="modal-title">Detalhes da Tarefa</h3>
        <p><b>Nome:</b> {task.title}</p>
        <p><b>Descrição:</b> {task.description}</p>
        <p><b>Prioridade:</b> {task.priority}</p>
        <div className="btn-container-view-tasks">
          <button onClick={onClose} className="cancelar">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}