import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="editor-sidebar">
      <nav>
        <NavLink to="/editor/books">Мои книги</NavLink>
        <NavLink to="/editor/profile">Личный кабинет</NavLink>
      </nav>

      <button className="btn-editor" onClick={() => navigate("/")}>
        На главную
      </button>
    </aside>
  );
}