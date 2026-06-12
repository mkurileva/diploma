import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { useNavigate } from "react-router-dom";

const API_URL = "https://diploma-backend-ebqp.onrender.com//api/books";

// 1. Добавляем проп { user }
export default function MyBooks({ user }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      // Если юзер еще не загрузился, ничего не делаем
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError("");

        // 2. Меняем URL: добавляем userId, чтобы сервер отфильтровал только НАШИ книги
        const response = await fetch(`${API_URL}?userId=${user.id}`);

        if (!response.ok) {
          throw new Error("Не удалось загрузить книги");
        }

        const data = await response.json();
        
        // 3. Убираем фильтрацию здесь, так как бэкенд уже прислал только то, что нужно
        setBooks(data); 
      } catch (err) {
        console.error("Ошибка загрузки книг:", err);
        setError("Не удалось загрузить книги с сервера");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [user?.id]); // 4. Добавляем зависимость от ID пользователя

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm("Удалить книгу?");
    if (!confirmDelete) return;

    try {
      // При удалении тоже желательно передавать userId для безопасности, 
      // если ты обновила Delete в контроллере
      const response = await fetch(`${API_URL}/${id}?userId=${user.id}`, {
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