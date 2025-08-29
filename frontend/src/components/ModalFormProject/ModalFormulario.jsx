import "./modal.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { MultiSelect } from "../../components/MultiSelect"; 

const ModalFormulario = ({ isOpen, onClose }) => {
  const [estados, setEstados] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [inicio, setInicio] = useState("");
  const [entrega, setEntrega] = useState("");
  const [erros, setErros] = useState({});
  const [error, setError] = useState("");
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((data) => {
        const ordenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
        setEstados(ordenados);
      });
  }, []);

  useEffect(() => {
    if (estadoSelecionado) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`
      )
        .then((res) => res.json())
        .then((data) => {
          const ordenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
          setMunicipios(ordenados);
        });
    } else {
      setMunicipios([]);
      setCidadeSelecionada("");
    }
  }, [estadoSelecionado]);

  if (!isOpen) return null;

  const validarCampos = () => {
    const novosErros = {};
    if (!titulo.trim()) novosErros.titulo = "Título é obrigatório";
    if (!objetivo.trim()) novosErros.objetivo = "Objetivo é obrigatório";
    if (!inicio) novosErros.inicio = "Data de início é obrigatória";
    if (!entrega) novosErros.entrega = "Data de entrega é obrigatória";
    if (!estadoSelecionado) novosErros.estado = "Estado é obrigatório";
    if (!cidadeSelecionada) novosErros.cidade = "Cidade é obrigatória";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const enviarDados = async () => {

    if (entrega < inicio) {
      setError("A data de entrega não pode ser anterior à data de início.");
      return;
    }

    if (inicio < new Date().toISOString().split("T")[0]) {
      setError("A data de início não pode ser anterior à data atual.");
      return;
    }

    if (!validarCampos()) return;
    const dados = {
      title: titulo,
      description: descricao,
      objective: objetivo,
      city: cidadeSelecionada,
      state: estadoSelecionado,
      country: "Brasil",
      users: usuariosSelecionados.map((user) => user.value),
      expectedStart: inicio,
      expectedEnd: entrega,
    };

    try {
      const response = await api.post("/projects", dados);
      console.log(response.data);
      alert("Dados enviados com sucesso!");
      window.location.href = "/projetos";
    } catch (error) {
      console.error(error);
      setError("Erro ao enviar os dados. Tente novamente.");
    }
  };

  return (
    <div className="modal-formulario">
        <form className="form-container" id="form">
            <label htmlFor="etiqueta">Título*</label>
            <input
              id="etiqueta"
              type="text"
              className={`input ${erros.titulo ? "erro-input" : ""}`}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            className="textarea full"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <label htmlFor="objetivo">Objetivo*</label>
          <div className="row">
            <textarea
              id="objetivo"
              className={`textarea half ${erros.objetivo ? "erro-input" : ""}`}
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
            />
            <div className="dates-column">
              <label htmlFor="inicio">Prev. Início*</label>
              <input
                id="inicio"
                type="date"
                className={`input ${erros.inicio ? "erro-input" : ""}`}
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
              />

              <label htmlFor="entrega">Prev. Entrega*</label>
              <input
                id="entrega"
                type="date"
                className={`input ${erros.entrega ? "erro-input" : ""}`}
                value={entrega}
                onChange={(e) => setEntrega(e.target.value)}
              />
            </div>
          </div>

          <div className="colunas">
            <div className="selecao-group">
              <label htmlFor="estado">Estado*</label>
              <select
                id="estado"
                className={erros.estado ? "erro-input" : ""}
                value={estadoSelecionado}
                onChange={(e) => setEstadoSelecionado(e.target.value)}
              >
                <option value="">Selecione um estado</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="selecao-group">
              <label htmlFor="cidade">Cidade*</label>
              <select
                id="cidade"
                className={erros.cidade ? "erro-input" : ""}
                value={cidadeSelecionada}
                onChange={(e) => setCidadeSelecionada(e.target.value)}
                disabled={!estadoSelecionado}
              >
                <option value="">Selecione uma cidade</option>
                {municipios.map((cidade) => (
                  <option key={cidade.id} value={cidade.nome}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label>Participantes*</label>
          <MultiSelect
            value={usuariosSelecionados}
            onChange={setUsuariosSelecionados}
          />

          {error && <p className="erro-geral">{error}</p>}

          <div className="row">
            <button
              type="button"
              className="btn cancelar"
              onClick={() => (onClose())}
            >
              Cancelar
            </button>
            <button type="button" className="btn" onClick={enviarDados}>
              Continuar
            </button>
          </div>
        </form>
      </div>
  );
};

export default ModalFormulario;
