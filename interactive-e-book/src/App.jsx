import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "./components/Home"
import BookLayout from "./components/BookLayout"
import EditorLayout from "./editor/EditorLayout";
import MyBooks from "./editor/MyBooks";
import BookForm from "./editor/BookForm";
import Profile from "./editor/Profile";
import LibraryPage from "./components/LibraryPage";
import ScrollToTop from "./components/ScrollToTop"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<LibraryPage />} />
        {/* встроенная книга / сборник */}
        <Route path="/book" element={<BookLayout />} />

        {/* пользовательская книга */}
        <Route path="/book/custom/:id" element={<BookLayout />} />

        <Route path="/editor" element={<EditorLayout />}>
          <Route index element={<Navigate to="books" replace />} />
          <Route path="books" element={<MyBooks />} />
          <Route path="books/new" element={<BookForm />} />
          <Route path="books/:id/edit" element={<BookForm />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App