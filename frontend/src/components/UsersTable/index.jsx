import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";

import ModalConfirmUserDeletion from "../ModalConfirmUserDeletion";
import ModalEditUser from "../ModalEditUser";
import CustomAlert from "../Alert/CustomAlert"; 
import api from "../../services/api";

const UsersTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null);

  const [alertMessage, setAlertMessage] = useState(""); 
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403) {
          triggerAlert("Token inválido. Redirecionando para o login.");
          navigate("/");
          return;
        }

        const data = response.data;
        setUsuarios(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        triggerAlert("Erro ao buscar usuários.");
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const abrirModalExclusao = (usuario) => {
    setUsuarioParaExcluir(usuario);
    setModalAberto(true);
  };

  const abrirModalEdicao = (usuario) => {
    setUsuarioParaEditar(usuario);
    setModalEditarAberto(true);
  };

  const fecharModalExclusao = () => {
    setModalAberto(false);
    setUsuarioParaExcluir(null);
  };

  const fecharModalEdicao = () => {
    setModalEditarAberto(false);
    setUsuarioParaEditar(null);
  };

  return (
    <main className="main">
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo de Acesso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.profiles}</td>
              <td className="acoes-cell">
                <button
                  className="icon-button edit"
                  title="Editar"
                  onClick={() => abrirModalEdicao(usuario)}
                >
                  <span className="material-icons">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-pencil"
                    >
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </span>
                </button>
                <button
                  className="icon-button delete"
                  title="Excluir"
                  onClick={() => abrirModalExclusao(usuario)}
                >
                  <span className="material-icons">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalConfirmUserDeletion
        isOpen={modalAberto}
        usuario={usuarioParaExcluir}
        token={token}
        onCancel={fecharModalExclusao}
        onDeleted={() => {
          setUsuarios((prev) =>
            prev.filter((u) => u.id !== usuarioParaExcluir.id)
          );
          fecharModalExclusao();
          triggerAlert("Usuário excluído com sucesso.");
        }}
      />

      <ModalEditUser
        isOpen={modalEditarAberto}
        usuario={usuarioParaEditar}
        token={token}
        onCancel={fecharModalEdicao}
        onUpdated={(usuarioAtualizado) => {
          setUsuarios((prev) =>
            prev.map((u) =>
              u.id === usuarioAtualizado.id ? usuarioAtualizado : u
            )
          );
          fecharModalEdicao();
          triggerAlert("Usuário atualizado com sucesso.");
        }}
      />

      {showAlert && (
        <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </main>
  );
};

export default UsersTable;