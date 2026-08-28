'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../providers/CartProvider'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'
import { Upload } from 'lucide-react'
import { compressImage } from '../../lib/imageCompression'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentSettings, setPaymentSettings] = useState<any>(null)
  
  const [utrNumber, setUtrNumber] = useState('')
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)

  useEffect(() => {
    fetch('/api/payment-settings')
      .then(res => res.json())
      .then(data => setPaymentSettings(data))
      .catch(console.error)
  }, [])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      alert('Please log in first!')
      router.push('/login')
      return
    }

    if (items.length === 0) {
      alert('Your cart is empty!')
      return
    }

    if (!utrNumber) {
      alert('Please enter your UTR/Transaction number.')
      return
    }

    if (!screenshotFile) {
      alert('Please upload your payment screenshot.')
      return
    }

    setLoading(true)
    try {
      // 1. Upload screenshot
      const compressedFile = await compressImage(screenshotFile)
      const formData = new FormData()
      formData.append('file', compressedFile)
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadRes.ok) {
        alert('Failed to upload payment screenshot.')
        setLoading(false)
        return
      }
      
      const { url: paymentScreenshot } = await uploadRes.json()

      // 2. Submit order manually
      const res = await fetch('/api/checkout/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total, utrNumber, paymentScreenshot })
      })

      if (!res.ok) {
        alert('Failed to submit order.')
        setLoading(false)
        return
      }

      const data = await res.json()
      
      if (data.success) {
        clearCart()
        alert('Payment submitted successfully! Admin will verify and approve your order.')
        router.push('/orders')
      } else {
        alert(data.error || 'Checkout failed')
      }
    } catch (e) {
      console.error(e)
      alert('An error occurred during checkout.')
    }
    setLoading(false)
  }

  return (
    <>
      <main className={styles.main}>
        <div className={`container ${styles.checkoutContainer}`}>
          <div className={styles.left}>
            <h2>Secure Checkout</h2>
            <form className={styles.form} onSubmit={handleCheckout}>
              <div className={styles.sectionBox}>
                <h3 className={styles.sectionTitle}>1. Shipping Details</h3>
                <input type="email" placeholder="Email Address" required className={styles.input} defaultValue={session?.user?.email || ''} />
                <div className={styles.row}>
                  <input type="text" placeholder="First Name" required className={styles.input} />
                  <input type="text" placeholder="Last Name" required className={styles.input} />
                </div>
                <input type="text" placeholder="Full Delivery Address" required className={styles.input} />
                <div className={styles.row}>
                  <input type="text" placeholder="City" required className={styles.input} />
                  <input type="text" placeholder="State" required className={styles.input} />
                  <input type="text" placeholder="PIN Code" required className={styles.input} />
                </div>
                <input type="tel" placeholder="Phone Number" required className={styles.input} />
              </div>

              <div className={styles.sectionBox}>
                <h3 className={styles.sectionTitle}>2. Payment Method</h3>
                
                <div className={styles.paymentInstructions}>
                  <p>After successful payment, enter the UTR / Transaction ID below to confirm your payment.</p>
                </div>

                <div className={styles.paymentForm}>
                  <input 
                    type="text" 
                    placeholder="Enter UTR / Transaction ID (Required)" 
                    required 
                    className={styles.input}
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value)}
                  />
                  
                  <label className={styles.fileLabel}>
                    <Upload size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    Upload Payment Screenshot (Required)
                    <input 
                      type="file" 
                      accept="image/*" 
                      required
                      className={styles.fileInput}
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          setScreenshotFile(e.target.files[0])
                        }
                      }}
                    />
                  </label>
                  {screenshotFile && <p className={styles.fileName}>{screenshotFile.name}</p>}
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading || items.length === 0}>
                {loading ? 'Compressing & Uploading...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          <div className={styles.right}>
            <h2>Order Summary</h2>
            <div className={styles.summaryBox}>
              {items.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemSize}>Size: {item.size} &times; {item.quantity}</span>
                  </div>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className={styles.divider}></div>
              <div className={styles.summaryItem}>
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Shipping</span>
                <span className={styles.freeText}>FREE</span>
              </div>
              <div className={styles.divider}></div>
              <div className={`${styles.summaryItem} ${styles.total}`}>
                <span>Total to Pay</span>
                <span className={styles.totalAmount}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
