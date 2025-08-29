import React, { useEffect, useState } from "react";
import "./ModalAddProduct.css";
import api from "../../services/api";

const ModalAddProduct = ({ isOpen, onClose, token, projetoId, onSuccess, dataInicial, dataFinal }) => {
  const [produtos, setProdutos] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [busca, setBusca] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erros, setErros] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setErros({});
      setError("");
      return;
    }

    const fetchProdutos = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setError("Erro ao carregar produtos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, [isOpen, token]);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.title.toLowerCase().includes(busca.toLowerCase())
  );

  const validarCampos = () => {
    const novosErros = {};
    if (!produtoSelecionado) novosErros.produto = "Produto é obrigatório";
    if (!dataInicio) novosErros.dataInicio = "Data de início é obrigatória";
    if (!dataFim) novosErros.dataFim = "Data de término é obrigatória";
    if (!priority) novosErros.priority = "Prioridade é obrigatória";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleAdicionar = async () => {
    setError("");
    if (!validarCampos()) return;

    if (!produtoSelecionado || !dataInicio || !dataFim) {
      alert("Por favor, selecione um produto e preencha as datas.");
      return;
    }

    if (
      new Date(dataFim) < new Date(dataInicio) ||
      dataFim < dataInicial ||
      dataFim > dataFinal ||
      dataInicio < dataInicial ||
      dataInicio > dataFinal
    ) {
      alert("A data do produto deve estar dentro do prazo do projeto.");
      return;
    }

    if (!projetoId || isNaN(parseInt(projetoId))) {
      alert("ID do projeto inválido.");
      return;
    }

    const payload = {
      idProject: parseInt(projetoId),
      idProduct: parseInt(produtoSelecionado),
      expectedStart: dataInicio,
      expectedEnd: dataFim,
      priority: priority,
    };

    try {
      setIsLoading(true);
      await api.post("/projects-products", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setError(""); 
      setErros({});
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      const msg = error.response?.data?.message || "Erro inesperado.";
      setError(`Erro ao adicionar produto: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-sobre">
      <div className="modal-add">
        <h2 className="modal-titulo">Adicionar produto</h2>

        <div className="selecao-group">
          <label htmlFor="produto">Produto*</label>
          <select
            id="produto"
            value={produtoSelecionado}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
            className={erros.produto ? "erro-input" : ""}
            aria-label="Selecionar produto"
            disabled={isLoading}
          >
            <option value="">Selecione um produto</option>
            {produtosFiltrados.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.title}
              </option>
            ))}
          </select>
          {erros.produto && <p className="erro-campo">{erros.produto}</p>}
        </div>

        <div className="selecao-group">
          <label htmlFor="priority">Prioridade*</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={erros.priority ? "erro-input" : ""}
            disabled={isLoading}
          >
            <option value="">Selecione uma prioridade</option>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
          {erros.priority && <p className="erro-campo">{erros.priority}</p>}
        </div>

        <div className="modal-dates">
          <div className="selecao-group">
            <label htmlFor="dataInicio">Previsão de Início*</label>
            <input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className={erros.dataInicio ? "erro-input" : ""}
              aria-label="Data de início"
              disabled={isLoading}
            />
            {erros.dataInicio && (
              <p className="erro-campo">{erros.dataInicio}</p>
            )}
          </div>

          <div className="selecao-group">
            <label htmlFor="dataFim">Previsão de Término*</label>
            <input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className={erros.dataFim ? "erro-input" : ""}
              aria-label="Data de término"
              disabled={isLoading}
            />
            {erros.dataFim && <p className="erro-campo">{erros.dataFim}</p>}
          </div>
        </div>

        {error && <p className="erro-geral">{error}</p>}

        <div className="modal-buttons">
          <button
            className="button-close"
            onClick={onClose}
            disabled={isLoading}
          >
            Voltar
          </button>
          <button
            className="button-open"
            onClick={handleAdicionar}
            disabled={isLoading}
          >
            {isLoading ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddProduct;
