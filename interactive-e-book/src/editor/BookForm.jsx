import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function BookForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const books = useMemo(() => {
    return JSON.parse(localStorage.getItem("books") || "[]");
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const bookToEdit = books.find((book) => String(book.id) === String(id));

    if (!bookToEdit) {
      navigate("/editor/books");
      return;
    }

    setTitle(bookToEdit.title || "");
    setAuthor(bookToEdit.author || "");
    setText(Array.isArray(bookToEdit.text) ? bookToEdit.text.join("\n") : "");
  }, [books, id, isEditMode, navigate]);

  const saveBook = () => {
    if (!title.trim() || !text.trim()) {
      alert("Заполните название и текст");
      return;
    }

    const paragraphs = text
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    if (isEditMode) {
      const updatedBooks = books.map((book) =>
        String(book.id) === String(id)
          ? {
              ...book,
              title,
              author,
              text: paragraphs,
            }
          : book
      );

      localStorage.setItem("books", JSON.stringify(updatedBooks));
    } else {
      const newBook = {
        id: Date.now().toString(),
        title,
        author,
        text: paragraphs,
        decor: null,
      };

      localStorage.setItem("books", JSON.stringify([...books, newBook]));
    }

    navigate("/editor/books");
  };

  const handleCancel = () => {
    if (title || author || text) {
      const confirmExit = window.confirm("Вы уверены? Данные не сохранятся");
      if (!confirmExit) return;
    }

    navigate("/editor/books");
  };

  return (
    <div>
      <h1>{isEditMode ? "Редактировать книгу" : "Добавить книгу"}</h1>

      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Автор"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <textarea
        placeholder="Текст книги"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="form-actions">
        <button className="btn-editor" onClick={saveBook}>
          {isEditMode ? "Сохранить изменения" : "Сохранить"}
        </button>

        <button className="btn-editor" onClick={handleCancel}>
          Отмена
        </button>

        
      </div>
    </div>
  );
}