import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "./Toolbar";
import TextArea from "./TextArea";
import NotesSidebar from "./NotesSidebar";
import decor from "../assets/ornament1.png";

const API_URL = "http://localhost:5277/api/books";

function BookLayout() {
  const navigate = useNavigate();
  const { id } = useParams();

  const currentBookId = id ? `custom-${id}` : "built-in-chekhov";

  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem("highlights");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeColor, setActiveColor] = useState("yellow");
  const [activeTool, setActiveTool] = useState(null);
  const [customBook, setCustomBook] = useState(null);
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    localStorage.setItem("highlights", JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        setCustomBook(null);
        setBookError("");
        return;
      }

      try {
        setIsLoadingBook(true);
        setBookError("");

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Книга не найдена");
        }

        const foundBook = await response.json();

        setCustomBook({
          ...foundBook,
          decor: foundBook.decor || decor,
          text: foundBook.text
            ? foundBook.text
                .split("\n")
                .map((p) => p.trim())
                .filter(Boolean)
            : [],
        });
      } catch (err) {
        console.error("Ошибка загрузки книги:", err);
        setBookError("Не удалось загрузить книгу");
      } finally {
        setIsLoadingBook(false);
      }
    };

    fetchBook();
  }, [id]);

  const currentBookHighlights = highlights.filter(
    (highlight) => highlight.bookId === currentBookId
  );

  const addHighlight = (data) => {
    setHighlights((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        bookId: currentBookId,
        color: activeColor,
        note: "",
        ...data,
      },
    ]);
  };

  const removeHighlight = (id) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const updateNote = (id, note) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, note } : h))
    );
  };

  const contentsItems = customBook
    ? []
    : [
        { id: "smert-chinovnika", title: "Смерть чиновника" },
        { id: "tolstyi-i-tonkii", title: "Толстый и тонкий" },
        { id: "hameleon", title: "Хамелеон" },
        { id: "chelovek-v-futlyare", title: "Человек в футляре" },
        { id: "o-lyubvi", title: "О любви" },
      ];

  if (isLoadingBook) {
    return (
      <div className="layout">
        <p>Загрузка книги...</p>
      </div>
    );
  }

  if (bookError) {
    return (
      <div className="layout">
        <p>{bookError}</p>
        <button className="btn-editor" onClick={() => navigate("/library")}>
          Вернуться в библиотеку
        </button>
      </div>
    );
  }

  return (
    <>
      <Toolbar
        activeColor={activeColor}
        onChangeColor={setActiveColor}
        activeTool={activeTool}
        onChangeTool={setActiveTool}
        contentsItems={contentsItems}
      />

      <div className="layout">
        <TextArea
          customBook={customBook}
          highlights={currentBookHighlights}
          activeTool={activeTool}
          onHighlight={addHighlight}
          onRemoveHighlight={removeHighlight}
          onUpdateNote={updateNote}
        />

        <NotesSidebar
          highlights={currentBookHighlights}
          onUpdateNote={updateNote}
          onRemoveHighlight={removeHighlight}
        />
      </div>
    </>
  );
}

export default BookLayout;