import { useState } from "react"

function NotesSidebar({ highlights = [], onUpdateNote }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")

  const notes = highlights.filter((h) => h.note || h.text)

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
    onUpdateNote(id, draft)
    setEditingId(null)
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
              className="note-text"
              onClick={() => scrollToHighlight(h.id)}
              style={{ cursor: "pointer", fontStyle: "italic" }}
            >
              “{h.text}”
            </div>

            {/* редактирование */}
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
                <p>{h.note || "Без заметки"}</p>

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

