import "./produto.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Title from "../../components/Title";
import TaskList from "../../components/TaskList";
import { EditTaskModal } from "../../components/EditTaskModal";
import { ViewTaskModal } from "../../components/ViewTaskModal";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm"; 
import api from "../../services/api";
import CustomAlert from "../../components/Alert/CustomAlert";

function NovoProduto() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEditTask, setSelectedEditTask] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const showCustomAlert = (message) => {
    setAlertMessage(message);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedEditTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteTask = (index) => {
    setTaskToDelete({ ...tasks[index], index }); 
    setIsDeleteTaskModalOpen(true);
  };

  const confirmDeleteTask = () => {
    const { index } = taskToDelete;
    setTasks(tasks.filter((_, i) => i !== index));
    showCustomAlert("Tarefa removida com sucesso!");
    closeDeleteTaskModal(); 
  };

  const handleSave = async () => {
    if (!code || !title) {
      showCustomAlert(
        "Por favor, preencha os campos obrigatórios: Código e Nome do Produto."
      );
      return;
    }

    try {
      const payload = {
        code,
        title,
        description,
        defaultTasks: tasks.map((task) => ({
          title: task.title,
          description: task.description,
          priority: task.priority,
        })),
      };
      console.log("Enviando para API:", payload);
      const response = await api.post("/products", payload);
      console.log("Resposta da API:", response.data);
      showCustomAlert("Produto criado com sucesso!");
      setTimeout(() => {
        navigate(`/produtos`);
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar o produto:", error.response || error);
      showCustomAlert(`Erro ao salvar o produto: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate(`/produtos`);
  };

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === selectedEditTask.id
          ? { ...task, ...updatedTask, id: task.id }
          : task
      )
    );
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEditTask(null);
  };

  const closeDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };

  const handleSaveTask = (task) => {
    console.log("Salvando tarefa:", task);
    if (selectedEditTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
    closeEditModal();
  };

  return (
    <div className="container-novo-produto">
      <NavBar />
      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
      <main>
        <Title title="Novo Produto" number={1} />
        <article>
          <section>
            <label htmlFor="Nome_de_Produto">Nome do Produto</label>
            <input
              type="text"
              value={title}
              id="Nome_de_Produto"
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="Codigo">Codigo do Produto</label>
            <input
              type="text"
              id="Codigo"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <label htmlFor="descricao">Descrição do Produto</label>
            <textarea
              className="descricao"
              id="descricao"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="btn-container-novo-produto">
              <button className="salvar" onClick={handleSave}>
                Salvar
              </button>
              <button className="cancelar" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
            <Title title="Tarefas" number={2} />
            <button
              className="btn-criarProduto"
              onClick={() => setIsEditModalOpen(true)}
            >
              Criar
            </button>
            <TaskList
              tasks={tasks}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onRemoveTask={handleDeleteTask} 
            />
            <EditTaskModal
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              onSave={handleSaveTask}
              task={selectedEditTask}
            />
            <ViewTaskModal
              isOpen={isViewModalOpen}
              onClose={closeViewModal}
              task={selectedTask}
            />

            {/* Modal de confirmação para deletar tarefa */}
            <ModalConfirm
              isOpen={isDeleteTaskModalOpen}
              title="Excluir Tarefa"
              message={`Tem certeza que deseja excluir a tarefa "${taskToDelete?.title}"?`}
              onCancel={closeDeleteTaskModal}
              onConfirm={confirmDeleteTask}
            />
          </section>
        </article>
      </main>
      <footer className="produto-footer">
        <p>
          &copy; {new Date().getFullYear()} Instituto Educa Cidades. Todos os
          direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default NovoProduto;