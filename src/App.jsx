import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

const NO_BTN_AVOID_DISTANCE = 250
const NO_BTN_SIZE = { w: 140, h: 48 }

function App() {
  const [yesSize, setYesSize] = useState(1)
  const [angel, setAngel] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [noPopupDismissed, setNoPopupDismissed] = useState(false)
  const [noPosition, setNoPosition] = useState({ left: 160, top: 195 })
  const [moveCount, setMoveCount] = useState(0)
  const buttonContainerRef = useRef(null)
  const noButtonRef = useRef(null)

  // Keep No button inside container when window is resized
  useEffect(() => {
    const container = buttonContainerRef.current
    if (!container) return
    const clampPosition = () => {
      const rect = container.getBoundingClientRect()
      const maxLeft = Math.max(0, rect.width - NO_BTN_SIZE.w)
      const maxTop = Math.max(0, rect.height - NO_BTN_SIZE.h)
      setNoPosition((pos) => ({
        left: Math.max(0, Math.min(pos.left, maxLeft)),
        top: Math.max(0, Math.min(pos.top, maxTop)),
      }))
    }
    const observer = new ResizeObserver(clampPosition)
    observer.observe(container)
    clampPosition()
    return () => observer.disconnect()
  }, [])

  const moveNoButton = useCallback((e) => {
    const container = buttonContainerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const maxLeft = Math.max(0, rect.width - NO_BTN_SIZE.w)
    const maxTop = Math.max(0, rect.height - NO_BTN_SIZE.h)
    // Use smaller avoid distance on narrow screens so a valid spot exists
    const avoidDist = Math.min(NO_BTN_AVOID_DISTANCE, Math.min(rect.width, rect.height) * 0.4)
    let left, top
    for (let i = 0; i < 30; i++) {
      left = Math.random() * maxLeft
      top = Math.random() * maxTop
      const btnCenterX = left + NO_BTN_SIZE.w / 2
      const btnCenterY = top + NO_BTN_SIZE.h / 2
      const dist = Math.hypot(btnCenterX - mouseX, btnCenterY - mouseY)
      if (dist >= avoidDist) break
    }
    setNoPosition({ left, top })
    setMoveCount((c) => c + 1)
  }, [])

  const handleNoClick = (e) => {
    moveNoButton(e)
    setYesSize((prev) => prev + 0.2)
    setAngel((prev) => !prev)
  }

  const handleYesClick = () => {
    setShowPopup(true)
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Would you like to be my valentine? 💌</h1>
      </header>

      <img src="/img.webp" alt="Valentine" className="center-img " />

      <div ref={buttonContainerRef} className="button-container">
        <button
          className={`yes-btn clicked happy`}
          onClick={handleYesClick}
          style={{
            transform: `scale(${yesSize}) rotate(${
              angel === 0 ? "" : angel % 2 === 0 ? '15deg' : '-15deg'
            })`,
            boxShadow: angel
              ? "0 0 30px 8px rgb(255 0 153 / 60%), 0 0 60px 18px rgb(255 192 203 / 45%)"
              : ""
          }}
        >
          Yes I doooooo 💖
        </button>

        <button
          ref={noButtonRef}
          className="no-btn"
          onClick={handleNoClick}
          onMouseEnter={moveNoButton}
          style={{
            position: 'absolute',
            left: noPosition.left,
            top: noPosition.top,
          }}
        >
          No I don’t 😢
        </button>
        {/* {moveCount > 0 && (
          <span className="no-move-count">Moved {moveCount} time{moveCount !== 1 ? 's' : ''}</span>
        )} */}
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <img src="/yes.webp" alt="Yes!" className="popup-img" />
            <p className="popup-message">You made my day! see on feb/14  💖</p>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {moveCount >= 8 && !noPopupDismissed && (
        <div className="popup-overlay" onClick={() => setNoPopupDismissed(true)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <img src="/no%20img.webp" alt="Maybe next time" className="popup-img" />
            <p className="popup-message">what do you mean nooooooo?</p>
            <button className="close-btn" onClick={() => { setMoveCount(0)}}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
