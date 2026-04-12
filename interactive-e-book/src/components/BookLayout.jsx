import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Toolbar from "./Toolbar"
import TextArea from "./TextArea"
import NotesSidebar from "./NotesSidebar"
import decor from "../assets/ornament1.png"

function BookLayout() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem("highlights")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [activeColor, setActiveColor] = useState("yellow")
  const [activeTool, setActiveTool] = useState(null)
  const [customBook, setCustomBook] = useState(null)

  useEffect(() => {
    localStorage.setItem("highlights", JSON.stringify(highlights))
  }, [highlights])

  useEffect(() => {
    if (!id) {
      setCustomBook(null)
      return
    }

    const books = JSON.parse(localStorage.getItem("books") || "[]")
    const foundBook = books.find((book) => String(book.id) === String(id))

    if (!foundBook) {
      navigate("/library")
      return
    }

    setCustomBook({
      ...foundBook,
      decor: foundBook.decor || decor,
      text: Array.isArray(foundBook.text) ? foundBook.text : [],
    })
  }, [id, navigate])

  const addHighlight = (data) => {
    setHighlights((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        color: activeColor,
        note: "",
        ...data,
      },
    ])
  }

  const removeHighlight = (id) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
  }

  const updateNote = (id, note) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, note } : h))
    )
  }

  const contentsItems = customBook
    ? []
    : [
        { id: "smert-chinovnika", title: "Смерть чиновника" },
        { id: "tolstyi-i-tonkii", title: "Толстый и тонкий" },
        { id: "hameleon", title: "Хамелеон" },
        { id: "chelovek-v-futlyare", title: "Человек в футляре" },
        { id: "o-lyubvi", title: "О любви" },
      ]

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
          highlights={highlights}
          activeTool={activeTool}
          onHighlight={addHighlight}
          onRemoveHighlight={removeHighlight}
          onUpdateNote={updateNote}
        />

        <NotesSidebar
          highlights={highlights}
          onUpdateNote={updateNote}
        />
      </div>
    </>
  )
}

export default BookLayout