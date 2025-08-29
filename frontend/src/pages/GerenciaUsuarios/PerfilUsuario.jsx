import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/NavBar";
import Title from "../../components/Title";
import CustomAlert from "../../components/Alert/CustomAlert";
import "./perfilUsuario.css";
import { useNavigate } from "react-router-dom";

function PerfilUsuario() {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });

  const [originalData, setOriginalData] = useState(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { id, name, email } = response.data;
        setForm({ id, name, email, password: "" });
        setOriginalData({ id, name, email });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        triggerAlert("Erro ao buscar dados do usuário.");
      }
    };

    fetchUsuario();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      triggerAlert("Nome e e-mail são obrigatórios.");
      return;
    }

    try {
      const dataToSend = {
        id: form.id,
        name: form.name,
        email: form.email,
      };

      if (form.password.trim() !== "") {
        dataToSend.password = form.password;
      }

      await api.put(`/users/${form.id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      triggerAlert("Perfil atualizado com sucesso!");
      setOriginalData({ ...dataToSend });
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      triggerAlert("Erro ao atualizar o perfil.");
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setForm({ ...originalData, password: "" });
    }
    navigate("/home");
  };

  return (
    <div className="container-perfil-usuario">
      <Navbar />
      <main>
        <Title title="Meu Usuário" number={1} />
        <div className="perfil-container">
          <div className="imagem-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Foto do usuário"
              className="user-image"
            />
          </div>

          <div className="projeto-info">
            <div class="Centralizar-Campos">
              <h3>Nome</h3>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <h3>Email</h3>
              <input
                id="input-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled
                style={{ color: "#666" }}
              />

              <h3>Senha</h3>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Digite uma nova senha"
              />
            </div>

            <div className="botoes">
              <button className="card-button-cancelar" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn-adicionar" onClick={handleSave}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="perfil-footer">
        <p>
          &copy; {new Date().getFullYear()} Instituto Educa Cidades. Todos os
          direitos reservados.
        </p>
      </footer>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default PerfilUsuario;
