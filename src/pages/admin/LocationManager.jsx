import React, { useState, useEffect } from 'react'
import { getLocations, updateLocation, deleteLocation, createLocation } from '../../lib/api'

const LocationManager = () => {
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingLoc, setEditingLoc] = useState(null)
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await getLocations()
            setLocations(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Remove this location?')) {
            try {
                await deleteLocation(id)
                loadData()
            } catch (err) {
                console.error(err)
            }
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = {
            name: formData.get('name'),
            fee: parseFloat(formData.get('fee'))
        }
        
        try {
            if (editingLoc) {
                await updateLocation(editingLoc.id, data)
            } else {
                await createLocation(data)
            }
            setEditingLoc(null)
            setIsAdding(false)
            loadData()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div>Loading locations...</div>

    return (
        <div>
            <div className="admin-toolbar">
                <h2>Manage Delivery Areas</h2>
                <button className="primary-btn" onClick={() => setIsAdding(true)}>
                    + Add New Area
                </button>
            </div>

            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Location Name</th>
                            <th>Delivery Fee (₦)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map(loc => (
                            <tr key={loc.id}>
                                <td>{loc.name}</td>
                                <td>₦{loc.fee}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="edit-btn" onClick={() => setEditingLoc(loc)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(loc.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(editingLoc || isAdding) && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>{editingLoc ? 'Edit Area' : 'Add New Area'}</h3>
                        <form onSubmit={handleSave} className="admin-form">
                            <div className="form-group">
                                <label>Area Name</label>
                                <input name="name" defaultValue={editingLoc?.name} required />
                            </div>
                            <div className="form-group">
                                <label>Delivery Fee (₦)</label>
                                <input name="fee" type="number" defaultValue={editingLoc?.fee} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="secondary" onClick={() => { setEditingLoc(null); setIsAdding(false); }}>Cancel</button>
                                <button type="submit" className="primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LocationManager
