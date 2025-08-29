import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Title from "../../components/Title";
import api from "../../services/api";

function DetalhesTarefa() {
    const { id, tarefaId } = useParams(); // `id` do produto e `tarefaId` da tarefa
    const navigate = useNavigate();
    const [tarefa, setTarefa] = useState(null);

    console.log(id);
    console.log(tarefaId);
  useEffect(() => {
    const fetchTarefa = async () => {
      try {
        const response = await api.get(`/tasks/${tarefaId}`);
        setTarefa(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefa:", error);
        alert("Erro ao carregar os dados da tarefa.");
      }
    };

    fetchTarefa();
  }, [tarefaId]);

  const handleVoltar = () => {
    navigate(`/detalhesProduto/${id}`); 
  };

  const handleEditar = () => {
    navigate(`/editarTarefa/${id}/${tarefaId}`);
  };

  if (!tarefa) return <p className="p-4">Carregando...</p>;

  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <main>
        <Title title="Detalhes da Tarefa" number={3} />
        <div className="space-y-4 bg-gray-100 p-4 rounded shadow">
          <p><strong>Nome:</strong> {tarefa.title}</p>
          <p><strong>Descrição:</strong> {tarefa.description || "Sem descrição"}</p>
          <p><strong>Prioridade:</strong> {tarefa.priority}</p>
          <p><strong>ID do Produto Relacionado:</strong> {tarefa.projectProductId}</p>
          <p><strong>Prazo</strong>: {tarefa.initialDate}  <strong>até</strong>  {tarefa.expectedEndDate}  </p>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleEditar}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Editar
          </button>
          <button
            onClick={handleVoltar}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Voltar
          </button>
        </div>
      </main>
    </div>
  );
}

export default DetalhesTarefa;
