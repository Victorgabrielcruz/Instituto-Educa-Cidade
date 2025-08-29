import { useState } from "react";
import Navbar from "../../components/NavBar";
import Grid from "../../components/ProjetosGrid";
import Title from "../../components/Title";
import ModalFormulario from "../../components/ModalFormProject/ModalFormulario";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./gerenciaProjeto.css";

function GerenciaProjetos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <>
      <div className="container-gerencia-projetos">
        <Navbar />
        <div className="main-content-wrapper-projetos">
          <main className="content-beta-projetos">
            <Title title="Projetos" number={1} />
            <div className="pesquisar">
              <button onClick={() => setModalAberto(true)}>Criar</button>
              <div className="barra-pesquisa">
                <input
                  type="text"
                  placeholder="Pesquisar projeto..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setPesquisa(inputValue)
                  }
                />
                <button
                  className="btn-pesquisar"
                  onClick={() => setPesquisa(inputValue)}
                >
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </div>
            <Grid pesquisa={pesquisa} />
          </main>
          <footer className="projetos-ger-footer">
            <p>
              &copy; {new Date().getFullYear()} Instituto Educa Cidades. Todos
              os direitos reservados.
            </p>
          </footer>
        </div>
      </div>
      <ModalFormulario
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
      />
    </>
  );
}

export default GerenciaProjetos;
