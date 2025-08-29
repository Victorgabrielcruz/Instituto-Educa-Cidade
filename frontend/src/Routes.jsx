import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/Auth/Login";
import NewUser from "./features/Auth/NewUser";
import GerenciaProdutos from "./pages/GerenciaProdutos/GerenciaProdutos";
import NovoProduto from "./pages/GerenciaProdutos/NovoProduto";
import GerenciaProjetos from "./pages/GerenciaProjetos/GerenciaProjetos";
import GerenciaUsuarios from "./pages/GerenciaUsuarios/GerenciaUsuarios";
import Produto from "./pages/GerenciaProdutos/Produto";
import DetalhesProjeto from "./pages/GerenciaProjetos/DetalhesProjeto";
import NovaTarefa from "./pages/GerenciaTarefas/NovaTarefa";
import EditarTarefa from "./pages/GerenciaTarefas/EditarTarefa";
import DetalhesProduto from "./pages/GerenciaProdutos/DetalhesProduto";
import DetalhesTarefa from "./pages/GerenciaTarefas/DetalhesTarefa";
import PerfilUsuario from "./pages/GerenciaUsuarios/PerfilUsuario.jsx";
import { HomePage } from "./pages/HomePage/Home.jsx";

function NotFound() {
  return <h1 style={{ color: "black", textAlign: "center", fontSize: "24px", justifyContent: "center"}}> 404 - Página não encontrada</h1>;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/newUser" element={<NewUser />} />
                <Route path="/produtos" element={<GerenciaProdutos />} />
                <Route path="/novoProduto" element={<NovoProduto />} />
                <Route path="/projetos" element={<GerenciaProjetos />} />
                <Route path="/produto/:id" element={<Produto />} />
                <Route path="/gerenciarUsuarios" element={<GerenciaUsuarios />} />
                <Route path="/detalhesProjeto/:id" element={<DetalhesProjeto />} />
                <Route path="/novaTarefa/:id" element={<NovaTarefa />} />
                <Route path="/detalhesProduto/:id" element={<DetalhesProduto />} />
                <Route path="/editarTarefa/:id/:tarefaId" element={<EditarTarefa />} />
                <Route path="/detalhesTarefa/:id/:tarefaId" element={<DetalhesTarefa />} />
                <Route path="/perfilUsuario" element={<PerfilUsuario />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<Login />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;
