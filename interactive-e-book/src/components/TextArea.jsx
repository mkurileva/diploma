import { stories } from "../data/stories"
import Paragraph from "./Paragraph"

function TextArea({
  highlights,
  activeTool,
  onHighlight,
  onRemoveHighlight,
  onUpdateNote,
  customBook = null,
}) {
  const contentToRender = customBook
    ? [
        {
          id: customBook.id,
          title: customBook.title,
          author: customBook.author,
          text: customBook.text,
          decor: customBook.decor,
        },
      ]
    : stories

  return (
    <main className="text-area">
      {contentToRender.map((story) => (
        <section key={story.id} id={story.id} className="story-block">
          <div className="story-layout">
            <div
              className="story-decor"
              style={
                story.decor
                  ? { backgroundImage: `url(${story.decor})` }
                  : undefined
              }
            />

            <div className="story-content">
              <h1 className="story-title">{story.title}</h1>

              {story.author && (
                <p className="story-author">{story.author}</p>
              )}

              {story.text.map((paragraph, index) => (
                <Paragraph
                  key={index}
                  text={paragraph}
                  index={index}
                  storyId={story.id}
                  highlights={highlights}
                  activeTool={activeTool}
                  onHighlight={onHighlight}
                  onRemoveHighlight={onRemoveHighlight}
                  onUpdateNote={onUpdateNote}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  )
}

export default TextArea



