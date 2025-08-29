import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import api from "../../services/api";
import CustomAlert from "../Alert/CustomAlert";

const ModalNewUser = ({ isOpen, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
    tipoAcesso: "",
  });

  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseAlert = () => {
    setAlertMessage("");
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isPasswordValid = (password) => {
    const minLength = /.{8,}/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const hasLowerCase = /[a-z]/;

    return (
      minLength.test(password) &&
      hasNumber.test(password) &&
      hasSpecialChar.test(password) &&
      hasLowerCase.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.senha || !formData.email) {
      setAlertMessage(
        "Por favor, preencha os campos obrigatórios: Senha, Email e Nome."
      );
      return;
    }

    if (formData.confirmSenha !== formData.senha) {
      setAlertMessage("As senhas não coincidem!");
      return;
    }

    if (!isPasswordValid(formData.senha)) {
      setAlertMessage(
        "A senha deve conter no mínimo 8 caracteres, incluindo pelo menos 1 número, 1 letra minúscula e 1 caractere especial."
      );
      return;
    }

    try {
      await api.post("/users", {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        profiles: [formData.tipoAcesso],
      });

      setAlertMessage("Usuário criado com sucesso!");
      setTimeout(() => {
        onCancel();
        navigate(`/gerenciarUsuarios?token=${token}`);
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar o usuário:", error);
      setAlertMessage(`Erro ao salvar o usuário: ${error.message}`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <>
      {alertMessage && (
        <CustomAlert message={alertMessage} onClose={handleCloseAlert} />
      )}
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">Criar Usuário</h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />

            <ul className="password-requirements">
              <li
                className={
                  formData.senha.length >= 8 ? "valid" : "invalid"
                }
              >
                ✔️ Mínimo 8 caracteres
              </li>
              <li
                className={/[0-9]/.test(formData.senha) ? "valid" : "invalid"}
              >
                ✔️ Pelo menos 1 número
              </li>
              <li
                className={
                  /[!@#$%^&*(),.?":{}|<>]/.test(formData.senha)
                    ? "valid"
                    : "invalid"
                }
              >
                ✔️ Pelo menos 1 caractere especial
              </li>
              <li
                className={/[a-z]/.test(formData.senha) ? "valid" : "invalid"}
              >
                ✔️ Pelo menos 1 letra minúscula
              </li>
            </ul>

            <input
              type="password"
              name="confirmSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmSenha}
              onChange={handleChange}
              required
            />
            <select
              name="tipoAcesso"
              value={formData.tipoAcesso}
              onChange={handleChange}
              required
            >
              <option value="">Tipo de Acesso</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuário</option>
            </select>
            <div className="modal-form__footer">
              <button className="button cancelar-button" onClick={onCancel}>
                Cancelar
              </button>
              <button type="submit" className="button criar-button">
                Criar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalNewUser;
