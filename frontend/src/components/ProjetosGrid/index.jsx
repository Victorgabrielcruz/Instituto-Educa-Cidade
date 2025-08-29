import { useEffect, useState } from "react";
import "./style.css";
import Card from "../CardProjetos";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Grid({ Token, pesquisa }) {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const showAlert = (message) => {
    const alertElement = document.createElement("div");
    alertElement.className = "alert";
    alertElement.textContent = message;
    document.body.appendChild(alertElement);

    setTimeout(() => {
      alertElement.remove();
    }, 3000);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let response;
        if (pesquisa) {
          response = await api.get("/projects/by-title", {
            params: { title: pesquisa },
          });
        } else {
          response = await api.get("/projects");
        }

        if (response.status === 403) {
          alert(`Token inválido. Redirecionando para o login.`);
          navigate("/");
          return;
        }

        const data = response.data;
        setProjects(data);

        if (pesquisa && data.length === 0) {
          showAlert("Nenhum produto encontrado com esse título.");
          return;
        }
        
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchProjects();
  }, [Token, navigate, pesquisa]);

  return (
    <div className="project-grid">
    {projects.length === 0 ? 
      <h3>Não há projetos cadastrados</h3>
    : (
      projects.map((project) => (
        <Card key={project.id} title={project.title} id={project.id} />
      ))
    )}
    </div>
  );
}
