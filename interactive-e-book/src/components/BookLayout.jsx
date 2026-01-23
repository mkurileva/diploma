import { useState, useEffect } from "react"
import Toolbar from "./Toolbar"
import TextArea from "./TextArea"
import NotesSidebar from "./NotesSidebar"

function BookLayout() {
  const [highlights, setHighlights] = useState([])
  const [activeColor, setActiveColor] = useState("yellow")

  // загрузка
  useEffect(() => {
    const saved = localStorage.getItem("highlights")
    if (saved) setHighlights(JSON.parse(saved))
  }, [])

  // сохранение
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
        ...data,
      },
    ])
  }

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


