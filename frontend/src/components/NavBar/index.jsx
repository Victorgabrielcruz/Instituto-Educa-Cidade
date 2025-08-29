import abount from "../../assets/about.png";
import home from "../../assets/home.png";
import product from "../../assets/product.png";
import project from "../../assets/project.png";
import settings from "../../assets/setings.png";
import users from "../../assets/usuarios.png";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <span onClick={logout} class="material-symbols-outlined">
      logout
    </span>
  );
}

function Navbar() {
  return (
    <>
      <nav className="navbar">
        <section className="about">
          <ul>
            <li>
              <Link to={`/perfilUsuario`}>
                <span class="material-symbols-outlined user-icon">
                  account_circle
                </span>
              </Link>
            </li>
          </ul>
        </section>
        <section className="menu">
          <ul>
            <li>
              <Link to="/home">
                <span class="material-symbols-outlined">Home</span>
              </Link>
            </li>
            <li>
              <Link to={`/projetos`}>
                <span class="material-symbols-outlined icon-large">
                  assignment
                </span>
              </Link>
            </li>
            <li>
              <Link to={`/produtos`}>
                <span class="material-symbols-outlined box-icon">
                  inventory_2
                </span>
              </Link>
            </li>
            <li className="users">
              <Link to={`/gerenciarUsuarios`}>
                <span class="material-symbols-outlined user-icon">group</span>
              </Link>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </section>
      </nav>
    </>
  );
}

export default Navbar;
