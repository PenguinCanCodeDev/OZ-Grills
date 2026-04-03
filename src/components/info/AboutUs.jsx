import React from 'react'

const AboutUs = ({ content, onClose }) => {
  return (
    <div className="overlay infoOverlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer infoDrawer">
        <div className="drawerTop">
          <div className="drawerTitle">About OZ Grillz</div>
          <button className="iconButton" onClick={onClose}>✕</button>
        </div>
        <div className="infoContent">
          {content || "Welcome to OZ Grillz! We are mastering the flame to bring you the best wood-fired grilling experience."}
        </div>
      </div>
    </div>
  )
}

export default AboutUs
