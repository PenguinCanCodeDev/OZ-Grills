import React from 'react'
import ProductCard from './ProductCard'

const CategorySection = ({ category, products, cartById, onIncrement, onDecrement }) => {
  if (!products || products.length === 0) return null

  return (
    <section className="category" id={`cat-${category}`}>
      <div className="categoryHeader">
        <h2>{category}</h2>
      </div>
      <div className="grid">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            quantity={cartById.get(item.id) ?? 0}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        ))}
      </div>
    </section>
  )
}

export default CategorySection
