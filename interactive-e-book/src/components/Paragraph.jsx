import { useState } from "react";

function Paragraph({
  text,
  index,
  bookId,
  highlights,
  activeTool,
  onHighlight,
  onRemoveHighlight,
  onUpdateNote,
  showToast,
}) {
  const [showNoteFor, setShowNoteFor] = useState(null);

  const paragraphHighlights = highlights
    .filter(
      (h) =>
        h.bookId === bookId &&
        h.paragraphIndex === index
    )
    .sort((a, b) => a.start - b.start);

  const isOverlapping = (start, end) => {
    return paragraphHighlights.some(
      (h) => !(end <= h.start || start >= h.end)
    );
  };

const handleMouseUp = (e) => {
  if (activeTool !== "highlight") return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  // ВОТ ЭТОЙ СТРОЧКИ У ТЕБЯ НЕ ХВАТАЕТ:
  const range = selection.getRangeAt(0); 

  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  const paragraphEl = e.currentTarget;

  // ПРОВЕРКА на абзац (которая у тебя работает)
  if (!paragraphEl.contains(selection.anchorNode)) {
    showToast("Выделяйте текст только внутри одного абзаца", "error");
    selection.removeAllRanges();
    return;
  }
  
    if (
      range.startContainer.parentElement?.closest(".highlight") ||
      range.endContainer.parentElement?.closest(".highlight")
    ) {
      selection.removeAllRanges();
      return;
    }

    const preRange = range.cloneRange();
    preRange.selectNodeContents(paragraphEl);
    preRange.setEnd(range.startContainer, range.startOffset);

    const start = preRange.toString().length;
    const end = start + selectedText.length;

    if (start === end) return;

    if (isOverlapping(start, end)) {
      selection.removeAllRanges();
      return;
    }

    onHighlight({
      bookId,
      paragraphIndex: index,
      start,
      end,
      text: selectedText,
    });

    selection.removeAllRanges();
  };

  const parts = [];
  let lastIndex = 0;

  paragraphHighlights.forEach((h) => {
    if (h.start > lastIndex) {
      parts.push(text.slice(lastIndex, h.start));
    }

    parts.push(
      <mark
        key={h.id}
        id={`highlight-${h.id}`}
        className={`highlight ${h.color}`}
        onClick={() => {
          if (activeTool === "erase") {
            onRemoveHighlight(h.id);
            return;
          }
          setShowNoteFor(h.id);
        }}
      >
        {text.slice(h.start, h.end)}
        {h.note && " 📝"}
      </mark>
    );

    lastIndex = h.end;
  });

  parts.push(text.slice(lastIndex));

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
          <button
            className="note-btn"
            onClick={() => setShowNoteFor(null)}
          >
            Сохранить
          </button>
        </div>
      )}
    </>
  );
}

export default Paragraph;




