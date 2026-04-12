import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import { useNavigate } from "react-router-dom";

export default function MyBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("books") || "[]");
    setBooks(saved);
  }, []);

  const deleteBook = (id) => {
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    localStorage.setItem("books", JSON.stringify(updated));
  };

  return (
    <div>
      <h1>Мои книги</h1>
      {books.length === 0 && (
        <p>Вы пока не добавили ни одной книги</p>
      )}

      <button className="btn-editor" onClick={() => navigate("/editor/books/new")}>
        + Добавить книгу
      </button>

      

      <div className="books-grid">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onDelete={deleteBook}
          />
        ))}
      </div>
    </div>
  );
}