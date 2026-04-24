import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5277/api/books";

export default function MyBooks() {
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

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm("Удалить книгу?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить книгу");
      }

      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Ошибка удаления книги:", err);
      alert("Не удалось удалить книгу");
    }
  };

  return (
    <div>
      <h1>Мои книги</h1>

      <button className="btn-editor" onClick={() => navigate("/editor/books/new")}>
        + Добавить книгу
      </button>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p>{error}</p>
      ) : books.length === 0 ? (
        <p>Вы пока не добавили ни одной книги</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={deleteBook}
            />
          ))}
        </div>
      )}
    </div>
  );
}