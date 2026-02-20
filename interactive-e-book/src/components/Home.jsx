import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <div className="home-card">
        <h1>Интерактивная книга</h1>

        <p>
          Читайте рассказы, выделяйте важные фрагменты,
          оставляйте заметки и работайте с текстом активно.
        </p>

        <div className="features">
          <div>🖍️ Выделение текста разными цветами</div>
          <div>📝 Заметки к фрагментам</div>
          <div>📚 Список заметок справа</div>
          <div>💾 Автосохранение</div>
        </div>

        <button
          className="start-btn"
          onClick={() => navigate("/book")}
        >
          Начать читать
        </button>
      </div>
    </div>
  )
}

export default Home