'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from '../../page.module.css'
import { Upload } from 'lucide-react'
import { compressImage } from '../../../../lib/imageCompression'

export default function PayAgainPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string

  const [loading, setLoading] = useState(false)
  const [paymentSettings, setPaymentSettings] = useState<any>(null)
  
  const [utrNumber, setUtrNumber] = useState('')
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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
      const res = await fetch('/api/checkout/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, utrNumber, paymentScreenshot })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        alert(errorData.error || 'Failed to submit payment retry.')
        setLoading(false)
        return
      }

      const data = await res.json()
      
      if (data.success) {
        alert('Payment retry submitted successfully! Admin will verify and approve your order.')
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

  if (status === 'loading' || !session) {
    return null;
  }

  return (
    <>
      <main className={styles.main}>
        <div className={`container ${styles.checkoutContainer}`} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className={styles.left} style={{ width: '100%' }}>
            <h2>Retry Payment for Order #{orderId.slice(-6)}</h2>
            <form className={styles.form} onSubmit={handleCheckout}>
              
              <div className={styles.sectionBox}>
                <h3 className={styles.sectionTitle}>Payment Method</h3>
                
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
                    Upload New Payment Screenshot (Required)
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

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Compressing & Uploading...' : 'Submit Payment'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
