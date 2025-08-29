import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import api from "../../services/api";
import NavBar from "../../components/NavBar";

import Logo from "../../assets/Logo-Educa-L-cor.png";

export function HomePage() {
  const [userName, setUserName] = useState("Usuário");
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/me");
        setUserName(response.data.name || "Usuário");

        const tasksResponse = await api.get("/users/my-tasks-count");
        setTotalTasks(tasksResponse.data || 0);

        setError(null);
      } catch (err) {
        if( err.response.status === 403 || token === null) {
          setError("Token inválido. Redirecionando para o login.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
          return;
        }

        console.error("Erro ao buscar dados do usuário:", err);
        setError("Não foi possível carregar as informações do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="home-container loading">
        <p>Carregando informações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container error">
        <p className="error-message">{error}</p>
        <p>Por favor, tente recarregar a página ou contate o suporte.</p>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      <NavBar />

      <div className="home-container">
        <header className="home-header">
          <h1>Bem-vindo(a), {userName}!</h1>
          <p className="system-description">
            Sistema de Gestão de Produtos e Projetos do Instituto Educa Cidades.
          </p>
        </header>

        <div className="logo-container">
          <img
            src={Logo}
            alt="Logo Instituto Educa Cidades"
            className="educacidades-logo"
          />
        </div>

        <section className="user-dashboard-section">
          <div className="user-tasks-card">
            <h2>Suas Tarefas</h2>
            <p className="tasks-count">{totalTasks}</p>
          </div>
        </section>

        <section className="home-cards-section">
          <div className="home-card">
            <h2>
              <Link to="/produtos">Produtos</Link>
            </h2>
            <p>Visualize e gerencie todos os produtos do Instituto.</p>
            <Link to="/produtos" className="home-card-button">
              Ver Produtos
            </Link>
          </div>

          <div className="home-card">
            <h2>
              <Link to="/projetos">Projetos</Link>
            </h2>
            <p>Acompanhe o andamento e detalhes dos projetos.</p>
            <Link to="/projetos" className="home-card-button">
              Ver Projetos
            </Link>
          </div>
        </section>

        <footer className="home-footer">
          <p>
            &copy; {new Date().getFullYear()} Instituto Educa Cidades. Todos os
            direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
}
