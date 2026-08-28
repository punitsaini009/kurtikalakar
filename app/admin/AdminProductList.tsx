'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function AdminProductList({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setEditPrice(product.price)
  }

  const handleSave = async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: editPrice })
      })
      
      if (res.ok) {
        const updated = await res.json()
        setProducts(products.map(p => p.id === id ? { ...p, price: updated.price } : p))
        setEditingId(null)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Collection</th>
            <th>Price (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td className={styles.idCell}>{product.id.slice(-6)}</td>
              <td>{product.name}</td>
              <td style={{textTransform: 'capitalize'}}>{product.collection}</td>
              <td>
                {editingId === product.id ? (
                  <input 
                    type="number" 
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className={styles.priceInput}
                  />
                ) : (
                  product.price.toLocaleString('en-IN')
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <div className={styles.actionBtns}>
                    <button onClick={() => handleSave(product.id)} disabled={loading} className={styles.saveBtn}>Save</button>
                    <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(product)} className={styles.editBtn}>Edit Price</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
