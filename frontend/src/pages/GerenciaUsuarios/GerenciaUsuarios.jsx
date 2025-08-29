import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Title from "../../components/Title";
import UsersTable from "../../components/UsersTable";
import ModalNewUser from "../../components/ModalNewUser";
import { useNavigate } from "react-router-dom";

function GerenciaUsuarios() {
  const [showModalNewUser, setShowModalNewUser] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
      if (!token) {
          navigate('/login'); 
      }
  }, [token, navigate]);

  const handleOpenModal = () => {
    setShowModalNewUser(true);
  };

  const handleCloseModal = () => {
    setShowModalNewUser(false);
  };

  return (
    <div className="container">
      <NavBar />
      <main>
        <Title title="Usuários" number={1} />
        <button onClick={handleOpenModal}>Criar</button>
        <UsersTable />
        <ModalNewUser isOpen={showModalNewUser} onCancel={handleCloseModal} />
      </main>
    </div>
  );
}

export default GerenciaUsuarios;
