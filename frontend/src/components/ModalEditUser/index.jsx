import React, { useEffect, useState } from "react";
import "./style.css";
import api from "../../services/api";
import CustomAlert from "../Alert/CustomAlert";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  profiles: "USER",
};

const ModalEditUser = ({ isOpen, usuario, token, onCancel, onUpdated }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseAlert = () => {
    setAlertMessage("");
  };

  useEffect(() => {
    if (usuario) {
      setFormData({
        name: usuario.name || "",
        email: usuario.email || "",
        password: "",
        profiles: usuario.profiles[0] || "USER",
      });
    }
  }, [usuario]);

  if (!isOpen || !usuario) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isPasswordValid = (password) => {
    if (!password) return true;
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

    if (!formData.email || !formData.profiles) {
      setAlertMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.password && !isPasswordValid(formData.password)) {
      setAlertMessage(
        "A nova senha deve conter no mínimo 8 caracteres, incluindo pelo menos 1 número, 1 letra minúscula e 1 caractere especial."
      );
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setAlertMessage("A nova senha deve conter no mínimo 8 caracteres.");
      return;
    }

    if (!usuario.id) {
      setAlertMessage("ID do usuário inválido.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        password: formData.password,
        profiles: [formData.profiles],
      };

      console.log(payload);
      const response = await api.put(`/users/${usuario.id}`, payload);

      setAlertMessage("Usuário atualizado com sucesso!");
      onUpdated(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      const message = error.response?.data?.message || "Erro desconhecido.";
      setAlertMessage(`Erro ao atualizar o usuário: ${message}`);
    }
  };

  return (
    <>
      {alertMessage && (
        <CustomAlert message={alertMessage} onClose={handleCloseAlert} />
      )}
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">Editar Usuário</h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            <input
              type="password"
              name="password"
              placeholder="Nova Senha (opcional)"
              value={formData.password}
              onChange={handleChange}
            />

            {formData.password && (
              <ul className="password-requirements">
                <li
                  className={
                    formData.password.length >= 8 ? "valid" : "invalid"
                  }
                >
                  ✔️ Mínimo 8 caracteres
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password) ? "valid" : "invalid"
                  }
                >
                  ✔️ Pelo menos 1 número
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                      ? "valid"
                      : "invalid"
                  }
                >
                  ✔️ Pelo menos 1 caractere especial
                </li>
                <li
                  className={
                    /[a-z]/.test(formData.password) ? "valid" : "invalid"
                  }
                >
                  ✔️ Pelo menos 1 letra minúscula
                </li>
              </ul>
            )}

            <select
              name="profiles"
              value={formData.profiles}
              onChange={handleChange}
              required
            >
              <option value="">Tipo de Acesso</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuário</option>
            </select>
            <div className="modal-buttons">
              <button
                type="button"
                className="cancel-button"
                onClick={onCancel}
              >
                Cancelar
              </button>
              <button type="submit" className="save-button">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalEditUser;
