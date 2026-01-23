import { useState } from "react"
import { stories } from "../data/stories"

function Toolbar({ activeColor, onChangeColor }) {
  const [collapsed, setCollapsed] = useState(false)
  const [showContents, setShowContents] = useState(false)
  const [showColors, setShowColors] = useState(false)

  const colors = ["yellow", "pink", "green"]

  const handleScrollToStory = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setShowContents(false)
    }
  }

  return (
    <div className="toolbar-wrapper">
      <div className={`toolbar ${collapsed ? "collapsed" : ""}`}>
        {!collapsed && (
          <>
            <span>🏠</span>

            {/* МАРКЕР */}
            <span onClick={() => setShowColors(!showColors)}>🖍️</span>

            {/* ВЫБОР ЦВЕТА */}
            {showColors && (
              <div className="color-picker">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`color-btn ${color} ${
                      activeColor === color ? "active" : ""
                    }`}
                    onClick={() => {
                      onChangeColor(color)
                      setShowColors(false)
                    }}
                  />
                ))}
              </div>
            )}

            <span>📝</span>
            <span>🔍</span>

            <span onClick={() => setShowContents(!showContents)}>📑</span>
          </>
        )}

        <span
          className="collapse"
          onClick={() => {
            setCollapsed(!collapsed)
            setShowContents(false)
            setShowColors(false)
          }}
        >
          {collapsed ? "⮟" : "⮝"}
        </span>

        {showContents && !collapsed && (
          <div className="contents">
            <h4>Содержание</h4>
            <ul>
              {stories.map((story) => (
                <li
                  key={story.id}
                  onClick={() => handleScrollToStory(story.id)}
                >
                  {story.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Toolbar

