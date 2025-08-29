import React, { useState, useEffect } from "react";
import "./style.css";

export function EditTaskModal({ isOpen, onClose, onSave, task }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("BAIXA");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "BAIXA");
    } else {
      setTitle("");
      setDescription("");
      setPriority("BAIXA");
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, priority });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-container-edittask">
        <h3 className="modal-title">
          {task ? "Editar Tarefa" : "Nova Tarefa"}
        </h3>
        <label htmlFor="modal-title">Nome</label>
        <input
          id="modal-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="Descrição">Descrição</label>
        <textarea
          className="modal-description"
          id="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="priority">
          <p>Prioridade</p>
          <select
            className="modal-priority"
            id="priority"
            name="Prioridade "
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </label>

        <div className="btn-container">
          <button type="button" onClick={onClose} className="cancelar">
            Cancelar
          </button>
          <button type="submit" className="salvar">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
