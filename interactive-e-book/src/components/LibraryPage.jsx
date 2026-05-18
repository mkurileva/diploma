import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5277/api/books";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}?all=true`);
        const data = await response.json();
        setBooks(data); // Просто кладем всё из БД
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Логика фильтрации
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      (book.author && book.author.toLowerCase().includes(query))
    );
  });

  return (
  <div className="library-page">
    <div className="library-header">
      <h1>БИБЛИОТЕКА</h1>
      <button className="btn" onClick={() => navigate("/")}>На главную</button>
    </div>

    <div className="search-container">
      <input
        type="text"
        placeholder="Поиск по названию или автору..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    {/* СЕКЦИЯ 1: КОЛЛЕКЦИЯ БИБЛИОТЕКИ */}
    {filteredBooks.some(b => b.isBuiltIn) && ( //
      <section className="library-section">
        <h2>Коллекция библиотеки</h2>
        <div className="library-grid">
          {filteredBooks.filter(b => b.isBuiltIn).map(book => ( //
            <div className="library-card" key={book.id}>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <button className="btn-editor" onClick={() => navigate(`/book/custom/${book.id}`)}>
                Открыть
              </button>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* СЕКЦИЯ 2: ПОЛЬЗОВАТЕЛЬСКИЕ КНИГИ */}
    <section className="library-section">
      <h2>Пользовательские книги</h2>
      
      {isLoading ? (
        <div className="library-empty"><p>Загрузка книг...</p></div>
      ) : filteredBooks.filter(b => !b.isBuiltIn).length === 0 ? ( //[cite: 7]
        <div className="library-empty">
          <p>{searchQuery ? "Ничего не найдено" : "Пока нет добавленных книг"}</p>
          {!searchQuery && (
            <button className="btn-editor" onClick={() => navigate("/editor/books")}>
              Перейти в редактор
            </button>
          )}
        </div>
        ) : (
            <div className="library-grid">
              {/* Мапим книги, у которых isBuiltIn === false */}
              {filteredBooks.filter(b => !b.isBuiltIn).map((book) => ( //[cite: 7]
                <div className="library-card" key={book.id}>
                  <h3>{book.title}</h3>
                  <p>{book.author || "Автор не указан"}</p>
                  <button
                    className="btn-editor"
                    onClick={() => navigate(`/book/custom/${book.id}`)}
                  >
                    Открыть
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
  </div>
);
}