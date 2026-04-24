import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5277/api/books";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Не удалось загрузить книги");
        }

        const data = await response.json();

        // берём только пользовательские книги
        const userBooks = data.filter((book) => !book.isBuiltIn);
        setBooks(userBooks);
      } catch (err) {
        console.error("Ошибка загрузки книг:", err);
        setError("Не удалось загрузить книги с сервера");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
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

        {isLoading ? (
          <div className="library-empty">
            <p>Загрузка книг...</p>
          </div>
        ) : error ? (
          <div className="library-empty">
            <p>{error}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="library-empty">
            <p>Пока нет добавленных книг</p>
            <button
              className="btn-editor"
              onClick={() => navigate("/editor/books")}
            >
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