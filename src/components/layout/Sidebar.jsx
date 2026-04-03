import React from 'react'
import { X, Info, Clock, Instagram } from 'lucide-react'

const Sidebar = ({ isOpen, onClose, onAboutClick, onContactClick, instagramHandle }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`sidebarOverlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      
      {/* Sidebar Drawer */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebarHeader">
          <div className="sidebarTitle">Navigation</div>
          <button className="iconButton" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebarNav">
          <button className="navItem" onClick={() => { onAboutClick(); onClose(); }}>
            <Info size={20} className="navIcon" />
            <span className="navLabel">About OZ Grillz</span>
          </button>
          
          <button className="navItem" onClick={() => { onContactClick(); onClose(); }}>
            <Clock size={20} className="navIcon" />
            <span className="navLabel">Contact & Hours</span>
          </button>

          {instagramHandle && (
            <a 
              href={`https://instagram.com/${instagramHandle}`} 
              className="navItem" 
              target="_blank" 
              rel="noreferrer"
            >
              <Instagram size={20} className="navIcon" />
              <span className="navLabel">Follow us on Instagram</span>
            </a>
          )}
        </nav>

        <div className="sidebarFooter">
          <p>© 2026 OZ Grillz LTD.</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
