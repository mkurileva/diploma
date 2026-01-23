import { useState } from "react"

function Paragraph({
  text,
  index,
  storyId,
  highlights,
  onHighlight,
  onUpdateNote
}) {
  const [activeNoteId, setActiveNoteId] = useState(null)

  const handleMouseUp = () => {
    const selection = window.getSelection()
    const selectedText = selection.toString()

    if (!selectedText) return

    onHighlight({
      storyId,
      paragraphIndex: index,
      text: selectedText,
    })

    selection.removeAllRanges()
  }

  let renderedText = text

  highlights
    .filter(
      (h) =>
        h.storyId === storyId &&
        h.paragraphIndex === index
    )
    .forEach((h) => {
      renderedText = renderedText.replace(
        h.text,
        `<mark class="highlight ${h.color}">
          ${h.text}
          <span class="note-icon" data-id="${h.id}">📝</span>
        </mark>`
      )
    })

  const handleClick = (e) => {
    if (e.target.classList.contains("note-icon")) {
      setActiveNoteId(e.target.dataset.id)
    }
  }

  const activeHighlight = highlights.find(h => h.id === activeNoteId)

  return (
    <>
      <p
        className="paragraph"
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: renderedText }}
      />

      {activeHighlight && (
        <div className="note-popup">
          <textarea
            placeholder="Введите заметку…"
            value={activeHighlight.note}
            onChange={(e) =>
              onUpdateNote(activeHighlight.id, e.target.value)
            }
          />
          <button onClick={() => setActiveNoteId(null)}>
            Готово
          </button>
        </div>
      )}
    </>
  )
}

export default Paragraph






