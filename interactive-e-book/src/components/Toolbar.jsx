import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { stories } from "../data/stories"
import homeIcon from "../assets/icons/home1.png"
import markerIcon from "../assets/icons/pen1.png"
import eraserIcon from "../assets/icons/eraser1.png"
import glassIcon from "../assets/icons/glass.svg"
import bookIcon from "../assets/icons/contents1.png"
import noteIcon from "../assets/icons/note.svg"

function Toolbar({
  activeColor,
  onChangeColor,
  activeTool,
  onChangeTool,
}) {
  const navigate = useNavigate()

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

    useEffect(() => {
      // убираем классы при монтировании (на всякий случай)
      document.body.classList.remove("cursor-highlight", "cursor-erase")

      // добавляем нужный курсор при смене activeTool
      if (activeTool === "highlight") {
        document.body.classList.add("cursor-highlight")
      } else if (activeTool === "erase") {
        document.body.classList.add("cursor-erase")
      }

      // очистка при размонтировании компонента (уход со страницы)
      return () => {
        document.body.classList.remove("cursor-highlight", "cursor-erase")
      }
    }, [activeTool])

  return (
    <div className="toolbar-wrapper">
      <div className={`toolbar ${collapsed ? "collapsed" : ""}`}>
        {!collapsed && (
          <>
            {/* HOME */}
            <span onClick={() => navigate("/")}>
              <img src={homeIcon} alt="home" className="toolbar-icon" />
            </span>

            {/* МАРКЕР */}
            <span
              className={activeTool === "highlight" ? "active-tool" : ""}
              onClick={() => {
                // Если уже активен highlight — выключаем
                onChangeTool(activeTool === "highlight" ? null : "highlight")
                setShowColors(activeTool !== "highlight") // показываем цвета только если включаем
              }}
            >
              <img src={markerIcon} alt="highlight" className="toolbar-icon" />
            </span>

            {/* ЛАСТИК */}
            <span
              className={activeTool === "erase" ? "active-tool" : ""}
              onClick={() => {
                onChangeTool(activeTool === "erase" ? null : "erase")
                setShowColors(false)
              }}
            >
              <img src={eraserIcon} alt="eraser" className="toolbar-icon" />
            </span>

            {/* выбор цвета */}
            {showColors && activeTool === "highlight" && (
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
{/* 
            <span><img src={noteIcon} alt="home" className="toolbar-icon" /></span>
            <span><img src={glassIcon} alt="home" className="toolbar-icon" /></span> */}

            <span onClick={() => setShowContents(!showContents)}>
              <img src={bookIcon} alt="home" className="toolbar-icon" />
            </span>
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
