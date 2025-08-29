import React from "react";
import "./NewUser.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NewUser = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="container" id="newUser">
      <div className="form-box">
        <h1 className="title">Novo Usuário</h1>
        <form className="form">
          <input
            type="text"
            placeholder="Nome"
            className="input"
            id="nameInput"
          />
          <input type="email" placeholder="Email" className="input" />
          <input type="tel" placeholder="Celular" className="input" />
          <input type="date" placeholder="Data nascimento" className="input" />

          <div className="password-container">
            <input type="password" placeholder="Senha" className="input half" />
            <input
              type="password"
              placeholder="Repita a senha"
              className="input half"
            />
          </div>

          <button className="submit-button">Criar</button>
        </form>
      </div>
    </div>
  );
};

export default NewUser;
