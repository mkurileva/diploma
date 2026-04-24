import { useState, useEffect } from "react"

function NotesSidebar({
  highlights = [],
  onUpdateNote,
  onRemoveHighlight,
}) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [localNotes, setLocalNotes] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    setLocalNotes(highlights)
  }, [highlights])

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

  const cancelEditing = () => {
    setEditingId(null)
    setDraft("")
  }

  const saveNote = (id) => {
    setLocalNotes((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, note: draft } : h
      )
    )

    onUpdateNote(id, draft)
    setEditingId(null)
    setDraft("")
  }

  const deleteNote = (id) => {
    const confirmDelete = window.confirm("Удалить заметку и выделение?")
    if (!confirmDelete) return

    setLocalNotes((prev) => prev.filter((h) => h.id !== id))

    if (editingId === id) {
      setEditingId(null)
      setDraft("")
    }

    if (expandedId === id) {
      setExpandedId(null)
    }

    onRemoveHighlight(id)
  }

  return (
    <aside className="notes-sidebar">
      <h3 className="note-title">Заметки</h3>

      {notes.length === 0 ? (
        <p>Здесь будут заметки</p>
      ) : (
        notes.map((h) => (
          <div key={h.id} className="note-item">
            <div
              className={`note-text highlight ${h.color} ${
                expandedId === h.id ? "" : "clamped-text"
              }`}
              onClick={() => {
                if (expandedId === h.id) {
                  setExpandedId(null)
                } else {
                  setExpandedId(h.id)
                }
              }}
              style={{
                cursor: "pointer",
                fontStyle: "italic",
                padding: "2px 4px",
                borderRadius: "4px",
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

                <div className="note-actions">
                  <button
                    className="note-btn"
                    onClick={() => saveNote(h.id)}
                  >
                    Сохранить
                  </button>

                  <button
                    className="note-btn"
                    onClick={cancelEditing}
                  >
                    Отмена
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{h.note}</p>

                <button
                  className="note-btn"
                  onClick={() => startEditing(h)}
                >
                  Редактировать
                </button>

                <button
                  className="note-btn"
                  onClick={() => scrollToHighlight(h.id)}
                >
                  Показать в тексте
                </button>

                <button
                  className="note-btn"
                  onClick={() => deleteNote(h.id)}
                >
                  Удалить
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