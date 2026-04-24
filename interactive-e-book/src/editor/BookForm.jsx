import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5277/api/books";

export default function BookForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchBook = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Не удалось загрузить книгу");
        }

        const book = await response.json();

        setTitle(book.title || "");
        setAuthor(book.author || "");
        setText(book.text || "");
      } catch (err) {
        console.error("Ошибка загрузки книги:", err);
        setError("Не удалось загрузить книгу");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id, isEditMode]);

  const saveBook = async () => {
    if (!title.trim() || !text.trim()) {
      setError("Заполните название и текст");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const bookData = {
        id: isEditMode ? Number(id) : 0,
        title: title.trim(),
        author: author.trim(),
        text: text.trim(),
        isBuiltIn: false,
      };

      const response = await fetch(
        isEditMode ? `${API_URL}/${id}` : API_URL,
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditMode
            ? "Не удалось обновить книгу"
            : "Не удалось сохранить книгу"
        );
      }

      navigate("/editor/books");
    } catch (err) {
      console.error("Ошибка сохранения книги:", err);
      setError(
        isEditMode
          ? "Не удалось обновить книгу на сервере"
          : "Не удалось сохранить книгу на сервер"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (title || author || text) {
      const confirmExit = window.confirm("Вы уверены? Данные не сохранятся");
      if (!confirmExit) return;
    }

    navigate("/editor/books");
  };

  if (isLoading) {
    return <p>Загрузка книги...</p>;
  }

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

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button className="btn-editor" onClick={handleCancel} disabled={isSaving}>
          Отмена
        </button>

        <button className="btn-editor" onClick={saveBook} disabled={isSaving}>
          {isSaving
            ? isEditMode
              ? "Сохранение..."
              : "Сохранение..."
            : isEditMode
            ? "Сохранить изменения"
            : "Сохранить"}
        </button>
      </div>
    </div>
  );
}