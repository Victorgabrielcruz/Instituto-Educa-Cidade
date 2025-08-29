import "./style.css";
import Card from "../Card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Grid({ Token, pesquisa }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

    const showAlert = (message) => {
    const alertElement = document.createElement("div");
    alertElement.className = "alert";
    alertElement.textContent = message;
    document.body.appendChild(alertElement);

    setTimeout(() => {
      alertElement.remove();
    }, 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (pesquisa) {
          response = await api.get("/products/by-title", {
            params: { title: pesquisa },
          });
        } else {
          response = await api.get("/products");
        }

        if (response.status === 403) {
          alert(`Token inválido. Redirecionando para o login.`);
          navigate("/");
          return;
        }

        const data = response.data;
        setProducts(data);

        if (pesquisa && data.length === 0) {
          showAlert("Nenhum projeto encontrado com esse título.");
          return;
        }
        
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchProducts();
  }, [Token, pesquisa, navigate]);

  return (
    <div className="product-grid">
      {products.length === 0 ? (
        <h3>Nenhum produto cadastrado</h3>
      ) : (
        products.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            option={1}
          />
        ))
      )}
    </div>
  );
}
