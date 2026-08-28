'use client'

import { useState } from 'react'
import styles from './products.module.css'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'

export default function AdminProductManager({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const handleEdit = (product: any) => {
    let parsedImages = product.images;
    if (typeof parsedImages === 'string') {
      try { parsedImages = JSON.parse(parsedImages); } catch (e) { parsedImages = parsedImages.split(','); }
    }
    if (!Array.isArray(parsedImages)) parsedImages = [parsedImages];
    parsedImages = parsedImages.map((img: string) => typeof img === 'string' ? img.replace(/[\[\]"\\]/g, '').trim() : img).filter(Boolean);

    setFormData({...product, images: parsedImages})
    setEditingProduct(product.id)
    setShowModal(true)
  }

  const handleAddNew = () => {
    setFormData({
      name: '', description: '', price: 0, originalPrice: 0, discountPercent: 0,
      sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'], images: [], collection: 'new-arrivals', stock: 10,
      isFeatured: false, isBestSeller: false, isTrending: false, isLuxury: false, isChikankari: false, isFestive: false
    })
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const isNew = !editingProduct
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${editingProduct}`
      const method = isNew ? 'POST' : 'PATCH'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const saved = await res.json()
        if (isNew) {
          setProducts([saved, ...products])
        } else {
          setProducts(products.map(p => p.id === saved.id ? saved : p))
        }
        setShowModal(false)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleFlagToggle = (flag: string) => {
    setFormData({ ...formData, [flag]: !formData[flag] })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Product Management</h2>
        <button onClick={handleAddNew} className={styles.addBtn}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>
                  <br/>
                  <small className={styles.textGray}>{p.collection}</small>
                </td>
                <td>₹{p.price.toLocaleString('en-IN')}</td>
                <td>{p.stock}</td>
                <td>
                  <div className={styles.flags}>
                    {p.isFeatured && <span className={styles.flag}>Featured</span>}
                    {p.isBestSeller && <span className={styles.flag}>Best Seller</span>}
                    {p.isTrending && <span className={styles.flag}>Trending</span>}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button onClick={() => handleEdit(p)} className={styles.iconBtn}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className={`${styles.iconBtn} ${styles.danger}`}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Collection</label>
                  <input required type="text" value={formData.collection || ''} onChange={e => setFormData({...formData, collection: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Price (₹)</label>
                  <input required type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Original Price (₹)</label>
                  <input type="number" value={formData.originalPrice || ''} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock</label>
                  <input required type="number" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Image URLs (comma separated)</label>
                  <input type="text" value={Array.isArray(formData.images) ? formData.images.join(',') : formData.images} onChange={e => setFormData({...formData, images: e.target.value.split(',')})} />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className={styles.flagsGrid}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={formData.isFeatured || false} onChange={() => handleFlagToggle('isFeatured')} />
                  Featured
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={formData.isBestSeller || false} onChange={() => handleFlagToggle('isBestSeller')} />
                  Best Seller
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={formData.isTrending || false} onChange={() => handleFlagToggle('isTrending')} />
                  Trending
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={formData.isLuxury || false} onChange={() => handleFlagToggle('isLuxury')} />
                  Luxury
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={formData.isChikankari || false} onChange={() => handleFlagToggle('isChikankari')} />
                  Chikankari
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={formData.isFestive || false} onChange={() => handleFlagToggle('isFestive')} />
                  Festive
                </label>
              </div>

              <div className={styles.formFooter}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.btnSecondary}>Cancel</button>
                <button type="submit" disabled={loading} className={styles.btnPrimary}>
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
