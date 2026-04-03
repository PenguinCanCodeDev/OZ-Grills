import React from 'react'

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

const OrderRecap = ({ subtotal, deliveryFee, total, orderType }) => {
  return (
    <div className="recap">
      <div className="drawerSubtitle">Order Recap</div>
      <div className="row">
        <span className="muted">Subtotal</span>
        <span className="strong">{formatNaira(subtotal)}</span>
      </div>
      
      {orderType === 'delivery' && (
        <div className="row">
          <span className="muted">Delivery fee</span>
          <span className="strong">{formatNaira(deliveryFee)}</span>
        </div>
      )}

      <div className="row totalRow">
        <span className="muted">Grand total</span>
        <span className="grand">{formatNaira(total)}</span>
      </div>
    </div>
  )
}

export default OrderRecap
