import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import homeIcon from "../assets/icons/home1.png"
import markerIcon from "../assets/icons/pen1.png"
import eraserIcon from "../assets/icons/eraser1.png"
import bookIcon from "../assets/icons/contents1.png"
import libraryIcon from "../assets/icons/library1.png"
import profileIcon from "../assets/icons/profile1.png"

function Toolbar({
  activeColor,
  onChangeColor,
  activeTool,
  onChangeTool,
  contentsItems = [],
  isLoggedIn,   
  onAuthClick,   
  isMobile, // Принимаем флаг мобильной версии
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

    if (activeTool === "highlight" && !isMobile) {
      document.body.classList.add("cursor-highlight")
    } else if (activeTool === "erase" && !isMobile) {
      document.body.classList.add("cursor-erase")
    }

    return () => {
      document.body.classList.remove("cursor-highlight", "cursor-erase")
    }
  }, [activeTool, isMobile])

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/editor/profile");
    } else {
      onAuthClick();
    }
  }

  return (
    <div className="toolbar-wrapper">
      <div className={`toolbar ${collapsed ? "collapsed" : ""} ${isMobile ? "mobile-toolbar" : ""}`}>
        
        {isMobile ? (
          /* МОБИЛЬНЫЙ РЕЖИМ: Только три основные кнопки навигации */
          <>
            <span onClick={() => navigate("/")} title="На главную">
              <img src={homeIcon} alt="home" className="toolbar-icon" />
            </span>

            <span onClick={() => navigate("/library")} title="В библиотеку">
              <img src={libraryIcon} alt="library" className="toolbar-icon" />
            </span>

            <span onClick={handleProfileClick} title="Личный кабинет">
              <img src={profileIcon} alt="profile" className="toolbar-icon" />
            </span>
          </>
        ) : (
          /* ДЕСКТОПНЫЙ РЕЖИМ: Весь инструмент для работы с текстом */
          <>
            <span onClick={() => navigate("/")} title="На главную">
              <img src={homeIcon} alt="home" className="toolbar-icon" />
            </span>

            <span onClick={() => navigate("/library")} title="В библиотеку">
              <img src={libraryIcon} alt="library" className="toolbar-icon" />
            </span>

            <span onClick={handleProfileClick} title="Личный кабинет">
              <img src={profileIcon} alt="profile" className="toolbar-icon" />
            </span>

            <div className="toolbar-separator" style={{ width: "1px", height: "24px", backgroundColor: "#ccc", margin: "0 8px" }} />

            <span
              className={activeTool === "highlight" ? "active-tool" : ""}
              onClick={() => {
                onChangeTool(activeTool === "highlight" ? null : "highlight")
                setShowColors(activeTool !== "highlight")
              }}
              title="Маркер"
            >
              <img src={markerIcon} alt="highlight" className="toolbar-icon" />
            </span>

            <span
              className={activeTool === "erase" ? "active-tool" : ""}
              onClick={() => {
                onChangeTool(activeTool === "erase" ? null : "erase")
                setShowColors(false)
              }}
              title="Ластик"
            >
              <img src={eraserIcon} alt="eraser" className="toolbar-icon" />
            </span>

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

            {hasContents && (
              <span onClick={() => setShowContents(!showContents)}>
                <img src={bookIcon} alt="contents" className="toolbar-icon" />
              </span>
            )}
          </>
        )}

        {/* Стрелочку сворачивания выводим только на ПК */}
        {!isMobile && (
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
        )}

        {showContents && !collapsed && hasContents && !isMobile && (
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