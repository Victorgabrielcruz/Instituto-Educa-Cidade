import "../GerenciaProdutos/detalhesProduto.css";
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Title from "../../components/Title";
import api from "../../services/api";
import Modal from "../../components/ModalDetalhesTarefa/Modal";
import { EditarTarefaModal } from "../../components/EditTaslModalProjectProduct";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Gantt from "frappe-gantt";
import "./grantt.css";

function aplicarFiltro(tarefas, filtro) {
  if (!filtro) return tarefas;

  return tarefas.filter((tarefa) => tarefa.status === filtro);
}

function DetalhesProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const [state, setState] = useState({
    produto: null,
    tarefas: [],
    tarefasFiltradas: [],
    usuarios: [],
    modalDetalhesOpen: false,
    modalNovaTarefaOpen: false,
    modalEditarTarefaOpen: false,
    selectedTarefa: null,
    form: {
      projectProductId: parseInt(id),
      defaultTaskId: 0,
      responsibleId: 1,
    },
    alert: { isOpen: false, message: "", type: "message", onConfirm: null },
    filtro: "",
  });

  const setStateField = (field, value) =>
    setState((prev) => ({ ...prev, [field]: value }));
  const showAlert = (message, type = "message", onConfirm = null) =>
    setStateField("alert", { isOpen: true, message, type, onConfirm });
  const closeAlert = () =>
    setStateField("alert", {
      isOpen: false,
      message: "",
      type: "message",
      onConfirm: null,
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productRes] = await Promise.all([
          api.get(`/projects/${localStorage.getItem("projetoId")}/users`),
          api.get(`/projects-products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (productRes.status === 403) {
          showAlert("Token inválido. Redirecionando para login.");
          setTimeout(() => navigate("/"), 2000);
          return;
        }
        setState((prev) => ({
          ...prev,
          usuarios: usersRes.data,
          produto: productRes.data,
        }));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, [id, token, navigate]);

  useEffect(() => {
    if (!state.produto) return;
    api
      .get(`/tasks/project-product/${state.produto.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 403) {
          showAlert("Token inválido. Redirecionando para login.");
          setTimeout(() => navigate("/"), 2000);
          return;
        }
        setState((prev) => ({
          ...prev,
          tarefas: res.data,
          tarefasFiltradas: res.data,
        }));
      })
      .catch((err) => console.error("Erro ao buscar tarefas:", err));
  }, [state.produto, token, navigate]);

  useEffect(() => {
    const ganttContainer = document.querySelector("#gantt-chart");
    if (ganttContainer) ganttContainer.innerHTML = "";

    if (state.tarefas.length === 0) return;

    const ganttTasks = state.tarefas.map((tarefa) => ({
      id: tarefa.id.toString(),
      name: tarefa.title,
      start: tarefa.initialDate,
      end: tarefa.expectedEndDate,
      progress:
        tarefa.status.toLowerCase() === "concluído" ||
        tarefa.status.toLowerCase() === "concluido"
          ? 0
          : tarefa.status.toLowerCase() === "em andamento"
          ? 0
          : 0,
      dependencies: "",
      custom_class: getStatusClass(tarefa.status),
    }));

    new Gantt("#gantt-chart", ganttTasks, {
      view_mode: "Week",
      date_format: "YYYY-MM-DD",
      language: "pt",
      on_click: (task) => {
        handleTarefaAction("detalhes", parseInt(task.id));
      },
    });
  }, [state.tarefas]);

  const handleTarefaAction = async (action, taskId) => {
    if (action === "detalhes") {
      try {
        const res = await api.get(`/tasks/${taskId}`);
        setState((prev) => ({
          ...prev,
          selectedTarefa: res.data,
          modalDetalhesOpen: true,
        }));
      } catch (error) {
        showAlert("Erro ao carregar os dados da tarefa.");
      }
    } else if (action === "editar") {
      setState((prev) => ({
        ...prev,
        selectedTarefa: taskId,
        modalEditarTarefaOpen: true,
      }));
    } else if (action === "excluir") {
      showAlert(
        "Tem certeza que deseja excluir esta tarefa?",
        "confirm",
        async () => {
          try {
            await api.delete(`/tasks/${taskId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setStateField(
              "tarefas",
              state.tarefas.filter((t) => t.id !== taskId)
            );
            setStateField(
              "tarefasFiltradas",
              state.tarefasFiltradas.filter((t) => t.id !== taskId)
            );
            showAlert("Tarefa excluída com sucesso!");
            setTimeout(() => window.location.reload(), 500);
          } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
            setTimeout(() => window.location.reload(), 500);
          }
        }
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

  const handleSubmitNovaTarefa = async () => {
    if (!state.form.title) {
      showAlert("O campo Nome da Tarefa é obrigatório.");
      return;
    }

    if (
      !state.form.initialDate ||
      !state.form.expectedEndDate ||
      state.form.initialDate < state.produto.expectedStart ||
      state.form.expectedEndDate > state.produto.expectedEnd ||
      state.form.initialDate > state.form.expectedEndDate
    ) {
      showAlert(
        "As datas da tarefa devem estar dentro do prazo do produto e a data inicial deve ser anterior à data final."
      );
      return;
    }

    try {
      await api.post("/tasks", state.form);
      const res = await api.get(`/tasks/project-product/${state.produto.id}`);
      setState((prev) => ({
        ...prev,
        tarefas: res.data,
        tarefasFiltradas: res.data,
        modalNovaTarefaOpen: false,
        form: {
          projectProductId: parseInt(id),
          defaultTaskId: 0,
          responsibleId: 1,
        },
      }));
      showAlert("Tarefa criada com sucesso!");
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      showAlert(`Erro ao salvar tarefa: ${error.message}`);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONCLUIDO":
        return "status-green";
      case "EM_ANDAMENTO":
        return "status-yellow";
      case "PAUSADO":
        return "status-red";
      case "NAO_INICIADO":
        return "status-gray";
      default:
        return "";
    }
  };

  const handleFilterChange = (e) => {
    const filtro = e.target.value;
    setState((prev) => ({ ...prev, filtro }));
    const tarefasFiltradas = aplicarFiltro(state.tarefas, filtro);
    setState((prev) => ({ ...prev, tarefasFiltradas }));
  };

  if (!state.produto) return <p>Carregando...</p>;

  async function report() {
  try {
    const res = await api.get(`/reports/${id}`, { responseType: 'blob' });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  } catch (err) {
    console.error("Erro ao carregar o PDF:", err);
  }
}

  return (
    <div className="container-detalhes-produto">
      <NavBar />
      <main className="main-detalhes-produto">
        <div className="header-linha">
          <Title title={state.produto.product.title} number={1} />
        </div>
        <h2>Descrição do Produto</h2>
        <p>{state.produto.product.description}</p>
        <h3 className="text-detalhes-produto">Prazo do Produto</h3>
        <p>
          {formatarData(state.produto.expectedStart)} até{" "}
          {formatarData(state.produto.expectedEnd)}
        </p>

        <div className="gantt-chart" id="gantt-chart">
          {state.tarefas.length === 0 && (
            <p>Nenhuma tarefa disponível para exibir no gráfico de Gantt.</p>
          )}
        </div>

        <div className="header-linha">
          <h2>Tarefas</h2>
          <select
            className="filter-select"
            onChange={handleFilterChange}
            value={state.filtro}
          >
            <option value="">Todos</option>
            <option value="NAO_INICIADO">Não Iniciado</option>
            <option value="PAUSADO">Pausado</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>
          <div className="botoes">
            <button
              className="criar-btn"
              onClick={() => setStateField("modalNovaTarefaOpen", true)}
            >
              Criar
            </button>
            <button className="baixar-relatorio-btn" onClick={report}>
              Relatório
            </button>
          </div>
        </div>
        <table className="tabela-tarefas">
          <thead>
            <tr>
              <th>Nome da Tarefa</th>
              <th>Responsável</th>
              <th>Prazo</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Planejada</th>
            </tr>
          </thead>
          <tbody>
            {state.tarefasFiltradas.map((tarefa) => (
              <tr key={tarefa.id}>
                <td>{tarefa.title}</td>
                <td>{tarefa.responsible?.name}</td>
                <td>
                  {formatarData(tarefa.initialDate)} <strong>até</strong>{" "}
                  {formatarData(tarefa.expectedEndDate)}
                </td>
                <td>
                  <span
                    className={`status-dot ${getStatusClass(tarefa.status)}`}
                  />
                  {tarefa.status}
                </td>
                <td>{tarefa.priority}</td>
                <td>{tarefa.defaultTaskId == null ? "Não" : "Sim"}</td>
                <td>
                  <div className="botoes">
                    <button
                      className="icon-button detalhes"
                      onClick={() => handleTarefaAction("detalhes", tarefa.id)}
                    >
                      <Eye />
                    </button>
                    <button
                      className="icon-button edit"
                      title="Editar"
                      onClick={() => handleTarefaAction("editar", tarefa.id)}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="icon-button delete"
                      title="Excluir"
                      onClick={() => handleTarefaAction("excluir", tarefa.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {state.tarefasFiltradas.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Nenhuma tarefa encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      <Modal
        isOpen={state.modalDetalhesOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            modalDetalhesOpen: false,
            selectedTarefa: null,
          }))
        }
      >
        {state.selectedTarefa ? (
          <div className="space-y-4 bg-gray-100 p-4 rounded shadow">
            <h3 className="text-lg font-bold">Detalhes da Tarefa</h3>
            <p>
              <strong>Nome:</strong> {state.selectedTarefa.title}
            </p>
            <p>
              <strong>Descrição:</strong>{" "}
              {state.selectedTarefa.description || "Sem descrição"}
            </p>
            <p>
              <strong>Prioridade:</strong> {state.selectedTarefa.priority}
            </p>
            <p>
              <strong>Status:</strong> {state.selectedTarefa.status}
            </p>
            <p>
              <strong>Prazo:</strong>{" "}
              {formatarData(state.selectedTarefa.initialDate)}{" "}
              <strong>até</strong>{" "}
              {formatarData(state.selectedTarefa.expectedEndDate)}
            </p>
            <p>
              <strong>Responsável:</strong>{" "}
              {state.selectedTarefa.responsible?.name || "Sem responsável"}
            </p>
            <p>
              <strong>Link:</strong> {state.selectedTarefa.link || "Sem link"}
            </p>
            <div className="botoes_modal">
              <button
                className="icon-button edit"
                title="Editar"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    modalDetalhesOpen: false,
                    modalEditarTarefaOpen: true,
                  }))
                }
              >
                <span className="material-icons">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pencil-icon lucide-pencil"
                  >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </span>
              </button>
              <button
                className="icon-button delete"
                title="Excluir"
                onClick={() => {
                  handleTarefaAction("excluir", state.selectedTarefa.id);
                  setStateField("modalDetalhesOpen", false);
                }}
              >
                <span className="material-icons">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-trash2-icon lucide-trash-2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </Modal>

      <Modal
        isOpen={state.modalNovaTarefaOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            modalNovaTarefaOpen: false,
            form: {
              projectProductId: parseInt(id),
              defaultTaskId: 0,
              responsibleId: 1,
            },
          }))
        }
      >
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Nova Tarefa</h3>
          <div className="form-field">
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Nome da Tarefa"
              value={state.form.title || ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  form: { ...prev.form, title: e.target.value },
                }))
              }
            />
          </div>
          <div className="form-field">
            <textarea
              id="description"
              name="description"
              placeholder="Descrição"
              value={state.form.description || ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  form: { ...prev.form, description: e.target.value },
                }))
              }
            />
          </div>
          <div className="form-field">
            <input
              type="text"
              placeholder="Link"
              id="link"
              value={state.form.link || ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  form: { ...prev.form, link: e.target.value },
                }))
              }
            />
          </div>
          <div className="form-field date">
            <input
              id="initialDate"
              type="date"
              name="initialDate"
              value={state.form.initialDate || ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  form: { ...prev.form, initialDate: e.target.value },
                }))
              }
            />
          </div>
          <div className="form-field date">
            <input
              id="endDate"
              type="date"
              name="expectedEndDate"
              value={state.form.expectedEndDate || ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  form: { ...prev.form, expectedEndDate: e.target.value },
                }))
              }
            />
          </div>
          <div className="form-field">
            <select
              className="select-priority"
              id="priority"
              name="priority"
              value={state.form.priority || ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  form: { ...prev.form, priority: e.target.value },
                }))
              }
            >
              <option value="">Selecione a prioridade</option>
              <option value="CRITICA">Crítica</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Média</option>
              <option value="BAIXA">Baixa</option>
            </select>
          </div>
          <div className="form-field">
            <select
              className="select-responsible"
              id="responsible"
              name="responsibleId"
              value={state.form.responsibleId || ""}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  form: { ...prev.form, responsibleId: e.target.value },
                }))
              }
            >
              <option value="">Selecione o responsável</option>
              {state.usuarios.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.username || user.email}
                </option>
              ))}
            </select>
          </div>
          <div
            className="btn-divisao"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <button
              className="btn-cancelar"
              style={{ backgroundColor: "#f44336", color: "white" }}
              onClick={() => setStateField("modalNovaTarefaOpen", false)}
            >
              Cancelar
            </button>
            <button
              className="btn-confirmar"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
              onClick={handleSubmitNovaTarefa}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>

      <EditarTarefaModal
        isOpen={state.modalEditarTarefaOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            modalEditarTarefaOpen: false,
            selectedTarefa: null,
          }))
        }
        onSave={async () => {
          const res = await api.get(
            `/tasks/project-product/${state.produto.id}`
          );
          setStateField("tarefas", res.data);
          setState((prev) => ({
            ...prev,
            modalEditarTarefaOpen: false,
            selectedTarefa: null,
          }));
        }}
        productId={id}
        tarefaId={state.selectedTarefa?.id || state.selectedTarefa}
        dataInicial={state.produto.expectedStart}
        dataFinal={state.produto.expectedEnd}
      />

      {state.alert.isOpen && (
        <div className="alert-overlay">
          <div className="alert-content">
            <p>{state.alert.message}</p>
            <div className="alert-buttons">
              {state.alert.type === "message" ? (
                <button className="alert-button confirm" onClick={closeAlert}>
                  OK
                </button>
              ) : (
                <>
                  <button
                    className="alert-button confirm"
                    onClick={() => {
                      state.alert.onConfirm?.();
                      closeAlert();
                    }}
                  >
                    Confirmar
                  </button>
                  <button className="alert-button cancel" onClick={closeAlert}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <footer className="detalhes-footer">
        <p>
          &copy; {new Date().getFullYear()} Instituto Educa Cidades. Todos os
          direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default DetalhesProduto;
