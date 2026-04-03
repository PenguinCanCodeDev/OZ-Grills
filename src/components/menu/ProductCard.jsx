import React from 'react'

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

const ProductCard = ({ item, quantity, onIncrement, onDecrement }) => {
  return (
    <article className="card">
      {item.is_best_seller && (
        <div className="bestSellerBadge">Best Seller</div>
      )}
      {item.image ? (
        <div className="cardImageWrap">
          <img src={item.image} alt={item.name} className="cardImage" />
        </div>
      ) : null}
      <div className="cardTop">
        <div className="cardName">{item.name}</div>
        <div className="cardPrice">{formatNaira(item.price)}</div>
      </div>

      <div className="cardActions">
        {quantity === 0 ? (
          <button className="primary" onClick={() => onIncrement(item.id)}>
            Add to cart
          </button>
        ) : (
          <div className="qty">
            <button
              className="qtyBtn"
              onClick={() => onDecrement(item.id)}
              aria-label={`Decrease ${item.name}`}
            >
              –
            </button>
            <div className="qtyCount">{quantity}</div>
            <button
              className="qtyBtn"
              onClick={() => onIncrement(item.id)}
              aria-label={`Increase ${item.name}`}
            >
              +
            </button>
          </div>
        )}
        {quantity > 0 ? (
          <button className="ghost" onClick={() => onDecrement(item.id)}>
            Remove
          </button>
        ) : (
          <span className="muted"> </span>
        )}
      </div>
    </article>
  )
}

export default ProductCard
