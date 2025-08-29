import "./style.css";
import { Link } from "react-router-dom";

export default function Card({ title, id }) {
  function handleClick() {
    window.location.href = `/produto/${encodeURIComponent(id)}`;
  }
  return (
      <div className="card" onClick={handleClick}>
        <h2 className="card-title" onClick={handleClick}>{title}</h2>
      </div>
  );
}
