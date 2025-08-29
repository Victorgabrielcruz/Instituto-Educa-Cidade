import React from "react";
import "./styles.css";
import api from "../../services/api";

const ModalConfirmUserDeletion = ({ isOpen, usuario, token, onDeleted, onCancel }) => {
  if (!isOpen || !usuario) return null;

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${usuario.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Usuário excluído com sucesso!");
      onDeleted?.();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      const message = error.response?.data?.message || "Erro ao excluir o usuário.";
      alert(message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirmar Exclusão</h2>
        <p>
          Tem certeza que deseja excluir o usuário{" "}
          <strong>{usuario.name || usuario.email}</strong>?
        </p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Apagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmUserDeletion;
