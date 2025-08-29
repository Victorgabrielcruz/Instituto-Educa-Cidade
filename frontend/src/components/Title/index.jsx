import './style.css';

export default function Title({ title, number }) {
  return (
      <header className={number === 1 ? "title-header-principal" : "title-header-alt-principal"}>
          <h1>{title}</h1>
      </header>
  );
}