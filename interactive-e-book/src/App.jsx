import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import BookLayout from "./components/BookLayout";
import EditorLayout from "./editor/EditorLayout";
import MyBooks from "./editor/MyBooks";
import BookForm from "./editor/BookForm";
import Profile from "./editor/Profile";
import LibraryPage from "./components/LibraryPage";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // 1. Проверка при загрузке приложения
  useEffect(() => {
    const savedUser = localStorage.getItem("app_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUser(parsedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    // 2. Сохраняем в localStorage (превращаем объект в строку)
    localStorage.setItem("app_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    // 1. Сбрасываем состояние в React
    setIsLoggedIn(false);
    setUser(null);
    
    // 2. Очищаем память браузера
    localStorage.removeItem("app_user");
    
    // 3. Отправляем на главную
    // window.location.href — это "жесткая" перезагрузка на главную.
    // Это гарантирует, что никакие данные профиля не останутся в памяти.
    window.location.href = "/"; 
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route 
          path="/" 
          element={<Home isLoggedIn={isLoggedIn} onLogin={handleLogin} />} 
        />
        <Route path="/library" element={<LibraryPage />} />
        
        <Route 
          path="/book" 
          element={<BookLayout isLoggedIn={isLoggedIn} user={user} onLogin={handleLogin} />} 
        />

        <Route 
          path="/book/custom/:id" 
          element={<BookLayout isLoggedIn={isLoggedIn} user={user} onLogin={handleLogin} />} 
        />

        {/* Группа редактора */}
        <Route path="/editor" element={<EditorLayout />}>
          <Route index element={<Navigate to="books" replace />} />
          
          {/* 1. Список книг */}
          <Route path="books" element={<MyBooks user={user} />} />
          
          {/* 2. Создание (БЕЗ слэша в начале и БЕЗ дублей) */}
          <Route path="books/new" element={<BookForm user={user} />} />
          
          {/* 3. Редактирование (БЕЗ слэша в начале) */}
          <Route path="books/:id/edit" element={<BookForm user={user} />} />
          
          <Route 
            path="profile" 
            element={<Profile user={user} onLogout={handleLogout} />} 
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;