import { useState } from "react"

function Paragraph({
  text,
  index,
  storyId,
  highlights,
  activeTool,
  onHighlight,
  onRemoveHighlight,
  onUpdateNote,
}) {
  const [showNoteFor, setShowNoteFor] = useState(null)

  const paragraphHighlights = highlights
    .filter(
      (h) =>
        h.storyId === storyId &&
        h.paragraphIndex === index
    )
    .sort((a, b) => a.start - b.start)

  // проверка пересечения диапазонов
  const isOverlapping = (start, end) => {
    return paragraphHighlights.some(
      (h) => !(end <= h.start || start >= h.end)
    )
  }

  // выделение текста
  const handleMouseUp = (e) => {
  if (activeTool !== "highlight") return

  const selection = window.getSelection()
  if (!selection.rangeCount) return

  const range = selection.getRangeAt(0)
  const selectedText = selection.toString().trim()
  if (!selectedText) return

  const paragraphEl = e.currentTarget

  // 🚫 если начали внутри highlight → нельзя
  if (
    range.startContainer.parentElement?.closest(".highlight") ||
    range.endContainer.parentElement?.closest(".highlight")
  ) {
    selection.removeAllRanges()
    return
  }

  // ⭐ считаем offset относительно ВСЕГО абзаца
  const preRange = range.cloneRange()
  preRange.selectNodeContents(paragraphEl)
  preRange.setEnd(range.startContainer, range.startOffset)

  const start = preRange.toString().length
  const end = start + selectedText.length

  if (start === end) return

  // 🚫 проверка пересечения
  if (isOverlapping(start, end)) {
    selection.removeAllRanges()
    return
  }

  onHighlight({
    storyId,
    paragraphIndex: index,
    start,
    end,
  })

  selection.removeAllRanges()
}


  // режем текст на куски
  const parts = []
  let lastIndex = 0

  paragraphHighlights.forEach((h) => {
    if (h.start > lastIndex) {
      parts.push(text.slice(lastIndex, h.start))
    }

    parts.push(
      <mark
        key={h.id}
        className={`highlight ${h.color}`}
        onClick={() => {
          if (activeTool === "erase") {
            onRemoveHighlight(h.id)
            return
          }
          setShowNoteFor(h.id)
        }}
      >
        {text.slice(h.start, h.end)}
        {h.note && " 📝"}
      </mark>
    )

    lastIndex = h.end
  })

  parts.push(text.slice(lastIndex))

  return (
    <>
      <p className="paragraph" onMouseUp={handleMouseUp}>
        {parts}
      </p>

      {showNoteFor && (
        <div className="note-popup">
          <textarea
            placeholder="Написать заметку..."
            value={
              paragraphHighlights.find((h) => h.id === showNoteFor)?.note || ""
            }
            onChange={(e) =>
              onUpdateNote(showNoteFor, e.target.value)
            }
          />
          <button onClick={() => setShowNoteFor(null)}>Закрыть</button>
        </div>
      )}
    </>
  )
}

export default Paragraph




