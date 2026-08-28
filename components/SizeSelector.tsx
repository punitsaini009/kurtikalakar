'use client'

import { useState } from 'react'
import styles from './SizeSelector.module.css'

const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL']

export default function SizeSelector() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>Select Size: <strong>{selectedSize || ''}</strong></span>
        <button className={styles.sizeGuideBtn}>Size Guide</button>
      </div>
      
      <div className={styles.sizesGrid}>
        {sizes.map(size => (
          <button
            key={size}
            className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ''}`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
