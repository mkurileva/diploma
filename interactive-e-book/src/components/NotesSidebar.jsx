function NotesSidebar({ highlights = [] }) {
  // берем только highlight'ы где есть текст заметки
  const notes = highlights.filter((h) => h.note && h.note.trim())

  return (
    <aside className="notes-sidebar">
      <h3>Заметки</h3>

      {notes.length === 0 ? (
        <p>Здесь будут заметки</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="note-item">
            <small>
              {note.storyId} • абзац {note.paragraphIndex + 1}
            </small>

            <p>{note.note}</p>
          </div>
        ))
      )}
    </aside>
  )
}

export default NotesSidebar
