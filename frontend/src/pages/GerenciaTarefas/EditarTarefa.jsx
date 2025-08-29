
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Title from "../../components/Title";
import api from "../../services/api";
import "./tarefa.css";
function EditarTarefa() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id, tarefaId } = useParams(); // `id` do produto e `tarefaId` da tarefa
  const [usuarios, setUsuarios] = useState([]); // Lista de usuários

  const [form, setForm] = useState({
    title: "",
    description: "",
    initialDate: "",
    expectedEndDate: "",
    priority: "",
    defaultTaskId: 0,
    projectProductId: parseInt(id),
    responsibleId: null
  });
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsuarios();
  }, [token]);
  useEffect(() => {
    const carregarTarefa = async () => {
      try {
        const response = await api.get(`/tasks/${tarefaId}`);
        setForm(response.data);
      } catch (error) {
        console.error("Erro ao carregar tarefa:", error);
        alert("Erro ao carregar os dados da tarefa.");
      }
    };

    carregarTarefa();
  }, [tarefaId]);
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
    fetchUsuarios();
  }, [token]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title) {
      alert("O campo Nome da Tarefa é obrigatório.");
      return;
    }

    try {
      await api.put(`/tasks/${tarefaId}`, form); // Atualiza os dados
      alert("Tarefa atualizada com sucesso!");
      navigate(`/detalhesProduto/${id}`);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert(`Erro ao atualizar tarefa: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate(`/detalhesProduto/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <main>
        <Title title="Editar Tarefa" number={2} />
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Nome da Tarefa"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="CRITICA">Crítica</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>
          <h3>Data Inicial</h3>
          <input
            type="date"
            placeholder="Data Inicial"
            name="initialDate"
            value={form.initialDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <h3>Data Esperada</h3>
          <input
            type="date"
            placeholder="Data Esperada"
            name="expectedEndDate"
            value={form.expectedEndDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="responsibleId"
            value={form.responsibleId || ""}
            onChange={handleChange}
          >
            <option value="">Selecione o responsável</option>
            {usuarios.map((user) => (
              <option key={user.id} value={user.id} onChange={handleChange}>
                {user.name || user.username || user.email}
              </option>
            ))}
          </select>

          <div className="flex space-x-4">
            <button
              className="btn-confirm "
              onClick={handleSubmit}
            >
              Confirmar
            </button>
            <button
              className="btn-cancel "
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditarTarefa;