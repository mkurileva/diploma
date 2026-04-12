import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem("books") || "[]");
    setBooks(savedBooks);
  }, []);

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>БИБЛИОТЕКА</h1>

        <button className="btn-editor" onClick={() => navigate("/")}>
          На главную
        </button>
      </div>

      <section className="library-section">
        <h2>Коллекция библиотеки</h2>

        <div className="library-grid">
          <div className="library-card">
            <h3>Сборник рассказов</h3>
            <p>Антон Павлович Чехов</p>
            <button className="btn-editor" onClick={() => navigate("/book")}>
              Открыть
            </button>
          </div>
        </div>
      </section>

      <section className="library-section">
        <h2>Пользовательские книги</h2>

        {books.length === 0 ? (
          <div className="library-empty">
            <p>Пока нет добавленных книг</p>
            <button className="btn-editor" onClick={() => navigate("/editor/books")}>
              Перейти в редактор
            </button>
          </div>
        ) : (
          <div className="library-grid">
            {books.map((book) => (
              <div className="library-card" key={book.id}>
                <h3>{book.title}</h3>
                <p>{book.author || "Автор не указан"}</p>
                <button
                  className="btn-editor"
                  onClick={() => navigate(`/book/custom/${book.id}`)}
                >
                  Открыть
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}