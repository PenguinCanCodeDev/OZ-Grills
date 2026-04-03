import React, { useState, useEffect } from 'react'
import { getMenu, getLocations } from '../../lib/api'
import { Utensils, Layers, MapPin, Zap } from 'lucide-react'

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        locations: 0,
        availableProducts: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const [menu, locations] = await Promise.all([
                getMenu(),
                getLocations()
            ])
            
            const allProducts = menu.flatMap(cat => cat.products)
            setStats({
                products: allProducts.length,
                categories: menu.length,
                locations: locations.length,
                availableProducts: allProducts.filter(p => p.is_available).length
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading dashboard...</div>

    return (
        <div className="dashboard-grid">
            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="stat-label">Total Products</div>
                        <div className="stat-value">{stats.products}</div>
                    </div>
                    <Utensils size={24} color="#f8c95c" style={{ opacity: 0.6 }} />
                </div>
                <div className="stat-footer">{stats.availableProducts} currently available</div>
            </div>
            
            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="stat-label">Categories</div>
                        <div className="stat-value">{stats.categories}</div>
                    </div>
                    <Layers size={24} color="#f8c95c" style={{ opacity: 0.6 }} />
                </div>
                <div className="stat-footer">Menu sections</div>
            </div>

            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="stat-label">Delivery Areas</div>
                        <div className="stat-value">{stats.locations}</div>
                    </div>
                    <MapPin size={24} color="#f8c95c" style={{ opacity: 0.6 }} />
                </div>
                <div className="stat-footer">Mapped locations</div>
            </div>

            <div className="stat-card highlight">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="stat-label">Quick Actions</div>
                    <Zap size={20} color="#f8c95c" />
                </div>
                <div className="action-links">
                    <button className="primary-btn" onClick={() => window.location.href = '/admin/products'}>
                        Update Menu
                    </button>
                    <button className="secondary-btn" onClick={() => window.location.href = '/admin/settings'}>
                        Shop Settings
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
