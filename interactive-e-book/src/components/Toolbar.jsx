import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  contentsItems = [],
}) {
  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false)
  const [showContents, setShowContents] = useState(false)
  const [showColors, setShowColors] = useState(false)

  const colors = ["yellow", "pink", "green"]
  const hasContents = contentsItems.length > 1

  const handleScrollToStory = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setShowContents(false)
    }
  }

  useEffect(() => {
    document.body.classList.remove("cursor-highlight", "cursor-erase")

    if (activeTool === "highlight") {
      document.body.classList.add("cursor-highlight")
    } else if (activeTool === "erase") {
      document.body.classList.add("cursor-erase")
    }

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
                onChangeTool(activeTool === "highlight" ? null : "highlight")
                setShowColors(activeTool !== "highlight")
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

            {/* Цвета */}
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

            {/* СОДЕРЖАНИЕ — только если разделов больше одного */}
            {hasContents && (
              <span onClick={() => setShowContents(!showContents)}>
                <img src={bookIcon} alt="contents" className="toolbar-icon" />
              </span>
            )}
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

        {showContents && !collapsed && hasContents && (
          <div className="contents">
            <h4>Содержание</h4>
            <ul>
              {contentsItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleScrollToStory(item.id)}
                >
                  {item.title}
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