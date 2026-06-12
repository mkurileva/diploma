import { useState, useEffect } from "react";

export default function Profile({ user, onLogout }) {
  const [stats, setStats] = useState({
    booksCount: 0,
    notesCount: 0,
    joinDate: ""
  });
  const [loading, setLoading] = useState(true);
  
  // Состояния для смены пароля
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
const fetchUserStats = async () => {
  if (!user?.id) return;

  try {
    setLoading(true);
    
    // Принудительно делаем ID числом, чтобы C# его понял
    const numericUserId = Number(user.id);

    const [booksRes, notesRes] = await Promise.all([
      fetch(`https://diploma-backend-ebqp.onrender.com/api/books?userId=${numericUserId}`),
      fetch(`https://diploma-backend-ebqp.onrender.com/api/notes/user/${numericUserId}`)
    ]);

    // Безопасно парсим книги
    let booksCount = 0;
    if (booksRes.ok) {
      const booksData = await booksRes.json();
      booksCount = Array.isArray(booksData) ? booksData.length : 0;
    }

    // Безопасно парсим заметки
    let notesCount = 0;
    if (notesRes.ok) {
      const notesData = await notesRes.json();
      notesCount = Array.isArray(notesData) ? notesData.length : 0;
    }

    setStats({
      booksCount: booksCount,
      notesCount: notesCount,
      joinDate: user.createdAt 
        ? new Date(user.createdAt).toLocaleDateString()
        : new Date().toLocaleDateString() // если даты нет, покажем текущую
    });

  } catch (error) {
    console.error("Ошибка при загрузке статистики профиля:", error);
  } finally {
    setLoading(false);
  }
};

    fetchUserStats();
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://diploma-backend-ebqp.onrender.com/api/users/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          oldPassword: passwords.old,
          newPassword: passwords.new
        })
      });

      if (res.ok) {
        setMessage({ text: "Пароль успешно изменен!", type: "success" });
        setPasswords({ old: "", new: "" });
        setTimeout(() => setIsChangingPassword(false), 2000);
      } else {
        const errText = await res.text();
        setMessage({ text: errText || "Ошибка при смене пароля", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Ошибка соединения с сервером", type: "error" });
    }
  };

  if (!user) return <p className="profile-msg">Пожалуйста, войдите в аккаунт</p>;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-avatar">
          {user.username ? user.username[0].toUpperCase() : "U"}
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </header>

      <div className="profile-grid">
        <div className="profile-card stats-card">
          <h3>Статистика чтения</h3>
          {loading ? (
            <p>Загрузка данных...</p>
          ) : (
            <>
              <div className="stats-row">
                <span>Добавлено книг:</span>
                <strong>{stats.booksCount}</strong>
              </div>
              <div className="stats-row">
                <span>Сделано заметок:</span>
                <strong>{stats.notesCount}</strong>
              </div>
              <div className="stats-row">
                <span>В клубе с:</span>
                <strong>{stats.joinDate}</strong>
              </div>
            </>
          )}
        </div>

        <div className="profile-card actions-card">
          <h3>Настройки</h3>
          
          {!isChangingPassword ? (
            <button className="profile-btn" onClick={() => setIsChangingPassword(true)}>
              Сменить пароль
            </button>
          ) : (
            <form className="password-form" onSubmit={handleChangePassword}>
              <input 
                type="password" 
                placeholder="Старый пароль" 
                required
                value={passwords.old}
                onChange={(e) => setPasswords({...passwords, old: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="Новый пароль" 
                required
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
              <div className="form-buttons">
                <button type="submit" className="profile-btn small">Ок</button>
                <button 
                  type="button" 
                  className="profile-btn small secondary" 
                  onClick={() => {setIsChangingPassword(false); setMessage({text:"", type:""})}}
                >
                  Отмена
                </button>
              </div>
              {message.text && (
                <p className={`msg-text ${message.type}`}>{message.text}</p>
              )}
            </form>
          )}

          <button className="profile-btn danger" onClick={onLogout}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}