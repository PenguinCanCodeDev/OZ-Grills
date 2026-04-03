import React, { useEffect, useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Utensils, MapPin, Settings, LogOut, Menu, X } from 'lucide-react'
import './Admin.css'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState(localStorage.getItem('oz_admin_token'))
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
    }
  }, [token, navigate])

  const handleLogout = () => {
    localStorage.removeItem('oz_admin_token')
    setToken(null)
    navigate('/admin/login')
  }

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  if (!token) return null

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <div className="admin-container">
      <div 
        className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1 }}>
            <img src="/oz_grill_logo.jpg" alt="OZ Grill" />
            <span>OZ Admin</span>
          </div>
          <button 
            className="admin-menu-toggle" 
            style={{ display: 'flex' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-item ${isActive('/admin')}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link to="/admin/products" className={`admin-nav-item ${isActive('/admin/products')}`}>
            <Utensils size={18} />
            Products
          </Link>
          <Link to="/admin/locations" className={`admin-nav-item ${isActive('/admin/locations')}`}>
            <MapPin size={18} />
            Locations
          </Link>
          <Link to="/admin/settings" className={`admin-nav-item ${isActive('/admin/settings')}`}>
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1>{location.pathname.split('/').pop() || 'Dashboard'}</h1>
          </div>
          <div className="admin-user" style={{ fontSize: '14px', color: '#9499ad' }}>Admin User</div>
        </header>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
