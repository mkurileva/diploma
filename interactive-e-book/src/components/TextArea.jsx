import { stories } from "../data/stories"
import Paragraph from "./Paragraph"

function TextArea({ highlights, onHighlight, onUpdateNote }) {
  return (
    <main className="text-area">
      {stories.map((story) => (
        <section key={story.id} id={story.id} className="story-block">
          <h1 className="story-title">{story.title}</h1>

          {story.text.map((p, index) => (
            <Paragraph
              key={index}
              text={p}
              index={index}
              storyId={story.id}
              highlights={highlights}
              onHighlight={onHighlight}
              onUpdateNote={onUpdateNote}
            />
          ))}
        </section>
      ))}
    </main>
  )
}

export default TextArea



