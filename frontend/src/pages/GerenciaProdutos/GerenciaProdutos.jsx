import "./produto.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "../../components/NavBar";
import Title from "../../components/Title";
import Grid from "../../components/ProdutosGrid";
import { useState } from "react";

function GerenciaProdutos() {
  const [pesquisa, setPesquisa] = useState("");
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleCreate = () => {
    navigate(`/novoProduto`);
  };

  return (
    <>
      <div className="container-gerencia-produtos">
        <NavBar />
        <div className="main-content-wrapper-produtos">
        <main className="content-beta-produtos">
          <Title title="Produtos" number={1} />
          <div className="pesquisar">
            <button onClick={handleCreate}>Criar</button>
            <div className="barra-pesquisa">
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setPesquisa(inputValue)}
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
        <footer className="gerencia-footer">
          <p>
            &copy; {new Date().getFullYear()} Instituto Educa Cidades. Todos os
            direitos reservados.
          </p>
        </footer>
      </div>
      </div>
    </>
  );
}

export default GerenciaProdutos;
