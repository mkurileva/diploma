import { useState, useEffect } from "react"
import Toolbar from "./Toolbar"
import TextArea from "./TextArea"
import NotesSidebar from "./NotesSidebar"

function BookLayout() {
  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem("highlights")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [activeColor, setActiveColor] = useState("yellow")
  const [activeTool, setActiveTool] = useState("highlight") // ⭐ новый state

  useEffect(() => {
    localStorage.setItem("highlights", JSON.stringify(highlights))
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

  // удаление хайлайта (ластик)
  const removeHighlight = (id) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
  }

  // обновление заметки
  const updateNote = (id, note) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, note } : h))
    )
  }

  return (
    <>
      <Toolbar
        activeColor={activeColor}
        onChangeColor={setActiveColor}
        activeTool={activeTool}
        onChangeTool={setActiveTool}
      />

      <div className="layout">
        <TextArea
          highlights={highlights}
          activeTool={activeTool}
          onHighlight={addHighlight}
          onRemoveHighlight={removeHighlight}
          onUpdateNote={updateNote}
        />

        <NotesSidebar />
      </div>
    </>
  )
}

export default BookLayout
