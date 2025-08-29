import React from "react";
import LoginCard from "../../components/LoginCard";
import '../../styles/login.css'; // Mantenha seu CSS aqui

function Login() {
    return (
        <div className="login-page-container">
            <div className="main-login">
                <LoginCard />
            </div>
            <footer className="login-footer">
                <p>&copy; {new Date().getFullYear()} Instituto Educa Cidades. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default Login;