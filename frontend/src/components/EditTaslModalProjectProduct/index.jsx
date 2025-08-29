import { useState, useEffect } from "react";
import api from "../../services/api";
import "./style.css";
import CustomAlert from "../../components/Alert/CustomAlert";

export function EditarTarefaModal({
  isOpen,
  onClose,
  onSave,
  productId,
  tarefaId,
  dataInicial,
  dataFinal,
}) {
  const token = localStorage.getItem("token");
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    initialDate: "",
    expectedEndDate: "",
    priority: "BAIXA",
    status: "NAO_INICIADO",
    link: "",
  });

  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const formatarData = (dataStringDoBackend) => {
    if (!dataStringDoBackend) return "";

    const data = new Date(dataStringDoBackend);
    const offsetEmMinutos = data.getTimezoneOffset();
    const dataAjustada = new Date(data.getTime() + offsetEmMinutos * 60000);

    return dataAjustada.toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get(
          `/projects/${localStorage.getItem("projetoId")}/users`
        );
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        triggerAlert("Erro ao carregar usuários.");
      }
    };
    fetchUsuarios();
  }, [token]);

  // Load task data
  useEffect(() => {
    if (!isOpen || !tarefaId) return;

    const carregarTarefa = async () => {
      try {
        const response = await api.get(`/tasks/${tarefaId}`);
        setForm((prevForm) => ({
          ...prevForm,
          id: response.data.id,
          title: response.data.title || "",
          description: response.data.description || "",
          initialDate: response.data.initialDate || "",
          expectedEndDate: response.data.expectedEndDate || "",
          priority: response.data.priority || "BAIXA",
          status: response.data.status || "NAO_INICIADO",
          responsibleId: response.data.responsible?.id || "",
          defaultTaskId: response.data.defaultTaskId || "",
          setAsDefault: response.data.setAsDefault || 0,
          link: response.data.link || "",
        }));
      } catch (error) {
        console.error("Erro ao carregar tarefa:", error);
        triggerAlert("Erro ao carregar os dados da tarefa.");
      }
    };

    carregarTarefa();
  }, [isOpen, tarefaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!form.responsibleId) {
      triggerAlert("O campo Responsável é obrigatório.");
      return;
    }

    if (
      !form.initialDate ||
      !form.expectedEndDate ||
      !dataInicial ||
      !dataFinal ||
      form.initialDate < dataInicial ||
      form.expectedEndDate > dataFinal ||
      form.initialDate > form.expectedEndDate
    ) {
      triggerAlert(
        "As datas da tarefa devem estar dentro do prazo do produto (" +
          (formatarData(dataInicial) || "data inicial indefinida") +
          " a " +
          (formatarData(dataFinal) || "data final indefinida") +
          ") e a 'Data Inicial' deve ser anterior ou igual à 'Data Esperada'."
      );
      return;
    }

    try {
      await api.put(`/tasks/${tarefaId}`, {
        title: form.title,
        description: form.description,
        responsibleId: form.responsibleId,
        priority: form.priority,
        status: form.status,
        initialDate: form.initialDate,
        expectedEndDate: form.expectedEndDate,
        setAsDefault: form.setAsDefault,
        link: form.link,
      });

      console.log(form);

      onSave(form);
      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      triggerAlert(`Erro ao atualizar tarefa: ${error.message}`);
    }
  };

  const toDefault = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/set-as-default/${form.id}`);
      setError(null);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error("Erro ao definir tarefa como padrão:", error);
      triggerAlert("Erro ao definir tarefa como padrão.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-tasks">
      <form onSubmit={handleSubmit} className="modal-container-tasks">
        <h3 className="modal-title">Editar Tarefa</h3>
        {error && <p className="text-red-500">{error}</p>}
        <label htmlFor="title">Nome da Tarefa*</label>
        <input
          type="text"
          name="title"
          placeholder="Nome da Tarefa"
          value={form.title}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Descrição</label>
        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          className="modal-description"
        />
        <label htmlFor="link">Link</label>
        <input
          type="text"
          name="link"
          value={form.link}
          onChange={handleChange}
          className="modal-link"
        />
        <label htmlFor="priority">Prioridade</label>
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="CRITICA">Crítica</option>
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Média</option>
          <option value="BAIXA">Baixa</option>
        </select>
        <label htmlFor="status">Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="NAO_INICIADO">Não iniciada</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="CONCLUIDO">Concluída</option>
          <option value="PAUSADO">Pausada</option>
        </select>
        <div className="data-division-tasks">
          <div className="data-modal-v1">
            <label htmlFor="initialDate">Data Inicial</label>
            <input
              type="date"
              name="initialDate"
              value={form.initialDate}
              onChange={handleChange}
              className="data-modal-v1"
            />
          </div>
          <div className="data-modal-v2">
            <label htmlFor="expectedEndDate">Data Esperada</label>
            <input
              type="date"
              name="expectedEndDate"
              value={form.expectedEndDate}
              onChange={handleChange}
              className="data-modal-v1"
            />
          </div>
        </div>
        <label htmlFor="responsibleId">Responsável</label>
        <select
          name="responsibleId"
          value={form.responsibleId}
          onChange={handleChange}
        >
          <option value="">Selecione o responsável</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="btn-container">
          <button type="button" onClick={onClose} className="cancelar-tasks">
            Cancelar
          </button>
          <button
            className="salvar-padrao"
            onClick={toDefault}
            disabled={form.defaultTaskId != 0 || form.setAsDefault == 1}
          >
            {form.defaultTaskId != 0
              ? "Tarefa padrão"
              : form.setAsDefault == 1
              ? "Tornou padrão"
              : "Definir tarefa como padrão"}
          </button>
          <button type="submit" className="salvar-enviar">
            Salvar
          </button>
        </div>
      </form>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
