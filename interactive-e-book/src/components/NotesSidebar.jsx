import { useState } from "react"

function NotesSidebar({
  highlights = [],
  onUpdateNote,
  onRemoveHighlight,
}) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [expandedId, setExpandedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("") 

  // Берем заметки напрямую из пропсов, чтобы исключить лишние зацикливания стейтов
  const allNotes = highlights.filter((h) => h.note?.trim())

  // Фильтрация заметок по поисковому запросу
  const filteredNotes = allNotes.filter((h) => {
    const query = searchQuery.toLowerCase()
    return (
      h.note.toLowerCase().includes(query) || 
      h.text.toLowerCase().includes(query)
    )
  })

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
    // Вызываем тяжелое обновление только по клику на кнопку "Сохранить"!
    onUpdateNote(id, draft)
    setEditingId(null)
    setDraft("")
  }

  const deleteNote = (id) => {
    const confirmDelete = window.confirm("Удалить заметку и выделение?")
    if (!confirmDelete) return
    if (editingId === id) { setEditingId(null); setDraft(""); }
    if (expandedId === id) { setExpandedId(null); }
    onRemoveHighlight(id)
  }

  return (
    <aside className="notes-sidebar">
      <h3 className="note-title">Заметки</h3>

      {/* Поле поиска */}
      <div className="notes-search-container">
        <input
          type="text"
          className="notes-search-input"
          placeholder="Поиск в заметках..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {allNotes.length === 0 ? (
        <p>Здесь будут заметки</p>
      ) : filteredNotes.length === 0 ? (
        <p className="no-notes-msg">Ничего не найдено</p>
      ) : (
        filteredNotes.map((h) => (
          <div key={h.id} className="note-item">
            <div
              className={`note-text highlight ${h.color} ${
                expandedId === h.id ? "" : "clamped-text"
              }`}
              onClick={() => {
                setExpandedId(expandedId === h.id ? null : h.id)
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
                  style={{ width: "100%", minHeight: "60px", marginTop: "8px" }}
                />
                <div className="note-actions">
                  <button className="note-btn" onClick={() => saveNote(h.id)}>
                    Сохранить
                  </button>
                  <button className="note-btn" onClick={cancelEditing}>
                    Отмена
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>{h.note}</p>
                <button className="note-btn" onClick={() => startEditing(h)}>
                  Изменить
                </button>
                <button className="note-btn" onClick={() => scrollToHighlight(h.id)}>
                  Найти в тексте
                </button>
                <button className="note-btn" onClick={() => deleteNote(h.id)}>
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