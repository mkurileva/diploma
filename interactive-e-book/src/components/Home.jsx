import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { stories } from "../data/stories"; // Импорт твоих рассказов
import picture1 from "../assets/picture1.png";
import picture2 from "../assets/picture2.png";
import AuthModal from "./AuthModal";

/* --- ХУК И ОБЕРТКА ДЛЯ АНИМАЦИИ (оставляем как было) --- */
function useInView() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
}

function FadeSection({ children }) {
  const [ref, isVisible] = useInView();
  return (
    <div ref={ref} className={`fade-section ${isVisible ? "visible" : ""}`}>
      {children}
    </div>
  );
}

/* --- НОВЫЙ КОМПОНЕНТ: КНИЖНАЯ ПОЛКА --- */

const Bookshelf = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [viewIndex, setViewIndex] = useState(0);
  const navigate = useNavigate();

  const VISIBLE_COUNT = 5;

useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://diploma-backend-ebqp.onrender.com/api/books?all=true");
        const data = await response.json();

        // Теперь просто мапим всё, что пришло из базы
        const formattedBooks = data.map(b => ({
          id: b.id, 
          title: b.title, 
          author: b.author || "Автор", 
          // Если ты сделала SQL-запрос на isBuiltIn, то Чехов будет с этим цветом:
          color: b.isBuiltIn ? "#BCC5D6" : "#a0a9b9", 
          isCustom: !b.isBuiltIn
        }));

        setAllBooks(formattedBooks);
      } catch (err) {
        console.error("Ошибка полки:", err);
      }
    };
    fetchBooks();
  }, []);

 
  // Логика прокрутки: когда кликаем на книгу, она становится активной, 
  // и мы смещаем "окно" видимости, если это крайняя книга
  const handleSelect = (index) => {
    setViewIndex(index);
  };

  // Вычисляем, какие книги показать (срез массива вокруг активной книги)
  const visibleBooks = allBooks.slice(
    Math.max(0, Math.min(viewIndex - 2, allBooks.length - VISIBLE_COUNT)),
    Math.max(VISIBLE_COUNT, Math.min(viewIndex + 3, allBooks.length))
  );

  return (
    <div className="bookshelf-container">
       {/* Кнопки "влево/вправо" можно сделать невидимыми зонами по бокам */}
       <div className="bookshelf">
        {visibleBooks.map((book) => (
          <div
            key={book.id}
            className={`book-item ${allBooks[viewIndex].id === book.id ? "active" : ""}`}
            style={{ "--book-color": book.color }}
            onClick={() => handleSelect(allBooks.indexOf(book))}
          >
            <div className="book-spine">
              <span className="spine-title">{book.title}</span>
            </div>
            <div className="book-cover">
              <div className="cover-content">
                <p className="cover-author">{book.author}</p>
                <h3 className="cover-title">{book.title}</h3>
                <button className="read-btn" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/custom/${book.id}`);
                    }}>Открыть</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- ОСНОВНАЯ СТРАНИЦА --- */
export default function LandingPage({ isLoggedIn, onLogin }) {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLibraryClick = () => {
    navigate("/library");
    window.scrollTo(0, 0);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/editor/profile");
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <div className="landing">
        <section className="hero">
          <div className="hero-left">
            <h1>ИНТЕРАКТИВНАЯ <br /> ЭЛЕКТРОННАЯ <br /> КНИГА</h1>
            <button className="btn" onClick={handleLibraryClick}>
              Начать читать
            </button>
            <button className="btn secondary" onClick={handleProfileClick}>
              {isLoggedIn ? "Личный кабинет" : "Войти в аккаунт"}
            </button>
          </div>
          <div className="hero-right">
            <Bookshelf />
          </div>
        </section>

        {/* Остальные секции DESCRIPTION, ABOUT, FEATURES оставляем как были */}
              <FadeSection>
        <section className="description">
          <p className="big-text">
            Читайте произведения, выделяйте важные фрагменты,
            оставляйте заметки и работайте с текстом
            <span className="accent"> активно.</span>
          </p>
        </section>
      </FadeSection>

      {/* ABOUT */}
      <FadeSection>
        <section className="about">
          <img src={picture1} alt="picture1" />

          <div className="about-text">
            <p>
              Это интерактивная электронная библиотека, в которой можно читать
              художественные произведения и работать с текстом.
            </p>
            <p>
              Цель этого проекта — совместить все лучшее от традиционного и цифрового чтения
              и создать пространство, где читатель сможет воспользоваться всеми удобствами
              электронной книги, сохранив при этом чувство книжного уюта.
            </p>
          </div>
        </section>
      </FadeSection>

      {/* ОБЪЕДИНЕННАЯ СЕКЦИЯ FEATURES + CONTENT */}
      <FadeSection>
        <div className="combined-container">
          <div className="combined-left">
            
            {/* Блок FEATURES */}
            <section className="features-block">
              <p className="big-text1">
                <span className="accent1">Чтение здесь</span> — это не просто 
                просмотр текста, но и возможность 
                работать с ним.
              </p>
              <div className="features-list">
                <p>— выделять фрагменты текста</p>
                <p>— оставлять к ним заметки</p>
                <p>— возвращаться к важным местам</p>
                <p>— редактировать или удалять заметки</p>
                <p>— перемещаться между рассказами</p>
              </div>
            </section>

            {/* Блок CONTENT (Своя библиотека) */}
            <section className="content-block">
              <p className="hand">Своя библиотека</p>
              <div className="content-text">
                <p>Вы можете читать произведения не только из коллекции библиотеки, но и добавлять собственные книги.</p>
              </div>
              <div className="content-actions">
                <button className="btn" onClick={handleLibraryClick}>Начать читать</button>
                <button className="btn secondary" onClick={handleProfileClick}>
                  {isLoggedIn ? "Личный кабинет" : "Войти в аккаунт"}
                </button>
              </div>
            </section>

          </div>

          <div className="combined-right">
            <img src={picture2} alt="picture2" className="tall-halftone-img" />
          </div>
        </div>
      </FadeSection>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>Проект выполнен в рамках выпускной квалификационной работы</p>
          <p>Автор: Мария Курылева</p>
          <p>2026</p>
        </div>
      </footer>

      {/* Модальное окно входа */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={onLogin} 
      />
    </>
  );
}