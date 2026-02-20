import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import BookLayout from "./components/BookLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App