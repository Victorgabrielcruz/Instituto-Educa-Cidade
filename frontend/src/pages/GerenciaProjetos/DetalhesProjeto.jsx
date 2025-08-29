import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar";
import Title from "../../components/TitleEdit";
import ModalAddProduct from "../../components/ModalAddProduct";
import api from "../../services/api";
import "./detalhesProjeto.css";
import ProdutoProjetoCard from "../../components/CardProdutosProjeto";
import CustomAlert from "../../components/Alert/CustomAlert";

function DetalhesProjeto() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");
  const [projeto, setProjeto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const handleCloseAlert = () => {
    setAlertMessage("");
  };

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const response = await api.get(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("projetoId", id);

        if (response.status === 403) {
          alert("Token inválido. Redirecionando para o login.");
          navigate("/");
          return;
        }
        setProjeto(response.data);
      } catch (error) {
        console.error("Erro ao buscar o projeto:", error);
        setAlertMessage(
          "Erro ao buscar o projeto. Verifique se o ID está correto ou se o projeto existe."
        );
      }
    };

    fetchProjeto();
  }, [id, token, navigate]);

  const fetchProdutos = async () => {
    if (!projeto) return;

    try {
      const productsResponse = await api.get(
        `/projects-products/project/${projeto.id}/products`
      );

      if (productsResponse.status === 403) {
        alert("Token inválido. Redirecionando para o login.");
        navigate("/");
        return;
      }

      setProducts(productsResponse.data);
    } catch (error) {
      console.error("Erro buscando os produtos:", error);
    }
  };

  const deleteProject = async () => {
    try {
      await api.delete(`/projects/${projeto.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/projetos");
    } catch (error) {
      console.error("Erro ao deletar o projeto:", error);
      setAlertMessage(
        "Erro ao deletar o projeto. Verifique se o projeto possui produtos ou tarefas associadas."
      );
    }
  };

  const formatarData = (dataStringDoBackend) => {
    if (!dataStringDoBackend) return "";

    const data = new Date(dataStringDoBackend);
    const offsetEmMinutos = data.getTimezoneOffset();
    const dataAjustada = new Date(data.getTime() + offsetEmMinutos * 60000);

    return dataAjustada.toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    fetchProdutos();
  }, [projeto, token, navigate]);

  if (!projeto) {
    return <h3>Não há projeto.</h3>;
  }

  return (
    <div className="container">
      <Navbar />
      <main>
        <Title title={projeto.title} number={1} id={projeto.id} />
        <div className="projeto-info">
          <h3 className="subtitulo">Cidade</h3>
          <p>{projeto.city}</p>

          <h3 className="subtitulo">Estado</h3>
          <p>{projeto.state}</p>

          <h3 className="subtitulo">Descrição</h3>
          <p>{projeto.description}</p>

          <h3 className="subtitulo">Objetivo</h3>
          <p>{projeto.objective}</p>

          <h3 className="subtitulo">Prazo</h3>
          <p>
            {formatarData(projeto.expectedStart)} a{" "}
            {formatarData(projeto.expectedEnd)}
          </p>

          <h3 className="subtitulo">Produtos</h3>
          <button className="btn-adicionar" onClick={() => setShowModal(true)}>
            Adicionar Produto
          </button>
          <button className="btn-deletar-project" onClick={deleteProject}>
            Apagar Projeto
          </button>

          <div className="product-grid">
            {products.map((x) => (
              <ProdutoProjetoCard
                key={x.id}
                id={x.id}
                title={x.product.title}
                description={x.description}
              />
            ))}
          </div>

          <ModalAddProduct
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            token={token}
            projetoId={projeto.id}
            onSuccess={fetchProdutos}
            dataInicial={projeto.expectedStart}
            dataFinal={projeto.expectedEnd}
          />
        </div>
      </main>
      <footer className="detalhes-p-footer">
        <p>
          &copy; {new Date().getFullYear()} Instituto Educa Cidades. Todos os
          direitos reservados.
        </p>
      </footer>
      {alertMessage && (
        <CustomAlert message={alertMessage} onClose={handleCloseAlert} />
      )}
    </div>
  );
}

export default DetalhesProjeto;
