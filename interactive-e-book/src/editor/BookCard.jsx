import { useNavigate } from "react-router-dom";

export default function BookCard({ book, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <button className="btn-editor" onClick={() => navigate(`/book/custom/${book.id}`)}>
          Читать
        </button>

      <button className="btn-editor" onClick={() => navigate(`/editor/books/${book.id}/edit`)}>
        Редактировать
      </button>

      <button className="btn-editor" onClick={() => onDelete(book.id)}>
        Удалить
      </button>
    </div>
  );
}