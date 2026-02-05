import { useState } from 'react'
import './App.css'

function App() {
  const [yesSize, setYesSize] = useState(1)
  const [angel , setAngel] = useState(0)
  const [showPopup, setShowPopup] = useState(false)

  const handleNoClick = () => {
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

      <img src="/img.jpg" alt="Valentine" className="center-img " />

      <div className="button-container">
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

        <button className="no-btn" onClick={handleNoClick}>
          No I don’t 😢
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <img src="/yes.jpg" alt="Yes!" className="popup-img" />
            <p className="popup-message">You made my day! see on feb/14  💖</p>
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
