import { useState } from 'react';
import './style.css';
import Modal from '../ModalEditProject/modalEdit';

export default function Title({ title, number, id }) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const fecharModal = () => setMostrarModal(false);

  return (
    <header className={number === 1 ? "title-header" : "title-header-alt"}>
      <h1>{title}</h1>
      <button onClick={abrirModal}>
        <span className="material-symbols-outlined">edit</span>
      </button>
      {mostrarModal && <Modal fecharModal={fecharModal} id={id} />}
    </header>
  );
}
