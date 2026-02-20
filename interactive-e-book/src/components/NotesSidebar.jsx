import { useState, useEffect } from "react"

function NotesSidebar({ highlights = [], onUpdateNote }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [localNotes, setLocalNotes] = useState([])

  // создаём локальную копию заметок
  useEffect(() => {
    setLocalNotes(highlights)
  }, [highlights])

  // показываем только заметки с текстом комментария
  const notes = localNotes.filter((h) => h.note?.trim())

  const scrollToHighlight = (id) => {
    const el = document.getElementById(`highlight-${id}`)
    if (!el) return

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  const startEditing = (highlight) => {
    setEditingId(highlight.id)
    setDraft(highlight.note || "")
  }

  const saveNote = (id) => {
    // обновляем локально
    setLocalNotes((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, note: draft } : h
      )
    )

    // отправляем родителю только после сохранения
    onUpdateNote(id, draft)

    setEditingId(null)
    setDraft("")
  }

  return (
    <aside className="notes-sidebar">
      <h3>Заметки</h3>

      {notes.length === 0 ? (
        <p>Здесь будут заметки</p>
      ) : (
        notes.map((h) => (
          <div key={h.id} className="note-item">
            {/* выделенный текст */}
            <div
              className={`note-text highlight ${h.color}`}
              onClick={() => scrollToHighlight(h.id)}
              style={{
                cursor: "pointer",
                fontStyle: "italic",
                padding: "2px 4px",
                borderRadius: "4px",
                display: "inline-block",
              }}
            >
            
              “{h.text}”
            </div>

            {editingId === h.id ? (
              <>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />

                <button onClick={() => saveNote(h.id)}>
                  сохранить
                </button>
              </>
            ) : (
              <>
                <p>{h.note}</p>

                <button onClick={() => startEditing(h)}>
                  редактировать
                </button>
              </>
            )}
          </div>
        ))
      )}
    </aside>
  )
}

export default NotesSidebar
