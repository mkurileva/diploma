import { useState, useEffect } from "react"
import Toolbar from "./Toolbar"
import TextArea from "./TextArea"
import NotesSidebar from "./NotesSidebar"

function BookLayout({ onGoHome }) {
  const [highlights, setHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem("highlights")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [activeColor, setActiveColor] = useState("yellow")
  const [activeTool, setActiveTool] = useState(null) // ⭐ новый state

  useEffect(() => {
    localStorage.setItem("highlights", JSON.stringify(highlights))
  }, [highlights])

const addHighlight = (data) => {
  setHighlights((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      color: activeColor,
      note: "",
      ...data, // тут должны быть start, end, text, storyId, paragraphIndex
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
        onGoHome={onGoHome}
      />

      <div className="layout">
        <TextArea
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
