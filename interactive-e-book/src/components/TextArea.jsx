import { stories } from "../data/stories"
import Paragraph from "./Paragraph"

function TextArea({
  highlights,
  activeTool,
  onHighlight,
  onRemoveHighlight,
  onUpdateNote,
}) {
  return (
    <main className="text-area">
      {stories.map((story) => (
        <section key={story.id} id={story.id} className="story-block">
          <div className="story-layout">

              <div
                className="story-decor"
                style={{ backgroundImage: `url(${story.decor})` }}
              />

            <div className="story-content">
              <h1 className="story-title">{story.title}</h1>

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






