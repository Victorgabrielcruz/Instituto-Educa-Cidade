import "./tarefa.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Title from "../../components/Title";
import api from "../../services/api";

function NovaTarefa() {
  const navigate = useNavigate();
  const { id } = useParams();// <- Captura o ID da URL

  const [form, setForm] = useState({
    title: "",
    description: "",
    //responsavel: "",
    //url: "",
    initialDate: "",
    expectedEndDate: "",
    priority: "",
    defaultTaskId: 0,
    projectProductId: parseInt(id) // <- Usa o ID da URL
     // Opcional
  });

  // const [responsaveis, setResponsaveis] = useState([]);

  // useEffect(() => {
  //   const fetchResponsaveis = async () => {
  //     try {
  //       const response = await api.get("/task"); // Ajustar se necessário
  //       setResponsaveis(response.data);
  //     } catch (error) {
  //       console.error("Erro ao buscar responsáveis:", error);
  //       alert(`Erro ao carregar responsáveis: ${error.message}`);
  //     }
  //   };
  //   fetchResponsaveis();
  // }, []);

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
      await api.post("/tasks", form);
      alert("Tarefa criada com sucesso!");
      navigate(`/detalhesProduto/${id}`); // redireciona de volta usando o id
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert(`Erro ao salvar tarefa: ${error.message}`);
    }
  };
  

  const handleCancel = () => {
    navigate(`/detalhesProduto/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <NavBar />
      <style>
        {`
          

        `}
      </style>
      <main>
        <Title title="Nova Tarefa" number={2} />
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
          {/* <select
            name="responsavel"
            value={form.responsavel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione o responsável</option>
            {responsaveis.map((responsavel) => (
              <option key={responsavel.id} value={responsavel.nome}>
                {responsavel.nome}
              </option>
            ))}
          </select> */}
          {/* <input
            type="text"
            name="url"
            placeholder="URL"
            value={form.url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          /> */}
          <input
            type="date"
            name="initialDate"
            value={form.initialDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="expectedEndDate"
            value={form.expectedEndDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="CRITICA">Critica</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Confirmar
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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

export default NovaTarefa;