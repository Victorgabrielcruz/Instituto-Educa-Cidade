import "./style.css";
import { Link } from "react-router-dom";
import api from "../../services/api";
import CustomAlert from "../Alert/CustomAlert";
import { useState } from "react";

export default function ProdutoProjetoCard({ title, id }) {

  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseAlert = () => {
    setAlertMessage("");
  };

  const handleDelete = (e) => {
    e.preventDefault();

    api.delete(`/projects-products/${id}`)
      .then(() => {
        console.log(`Produto com ID: ${id} deletado com sucesso.`);
        setAlertMessage("Produto deletado com sucesso!");
        setTimeout(() => window.location.reload(), 1000); 
      })
      .catch((error) => {
        console.error("Erro ao deletar produto:", error);
        setAlertMessage("Erro ao deletar produto, verifique se todas tarefas do produto foram removidas.");
      });
  }

  return (
    <>
    <Link to={`/detalhesProduto/${encodeURIComponent(id)}`}>
      <div className="card">
        <button className="btn-delete" onClick={handleDelete}>
          <span class="material-symbols-outlined">delete</span>
        </button>
        <h2 className="card-title">{title}</h2>
      </div>
    </Link>
    {alertMessage && <CustomAlert message={alertMessage} onClose={handleCloseAlert} />}
    </>
  );
}
