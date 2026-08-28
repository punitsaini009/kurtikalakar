'use client'

import { useState } from 'react'
import styles from '../settings/settings.module.css'
import { Upload, CheckCircle } from 'lucide-react'

import Image from 'next/image'

export default function QRClient({ initialUrl }: { initialUrl: string }) {
  const [qrUrl, setQrUrl] = useState(initialUrl)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setLoading(true)
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const { url } = await res.json()
        setQrUrl(url)
      } else {
        alert('Upload failed')
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'WEBSITE', qrCodeUrl: qrUrl })
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>QR Code Settings</h2>
        <p>Upload the global QR code used for UTR Payment verification at checkout.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.qrPreview} style={{ position: 'relative', minHeight: '200px' }}>
          {qrUrl ? (
            <Image src={qrUrl} alt="QR Code" fill className={styles.previewImg} style={{ objectFit: 'contain' }} />
          ) : (
            <div className={styles.placeholder}>No QR Code Uploaded</div>
          )}
        </div>

        <div className={styles.uploadSection}>
          <label className={styles.uploadBtn}>
            <Upload size={18} /> {loading ? 'Uploading...' : 'Upload New QR Code'}
            <input type="file" accept="image/*" onChange={handleUpload} hidden disabled={loading} />
          </label>
        </div>

        <div className={styles.formFooter}>
          {saved && <span className={styles.successMsg}><CheckCircle size={16} /> Saved successfully!</span>}
          <button onClick={handleSave} disabled={loading} className={styles.btnPrimary}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
