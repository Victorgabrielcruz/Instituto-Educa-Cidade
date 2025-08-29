import './style.css';
import { Link } from "react-router-dom";

export default function Card({ title, id }) {

  return (
    <Link to={`/detalhesprojeto/${encodeURIComponent(id)}`}>
      <div className="card">
        <h2 className="card-title">{title}</h2>
      </div>
    </Link>
  );
}
