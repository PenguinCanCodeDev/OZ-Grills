import React from 'react'
import { X, Phone, Mail, Instagram } from 'lucide-react'

const ContactUs = ({ officeLine, contactEmail, instagramHandle, workingHours, onClose }) => {
  return (
    <div className="overlay infoOverlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="drawer infoDrawer">
        <div className="drawerTop">
          <div className="drawerTitle">Contact Us</div>
          <button className="iconButton" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <X size={20} />
          </button>
        </div>
        <div className="infoContent">
          <div className="contactSection">
            <h3>Get in touch</h3>
            {officeLine && (
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#f8c95c" /> Office: {officeLine}
              </p>
            )}
            {contactEmail && (
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#f8c95c" /> Email: {contactEmail}
              </p>
            )}
            {instagramHandle && (
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Instagram size={18} color="#f8c95c" /> Instagram: <a href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noreferrer">@{instagramHandle}</a>
              </p>
            )}
          </div>
          
          <div className="workingHoursSection">
            <h3>Working Hours</h3>
            <ul className="workingHoursList">
              {workingHours && workingHours.map((wh) => (
                <li key={wh.id} className={wh.is_closed ? 'closed' : ''}>
                  <strong>{wh.day_name}:</strong> {wh.is_closed ? 'Closed' : `${wh.opens_at} - ${wh.closes_at}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
