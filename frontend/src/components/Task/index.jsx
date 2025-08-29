import "./style.css";

export default function Task({ name, status, onViewTask, onEdit, onDelete }) {
  // Define a classe da elipse conforme o status
  let elipseClass = "elipse";
  if (status === "BAIXA") {
    elipseClass += " elipse baixa";
  } else if (status === "MEDIA") {
    elipseClass += " elipse media";
  } else if (status === "ALTA") {
    elipseClass += " elipse alta";
  } else if (status === "CRITICA") {
    elipseClass += " elipse critica";
  }

  return (
    <div className="task">
      <h3 className="taskName">{name}</h3>
      <div className={elipseClass}></div>
      <div className="botoes">
        <button className="icon-button detalhes" onClick={onViewTask}> {/* Mudado de onView para onViewTask */}
          <span className="material-icons">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-eye"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
        </button>
        <button className="icon-button edit" title="Editar" onClick={onEdit}>
          <span className="material-icons">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-pencil-icon lucide-pencil"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
          </span>
        </button>
        <button className="icon-button delete" title="Excluir" onClick={onDelete}>
          <span className="material-icons">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash2-icon lucide-trash-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}