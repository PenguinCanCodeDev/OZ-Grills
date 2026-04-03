import React, { useState, useEffect } from 'react'
import { getMenu, updateProduct, deleteProduct, getCategories, createProduct } from '../../lib/api'

const ProductManager = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState(null)
    const [isAdding, setIsAdding] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [menuData, catData] = await Promise.all([getMenu(), getCategories()])
            const allProducts = menuData.flatMap(cat => cat.products)
            setProducts(allProducts)
            setCategories(catData)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleAvailability = async (product) => {
        try {
            await updateProduct(product.id, { ...product, is_available: !product.is_available })
            loadData()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id)
                loadData()
            } catch (err) {
                console.error(err)
            }
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        
        // Fix boolean values for checkboxes
        formData.set('is_best_seller', e.target.is_best_seller.checked)
        if (editingProduct) {
            formData.append('is_available', editingProduct.is_available)
        } else {
            formData.append('is_available', true)
        }

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData)
            } else {
                await createProduct(formData)
            }
            setEditingProduct(null)
            setIsAdding(false)
            setImagePreview(null)
            loadData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImagePreview(URL.createObjectURL(file))
        }
    }
    

    if (loading) return <div>Loading products...</div>

    return (
        <div>
            <div className="admin-toolbar">
                <h2>Manage Menu</h2>
                <button className="primary-btn" onClick={() => setIsAdding(true)}>
                    + Add New Product
                </button>
            </div>

            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={product.image || '/placeholder.jpg'} style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                                        <div>
                                            <strong>{product.name}</strong>
                                            {product.is_best_seller && <span className="admin-badge">Best Seller</span>}
                                        </div>
                                    </div>
                                </td>
                                <td>{product.category_name}</td>
                                <td>₦{product.price}</td>
                                <td>
                                    <button 
                                        className={`status-chip ${product.is_available ? 'active' : 'inactive'}`}
                                        onClick={() => handleToggleAvailability(product)}
                                    >
                                        {product.is_available ? 'Available' : 'Out of Stock'}
                                    </button>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="edit-btn" onClick={() => setEditingProduct(product)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(editingProduct || isAdding) && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleSave} className="admin-form">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input name="name" defaultValue={editingProduct?.name} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" defaultValue={editingProduct?.category} required>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price (₦)</label>
                                <input name="price" type="number" defaultValue={editingProduct?.price} required />
                            </div>
                            <div className="form-group checkbox">
                                <label>
                                    <input type="checkbox" name="is_best_seller" defaultChecked={editingProduct?.is_best_seller} />
                                    Mark as Best Seller
                                </label>
                            </div>
                            <div className="form-group">
                                <label>Product Image</label>
                                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                                {(imagePreview || editingProduct?.image) && (
                                    <div className="image-preview">
                                        <img src={imagePreview || editingProduct?.image} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginTop: '10px' }} />
                                    </div>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="secondary" onClick={() => { setEditingProduct(null); setIsAdding(false); setImagePreview(null); }}>Cancel</button>
                                <button type="submit" className="primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductManager
