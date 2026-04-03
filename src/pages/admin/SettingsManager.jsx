import React, { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../../lib/api'

const SettingsManager = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const data = await getSettings()
            setSettings(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        
        try {
            await updateSettings(formData)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
            loadData()
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div>Loading settings...</div>

    return (
        <div style={{ maxWidth: '800px' }}>
            <div className="admin-card" style={{ padding: '40px' }}>
                <form onSubmit={handleSave} className="admin-form">
                    <section>
                        <h3 className="section-title">Shop Information</h3>
                        <div className="form-group">
                            <label>Shop Name</label>
                            <input name="name" defaultValue={settings?.name} required />
                        </div>
                        <div className="form-group">
                            <label>Tagline</label>
                            <input name="tagline" defaultValue={settings?.tagline} />
                        </div>
                        <div className="form-group">
                            <label>WhatsApp Number (International format, no +)</label>
                            <input name="whatsapp_phone" defaultValue={settings?.whatsapp_phone} required />
                        </div>
                        <div className="form-group">
                            <label>Instagram Handle (without @)</label>
                            <input name="instagram_handle" defaultValue={settings?.instagram_handle} />
                        </div>
                        <div className="form-group">
                            <label>Shop Logo</label>
                            <input type="file" name="hero_image" accept="image/*" />
                            {settings?.hero_image && (
                                <div style={{ marginTop: '10px' }}>
                                    <img src={settings?.hero_image} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                                </div>
                            )}
                            <small style={{ color: '#5c627a', marginTop: '4px', display: 'block' }}>Update the logo/main site image.</small>
                        </div>
                    </section>

                    <section style={{ marginTop: '40px' }}>
                        <h3 className="section-title">Payment Details (Bank Transfer)</h3>
                        <div className="form-group">
                            <label>Bank Name</label>
                            <input name="bank_name" defaultValue={settings?.bank_name} />
                        </div>
                        <div className="form-group">
                            <label>Account Name</label>
                            <input name="account_name" defaultValue={settings?.account_name} />
                        </div>
                        <div className="form-group">
                            <label>Account Number</label>
                            <input name="account_number" defaultValue={settings?.account_number} />
                        </div>
                    </section>

                    <section style={{ marginTop: '40px' }}>
                        <h3 className="section-title">About & Contact</h3>
                        <div className="form-group">
                            <label>About Us Text</label>
                            <textarea name="about_us" defaultValue={settings?.about_us} rows="6" className="admin-input" />
                        </div>
                        <div className="form-group">
                            <label>Contact Email</label>
                            <input name="contact_email" defaultValue={settings?.contact_email} />
                        </div>
                        <div className="form-group">
                            <label>Office Line</label>
                            <input name="office_line" defaultValue={settings?.office_line} />
                        </div>
                    </section>

                    <div className="form-actions" style={{ marginTop: '40px' }}>
                        {success && <div className="success-badge">✓ Settings saved successfully</div>}
                        <button type="submit" className="primary-btn">Save Shop Settings</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SettingsManager
