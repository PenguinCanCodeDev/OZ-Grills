import React from 'react'
import OrderRecap from '../checkout/OrderRecap'
import LogisticsForm from '../checkout/LogisticsForm'

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

const CartDrawer = ({ 
  cartItems, 
  onClose, 
  onIncrement, 
  onDecrement, 
  onClear, 
  onGoToPayment,
  orderType, 
  onOrderTypeChange, 
  address, 
  onAddressChange,
  locations,
  selectedLocationId,
  onLocationChange,
  orderNotes,
  onOrderNotesChange,
  subtotal,
  deliveryFee,
  total
}) => {
  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="drawer">
        <div className="drawerTop">
          <div className="drawerTitle">Your Selection</div>
          <button className="iconButton" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty">Your cart is empty. Add something tasty!</div>
        ) : (
          <>
            <div className="cartList">
              {cartItems.map((item) => (
                <div key={item.id} className="cartItem">
                  <div className="cartItemMain">
                    <div className="cartItemName">{item.name}</div>
                    <div className="cartItemSub">{formatNaira(item.price)} each</div>
                  </div>
                  <div className="cartItemRight">
                    <div className="qty compact">
                      <button className="qtyBtn" onClick={() => onDecrement(item.id)}>−</button>
                      <div className="qtyCount">{item.quantity}</div>
                      <button className="qtyBtn" onClick={() => onIncrement(item.id)}>+</button>
                    </div>
                    <button className="ghost" onClick={() => onDecrement(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <LogisticsForm 
              orderType={orderType}
              onOrderTypeChange={onOrderTypeChange}
              address={address}
              onAddressChange={onAddressChange}
              locations={locations}
              selectedLocationId={selectedLocationId}
              onLocationChange={onLocationChange}
              orderNotes={orderNotes}
              onOrderNotesChange={onOrderNotesChange}
            />

            <OrderRecap 
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              orderType={orderType}
            />

            <div className="drawerActions">
              <button className="ghost" onClick={onClear}>Clear cart</button>
              <button
                className="primary"
                onClick={onGoToPayment}
                disabled={orderType === 'delivery' && (!address.trim() || !selectedLocationId)}
              >
                Proceed to payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
