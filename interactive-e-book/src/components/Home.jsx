import chekhov from "../assets/chekhov.png"
import books from "../assets/books.png"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react";

/* --- ХУК --- */
function useInView() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

/* --- ОБЕРТКА --- */
function FadeSection({ children }) {
  const [ref, isVisible] = useInView();

  return (
    <div
      ref={ref}
      className={`fade-section ${isVisible ? "visible" : ""}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/book");
    window.scrollTo(0, 0);
  };

  return (
    <div className="landing">

      {/* HERO (без анимации — он сразу виден) */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            ИНТЕРАКТИВНАЯ <br />
            ЭЛЕКТРОННАЯ <br />
            КНИГА
          </h1>
          <button className="btn" onClick={handleClick}>
            Начать читать
          </button>
        </div>

        <div className="hero-right">
          <img src={books} alt="books" />
        </div>
      </section>

      {/* DESCRIPTION */}
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
          <img src={chekhov} alt="chekhov" />

          <div className="about-text">
            <p>
              Это интерактивная электронная книга с рассказами Антона Павловича Чехова.
            </p>
            <p>
              Цель этого проекта — совместить все лучшее от традиционного и цифрового чтения
              и создать пространство, где читатель сможет воспользоваться всеми удобствами
              электронной книги, сохранив при этом чувство уюта и спокойствия.
            </p>
          </div>
        </section>
      </FadeSection>

      {/* FEATURES */}
      <FadeSection>
        <section className="features">
          <div className="features-left">
            <p>
              <span className="hand">Чтение здесь</span> — это не просто 
              просмотр<br /> текста, но и возможность 
              работать с ним.
            </p>

            <div className="features-list">
              <p>— выделять фрагменты текста</p>
              <p>— оставлять к ним заметки</p>
              <p>— возвращаться к важным местам</p>
              <p>— редактировать или удалять заметки</p>
              <p>— перемещаться между рассказами</p>
            </div>
          </div>

          <div className="features-right">
            <div className="placeholder" />
          </div>
        </section>
      </FadeSection>

      {/* CONTENT */}
      <FadeSection>
        <section className="content">
          <p className="hand">Содержание</p>

          <div className="contents-list">
            <p>Смерть чиновника</p>
            <p>Толстый и тонкий</p>
            <p>Хамелеон</p>
            <p>Человек в футляре</p>
            <p>О любви</p>
          </div>

          <button className="btn" onClick={handleClick}>
            Начать читать
          </button>
        </section>
      </FadeSection>


        <footer className="footer">
        <div className="footer-content">
          <p>Проект выполнен в рамках выпускной квалификационной работы</p>
          <p>Автор: Мария Курылева</p>
          <p>2026</p>
        </div>
      </footer>
      </div>

    
  );
}