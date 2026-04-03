import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../lib/api'
import './Admin.css'

const AdminLogin = () => {
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('oz_admin_token')) {
            navigate('/admin')
        }
    }, [navigate])

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const data = await loginAdmin(credentials)
            localStorage.setItem('oz_admin_token', data.key)
            navigate('/admin')
        } catch (err) {
            setError('Invalid username or password')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo">
                    <img src="/oz_grill_logo.jpg" alt="OZ Grill" />
                </div>
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <button type="button" className="secondary" onClick={() => navigate('/')}>
                        Back to Shop
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
