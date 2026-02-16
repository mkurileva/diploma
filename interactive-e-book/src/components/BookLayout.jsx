import { useState, useEffect } from "react"
import Toolbar from "./Toolbar"
import TextArea from "./TextArea"
import NotesSidebar from "./NotesSidebar"

function BookLayout() {
  // загрузка сразу из localStorage
  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem("highlights")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [activeColor, setActiveColor] = useState("yellow")

  // сохранение
  useEffect(() => {
    localStorage.setItem(
      "highlights",
      JSON.stringify(highlights)
    )
  }, [highlights])

  // добавление хайлайта
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

  // обновление заметки
  const updateNote = (id, note) => {
    setHighlights((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, note } : h
      )
    )
  }

  return (
    <>
      <Toolbar
        activeColor={activeColor}
        onChangeColor={setActiveColor}
      />

      <div className="layout">
        <TextArea
          highlights={highlights}
          onHighlight={addHighlight}
          onUpdateNote={updateNote}
        />

        <NotesSidebar highlights={highlights} />
      </div>
    </>
  )
}

export default BookLayout




