import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Состояния для полей формы
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Выбираем эндпоинт в зависимости от режима
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    
    // Формируем объект в соответствии с твоими DTO
    const payload = isRegister 
      ? { username, email, password } 
      : { email, password };

    try {
      const response = await fetch(`http://localhost:5277${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const userData = await response.json();
        // userData содержит { id, username, email }
        onLogin(userData); 
        onClose();
        // Сбрасываем поля
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        const errorText = await response.text();
        alert(errorText || "Ошибка авторизации");
      }
    } catch (err) {
      console.error("Ошибка запроса:", err);
      alert("Не удалось связаться с сервером");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{isRegister ? "Регистрация" : "Вход"}</h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input 
              type="text" 
              placeholder="Имя пользователя" 
              className="modal-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            className="modal-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            className="modal-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <button type="submit" className="btn-modal-primary">
            {isRegister ? "Создать аккаунт" : "Войти"}
          </button>
        </form>
        
        <p className="auth-switch">
          {isRegister ? "Уже есть аккаунт?" : "Еще нет аккаунта?"}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Войти" : " Зарегистрироваться"}
          </span>
        </p>
      </div>
    </div>
  );
}