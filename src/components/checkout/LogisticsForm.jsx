import React from 'react'

const LogisticsForm = ({ 
  orderType, 
  onOrderTypeChange, 
  address, 
  onAddressChange, 
  locations, 
  selectedLocationId, 
  onLocationChange,
  orderNotes,
  onOrderNotesChange
}) => {
  return (
    <div className="logistics">
      <div className="drawerSubtitle">Delivery Logistics</div>
      
      <div className="orderTypeToggle">
        <button 
          className={orderType === 'delivery' ? 'active' : ''} 
          onClick={() => onOrderTypeChange('delivery')}
        >
          Delivery
        </button>
        <button 
          className={orderType === 'pickup' ? 'active' : ''} 
          onClick={() => onOrderTypeChange('pickup')}
        >
          Pickup
        </button>
      </div>

      {orderType === 'delivery' ? (
        <>
          <label className="field">
            <span className="fieldLabel">Delivery Area (Select one)</span>
            <select 
              className="input select" 
              value={selectedLocationId} 
              onChange={(e) => onLocationChange(e.target.value)}
              required
            >
              <option value="">Select your location...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} (+₦{loc.fee})
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="fieldLabel">Exact Delivery Address</span>
            <input
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="House number, street, landmark…"
              className="input"
              required
            />
          </label>
        </>
      ) : (
        <div className="pickupInfo">
          <p>Please come to our office for pickup. Your order will be ready in 20-30 minutes.</p>
        </div>
      )}

      <label className="field">
        <span className="fieldLabel">Order Notes / Preferences (Optional)</span>
        <textarea
          value={orderNotes}
          onChange={(e) => onOrderNotesChange(e.target.value)}
          placeholder="e.g. No sausages, extra spice, etc."
          className="input textarea"
          rows="3"
        />
      </label>
    </div>
  )
}

export default LogisticsForm
