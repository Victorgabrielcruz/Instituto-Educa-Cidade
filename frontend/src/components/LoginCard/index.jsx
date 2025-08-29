import "./style.css";
import logo from "../../assets/Logo-Educa-L-cor.png";
import React, { useState } from "react";
import api from "../../services/api";
import { useEffect } from "react";

export default function LoginCard() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const token =
        response.headers["authorization"] || response.headers["Authorization"];
      if (token) {
        localStorage.setItem("token", token);
        window.location.href = "/home";
      } else {
        setError("Token não recebido.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Credenciais inválidas. Tente novamente.");
    }
  };
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleLogin();
    }
  });
  return (
    <div>
      <div className="login">
        <div className="header-login">
          <img src={logo} alt="Educa Cidades" />
        </div>

        <input
          type="text"
          placeholder="Usuário"
          value={email}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="button-login"
          onClick={handleLogin}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        >
          Acessar
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
