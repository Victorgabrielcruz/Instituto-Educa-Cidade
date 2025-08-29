// imports
import "./produto.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Title from "../../components/Title";
import TaskList from "../../components/TaskList";
import { EditTaskModal } from "../../components/EditTaskModal";
import { ViewTaskModal } from "../../components/ViewTaskModal";
import ModalConfirm from "../../components/ModalConfirm/ModalConfirm"; 
import api from "../../services/api";

function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    code: "",
    title: "",
    description: "",
  });
  const [tasks, setTasks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEditTask, setSelectedEditTask] = useState(null);

  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const showCustomAlert = (message) => {
    const overlay = document.createElement("div");
    overlay.className = "custom-alert-overlay";

    const modal = document.createElement("div");
    modal.className = "custom-alert-modal";

    const closeBtn = document.createElement("span");
    closeBtn.className = "custom-alert-close";
    closeBtn.innerHTML = "×";
    closeBtn.onclick = () => {
      document.body.removeChild(overlay);
    };

    const textNode = document.createElement("div");
    textNode.textContent = message;

    modal.appendChild(closeBtn);
    modal.appendChild(textNode);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 5000);
  };

  // useEffect para carregar dados do produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        if (response.status === 403) {
          showCustomAlert("Token inválido. Redirecionando para o login.");
          setTimeout(() => navigate("/"), 1000);
          return;
        }

        const data = response.data;
        setProduct({
          code: data.code || "",
          title: data.title || "",
          description: data.description || "",
        });
        setTasks(data.defaultTasks || []);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        showCustomAlert("Erro ao carregar produto.");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // CRUD do Produto
  const handleSave = async () => {
    try {
      const payload = {
        code: product.code,
        title: product.title,
        description: product.description,
      };
      const response = await api.put(`/products/${id}`, payload);
      if (response.status === 403) {
        showCustomAlert("Token inválido. Redirecionando para o login.");
        setTimeout(() => navigate("/"), 1000);
        return;
      }

      showCustomAlert("Produto atualizado com sucesso!");
      setTimeout(() => navigate("/produtos"), 800);
    } catch (error) {
      console.error("Erro ao salvar o produto:", error.response || error);
      showCustomAlert(`Erro ao salvar o produto: ${error.message}`);
    }
  };

  const openDeleteProductModal = () => setIsDeleteProductModalOpen(true);
  const closeDeleteProductModal = () => setIsDeleteProductModalOpen(false);

  const handleConfirmDeleteProduct = async () => {
    try {
      await api.delete(`/products/${id}`);
      showCustomAlert("Produto deletado com sucesso!");
      setTimeout(() => navigate("/produtos"), 800);
    } catch (error) {
      console.error("Erro ao deletar produto:", error.response || error);
      showCustomAlert(`Erro ao deletar produto: ${error.message}`);
    } finally {
      closeDeleteProductModal();
    }
  };

  // CRUD das Tarefas
  const handleAssociateTask = async (newTask) => {
    try {
      const payload = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
      };
      const response = await api.post(`/default-tasks/${id}/associate`, payload);
      const createdTask = response.data || { ...payload, id: Date.now() };
      setTasks((prev) => [...prev, createdTask]);
      showCustomAlert("Tarefa associada com sucesso!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Erro ao associar tarefa:", error.response || error);
      showCustomAlert(`Erro ao associar tarefa: ${error.message}`);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const payload = {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
      };
      await api.put(`/default-tasks/${selectedEditTask.id}`, payload);
      setTasks(
        tasks.map((task) =>
          task.id === selectedEditTask.id ? { ...task, ...payload } : task
        )
      );
      showCustomAlert("Tarefa atualizada com sucesso!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error.response || error);
      showCustomAlert(`Erro ao atualizar tarefa: ${error.message}`);
    }
  };

  const handleRemoveTask = (index) => {
    setTaskToDelete({ ...tasks[index], index });
    setIsDeleteTaskModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    const { id, index } = taskToDelete;
    try {
      await api.delete(`/default-tasks/${id}`);
      setTasks(tasks.filter((_, i) => i !== index));
      showCustomAlert("Tarefa removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover tarefa:", error.response || error);
      showCustomAlert(`Erro ao remover tarefa: ${error.message}`);
    } finally {
      setIsDeleteTaskModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // Outros handlers
  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedEditTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (task) => {
    if (selectedEditTask) {
      handleUpdateTask(task);
    } else {
      handleAssociateTask(task);
    }
    setIsEditModalOpen(false);
    setSelectedEditTask(null);
  };

  const handleCancel = () => {
    navigate("/produtos");
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

  // Render
  return (
    <div className="container">
      <NavBar />
      <main>
        <Title title="Editar Produto" number={1} />
        <article>
          <section>
            <label>Nome do Produto</label>
            <input
              type="text"
              placeholder="Nome do Produto"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
            />
            <label>Codigo do Produto</label>
            <input
              type="text"
              placeholder="Codigo do Produto"
              value={product.code}
              onChange={(e) => setProduct({ ...product, code: e.target.value })}
            />
            <label>Descrição do Produto</label>
            <textarea
              className="descricao"
              placeholder="Descrição do Produto"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
            <div className="btn-container-editar-produto">
              <button className="cancelar" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="deletar" onClick={openDeleteProductModal}>
                Deletar
              </button>
              <button className="salvar" onClick={handleSave}>
                Salvar
              </button>
            </div>

            <Title title="Tarefas" number={2} />
            <button onClick={() => setIsEditModalOpen(true)}>Criar</button>
            <TaskList
              tasks={tasks}
              onViewTask={handleViewTask}
              onEditTask={handleEditTask}
              onRemoveTask={handleRemoveTask}
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

            <ModalConfirm
              isOpen={isDeleteProductModalOpen}
              title="Excluir Produto"
              message={`Tem certeza que deseja excluir o produto "${product.title}"?`}
              onCancel={closeDeleteProductModal}
              onConfirm={handleConfirmDeleteProduct}
            />

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

export default Produto;
