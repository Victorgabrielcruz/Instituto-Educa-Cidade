import "./modalEdit.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { MultiSelect } from "../../components/MultiSelect";
import CustomAlert from "../Alert/CustomAlert";

function Modal({ fecharModal, id }) {
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [inicio, setInicio] = useState("");
  const [entrega, setEntrega] = useState("");
  const [usuariosSelecionados, setUsuariosSelecionados] = useState([]);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const buscarProjeto = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        const projeto = response.data;

        setTitulo(projeto.title);
        setDescricao(projeto.description);
        setObjetivo(projeto.objective);
        setInicio(projeto.expectedStart);
        setEntrega(projeto.expectedEnd);
        setEstadoSelecionado(projeto.state);
        setCidadeSelecionada(projeto.city);
        setUsuariosSelecionados(
          projeto.users.map((user) => ({ value: user.id, label: user.name }))
        );
      } catch (error) {
        console.error("Erro ao buscar o projeto:", error);
      }
    };

    if (id) {
      buscarProjeto();
    }
  }, [id]);

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

  const enviarDados = async () => {
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
      const response = await api.put(`/projects/${id}`, dados);
      console.log(response.data);
      setAlertMessage("Dados atualizados com sucesso!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error(error);
      setError("Erro ao enviar os dados. Tente novamente.");
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage("");
  };

  return (
    <>
      <div className="modal-sobreposicao">
        <div className="modal-conteudo">
          <h3>Edição do Projeto</h3>
          {error && <p className="erro">{error}</p>}

          <label>
            Título
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </label>

          <label>
            Descrição
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
          </label>

          <label>
            Objetivo
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
            ></textarea>
          </label>

          <label>
            Prazo
            <div>
              <input
                type="date"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
              />
              <input
                type="date"
                value={entrega}
                onChange={(e) => setEntrega(e.target.value)}
              />
            </div>
          </label>

          <div className="grupo-selects">
            <label>
              Estado
              <select
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
            </label>

            <label>
              Cidade
              <select
                value={cidadeSelecionada}
                onChange={(e) => setCidadeSelecionada(e.target.value)}
              >
                <option value="">Selecione uma cidade</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.nome}>
                    {municipio.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>Participantes</label>
          <MultiSelect
            value={usuariosSelecionados}
            onChange={setUsuariosSelecionados}
          />

          <div className="botoes">
            <button className="botao-fechar" onClick={fecharModal}>
              Fechar
            </button>
            <button className="botao-enviar" onClick={enviarDados}>
              Enviar
            </button>
          </div>
        </div>
      </div>

      {alertMessage && (
        <CustomAlert message={alertMessage} onClose={handleCloseAlert} />
      )}
    </>
  );
}

export default Modal;
