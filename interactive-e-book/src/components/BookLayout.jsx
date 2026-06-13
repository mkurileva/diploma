import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "./Toolbar";
import TextArea from "./TextArea";
import NotesSidebar from "./NotesSidebar";
import AuthModal from "./AuthModal";
import HintModal from "./HintModal";
import decor from "../assets/ornament1.png";

const API_URL = "https://diploma-backend-ebqp.onrender.com/api/books";
const NOTES_API = "https://diploma-backend-ebqp.onrender.com/api/notes";

function BookLayout({ isLoggedIn, user, onLogin }) {

  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const navigate = useNavigate();
  const { id } = useParams();

  const currentBookId = id ? Number(id) : null;

  const [highlights, setHighlights] = useState([]);
  const [activeColor, setActiveColor] = useState("yellow");
  const [activeTool, setActiveTool] = useState(null);
  const [customBook, setCustomBook] = useState(null);
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [bookError, setBookError] = useState("");
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Состояния для адаптивности под мобильные устройства
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileAlertOpen, setIsMobileAlertOpen] = useState(window.innerWidth <= 768);

  // Отслеживание изменения ширины экрана
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileAlertOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Загрузка данных книги
  useEffect(() => {
    const fetchBook = async () => {
      if (!currentBookId) return;

      try {
        setIsLoadingBook(true);
        const response = await fetch(`${API_URL}/${currentBookId}`);
        if (!response.ok) throw new Error("Книга не найдена");

        const foundBook = await response.json();
        setCustomBook({
          ...foundBook,
          decor: foundBook.decor || decor,
          text: foundBook.text ? foundBook.text.split("\n").map(p => p.trim()).filter(Boolean) : [],
        });
      } catch (err) {
        setBookError("Не удалось загрузить книгу");
      } finally {
        setIsLoadingBook(false);
      }
    };
    fetchBook();
  }, [currentBookId]);

  // 2. Загрузка заметок
  useEffect(() => {
    const fetchNotes = async () => {
      setHighlights([]); 
      if (!isLoggedIn || !user?.id || !currentBookId) return;

      try {
        const res = await fetch(`${NOTES_API}/book/${currentBookId}?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setHighlights(data.map(n => ({
            id: n.id,
            bookId: n.bookId,
            paragraphIndex: n.paragraphIndex,
            start: n.start,
            end: n.end,
            text: n.text,
            note: n.noteText,
            color: n.color || "yellow",
          })));
        }
      } catch (err) {
        console.error("Ошибка загрузки заметок:", err);
      }
    };
    fetchNotes();
  }, [currentBookId, isLoggedIn, user?.id]);

  // 3. Создание новой заметки (Highlight)
  const addHighlight = async (data) => {
    if (!isLoggedIn || !user?.id) {
      setIsHintOpen(true);
      return;
    }

    try {
      const res = await fetch(NOTES_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: currentBookId,
          userId: user.id,
          paragraphIndex: data.paragraphIndex,
          start: data.start,
          end: data.end,
          text: data.text,
          noteText: "",
          color: activeColor,
        }),
      });

      if (!res.ok) throw new Error("Не удалось сохранить заметку");

      const saved = await res.json();

      setHighlights((prev) => [
        ...prev,
        {
          id: saved.id,
          bookId: currentBookId,
          color: activeColor,
          note: "",
          ...data,
        },
      ]);
    } catch (err) {
      console.error("Ошибка создания заметки:", err);
    }
  };

  // 4. Удаление заметки
  const removeHighlight = async (highlightId) => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${NOTES_API}/${highlightId}?userId=${user.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
      } else {
        console.error("Ошибка удаления: нет доступа или заметка не найдена");
      }
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  // 5. Обновление текста заметки (Стабильное сохранение по кнопке)
  const updateNote = async (highlightId, noteText) => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${NOTES_API}/${highlightId}?userId=${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noteText: noteText,
        }),
      });

      if (res.ok) {
        setHighlights((prev) =>
          prev.map((h) => (h.id === highlightId ? { ...h, note: noteText } : h))
        );
        showToast("Заметка успешно сохранена!", "success");
      } else {
        showToast("Не удалось сохранить заметку на сервере", "error");
      }
    } catch (err) {
      console.error("Ошибка обновления заметки:", err);
      showToast("Ошибка соединения с сервером", "error");
    }
  };

  const contentsItems = [];

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
        isLoggedIn={isLoggedIn}
        onAuthClick={() => setIsAuthOpen(true)}
        isMobile={isMobile} 
      />

      <div className="layout">
        <TextArea
          customBook={customBook}
          bookId={currentBookId}
          highlights={highlights}
          activeTool={activeTool}
          onHighlight={addHighlight}
          onRemoveHighlight={removeHighlight}
          onUpdateNote={updateNote}
          showToast={showToast}
        />

        {isLoggedIn ? (
          <NotesSidebar
            highlights={highlights}
            onUpdateNote={updateNote}
            onRemoveHighlight={removeHighlight}
          />
        ) : (
          <aside className="notes-sidebar guest-mode">
            <div className="notes-sidebar-header">
              <h3 className="note-title">Заметки</h3>
            </div>
            <p className="guest-hint">
              Войдите в систему, чтобы создавать заметки и сохранять важные мысли.
            </p>
          </aside>
        )}
      </div>

      <HintModal 
        isOpen={isHintOpen} 
        onClose={() => setIsHintOpen(false)}
        onAuthClick={() => {
          setIsHintOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={onLogin} 
      />

      {/* Модалка с предупреждением для мобильных устройств */}
      {isMobileAlertOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "25px",
            borderRadius: "16px",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            fontFamily: "Hauora, sans-serif"
          }}>
            <h3 style={{ marginTop: 0, color: "#2c3e50", fontSize: "18px" }}>Обратите внимание</h3>
            <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.5", margin: "15px 0 20px" }}>
              В мобильной версии вы можете комфортно читать произведения и просматривать свои заметки, созданные ранее.
              <br /><br />
              Однако создавать новые выделения и заметки с телефона пока нельзя. Чтобы использовать весь функционал сайта, зайдите с компьютера!
            </p>
            <button 
              onClick={() => setIsMobileAlertOpen(false)}
              style={{
                backgroundColor: "#bbd0e5",
                color: "#2c3e50",
                border: "none",
                padding: "10px 24px",
                borderRadius: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background 0.2s"
              }}
            >
              Понятно
            </button>
          </div>
        </div>
      )}

      {toast.message && (
        <div className={`toast-message ${toast.type}`} style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: toast.type === 'error' ? '#e74c3c' : '#333',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          zIndex: 9999,
          fontSize: '14px',
          animation: 'fadeInUp 0.3s ease'
        }}>
          {toast.message}
        </div>
      )}
    </>
  );
}

export default BookLayout;