import React from 'react'
import { ArrowLeft, Menu, ShoppingCart } from 'lucide-react'

const Header = ({ shopName, shopTagline, itemCount, onBack, onMenuOpen, onOpenCart, showBack }) => {
  return (
    <header className="topbar">
      <button
        className="iconButton"
        onClick={showBack ? onBack : onMenuOpen}
        aria-label={showBack ? 'Back to menu' : 'Open menu'}
      >
        {showBack ? <ArrowLeft size={20} /> : <Menu size={20} />}
      </button>
      <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
        <img src="/oz_grill_logo.jpg" alt={shopName} className="headerLogo" />
        <div className="brandText">
          <div className="brandName">{shopName}</div>
          <div className="brandTagline">{shopTagline}</div>
        </div>
      </div>
      <button
        className="iconButton"
        onClick={onOpenCart}
        aria-label="Open cart"
      >
        <ShoppingCart size={20} />
        {itemCount > 0 ? <span className="pill">{itemCount}</span> : null}
      </button>
    </header>
  )
}

export default Header
