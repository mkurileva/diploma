import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "./Toolbar";
import TextArea from "./TextArea";
import NotesSidebar from "./NotesSidebar";
import AuthModal from "./AuthModal";
import HintModal from "./HintModal";
import decor from "../assets/ornament1.png";

const API_URL = "http://localhost:5277/api/books";
const NOTES_API = "http://localhost:5277/api/notes";

function BookLayout({ isLoggedIn, user, onLogin }) {

  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const navigate = useNavigate();
  const { id } = useParams();

  // Теперь ID всегда берется из URL. 
  // Для Чехова в базе тоже будет обычный числовой ID.
  const currentBookId = id ? Number(id) : null;

  const [highlights, setHighlights] = useState([]);
  const [activeColor, setActiveColor] = useState("yellow");
  const [activeTool, setActiveTool] = useState(null);
  const [customBook, setCustomBook] = useState(null);
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [bookError, setBookError] = useState("");
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

// 1. ВРЕМЕННЫЙ ФЕЙК-ТЕКСТ ДЛЯ ПРОВЕРКИ ВЕРСТКИ С ТЕЛЕФОНА
  useEffect(() => {
    // Создаем искусственный текст Чехова, разбитый на абзацы
    const fakeChekhovText = [
      "На вокзале Николаевской железной дороги встретились два приятеля: один толстый, другой тонкий. Толстый только что пообедал на вокзале, и губы его, подернутые маслом, лоснились, как спелые вишни. Пахло от него хересом и флер-д’оранжем. Тонкий же только что вышел из вагона и был навьючен чемоданами, узлами и картонками. Пахло от него ветчиной и кофейной гущей.",
      "— Порфирий! — воскликнул толстый, увидев тонкого. — Ты ли это? Голубчик мой! Сколько зим, сколько лет!",
      "— Батюшки! — изумился тонкий. — Миша! Друг детства! Откуда ты взялся?",
      "Приятели троекратно облобызались и устремили друг на друга глаза, полные слез. Оба были приятно ошеломлены.",
      "— Милый мой! — начал тонкий после лобызания. — Вот не ожидал! Вот сюрприз! Ну, да погляди же на меня хорошенько! Такой же красавец, как и был! Такой же душонок и щеголь! Ах ты, господи! Ну, что же ты? Богат? Женат? Я уже женат, как видишь... Это вот моя жена, Луиза, урожденная Ванценбах... лютеранка... А это сын мой, Нафанаил, ученик III класса. Это, Нафанаил, друг моего детства! В гимназии вместе учились!"
    ];

    setCustomBook({
      id: currentBookId || 1, // Если ID нет, ставим 1
      title: "Толстый и тонкий",
      author: "Антон Чехов",
      text: fakeChekhovText,
      decor: decor
    });
    
    setIsLoadingBook(false);
    setBookError(""); // Обнуляем ошибку, чтобы страница не блокировалась
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
          userId: user.id, // Привязываем заметку к текущему пользователю
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
      // Передаем userId, чтобы сервер проверил права на удаление
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

  // 5. Обновление текста заметки
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
      }
    } catch (err) {
      console.error("Ошибка обновления заметки:", err);
    }
  };

  const contentsItems = []; // Оставляем массив пустым, чтобы скрыть содержание

  // Состояния загрузки и ошибок
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
          bookId={currentBookId}
          highlights={highlights}
          activeTool={activeTool}
          onHighlight={addHighlight}
          onRemoveHighlight={removeHighlight}
          onUpdateNote={updateNote}
          showToast={showToast}
        />

        {/* Сайдбар показываем только авторизованным, либо в режиме гостя с заглушкой */}
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