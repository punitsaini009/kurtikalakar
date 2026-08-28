'use client'

import { useState } from 'react'
import styles from './settings.module.css'
import { CheckCircle } from 'lucide-react'

export default function SettingsClient({ initialWebsite, initialContact }: { initialWebsite: any, initialContact: any }) {
  const [website, setWebsite] = useState(initialWebsite)
  const [contact, setContact] = useState(initialContact)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (type: 'WEBSITE' | 'CONTACT') => {
    setLoading(true)
    try {
      const payload = type === 'WEBSITE' ? { ...website, type } : { ...contact, type }
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
        <h2>Website Settings</h2>
        <p>Manage your store&apos;s branding and contact information.</p>
      </div>

      <div className={styles.card}>
        <h3>Brand Settings</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Logo URL</label>
            <input
              type="text"
              value={website.logoUrl || ''}
              onChange={e => setWebsite({ ...website, logoUrl: e.target.value })}
              placeholder="/logo.png"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Hero Banner URL</label>
            <input
              type="text"
              value={website.heroBannerUrl || ''}
              onChange={e => setWebsite({ ...website, heroBannerUrl: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.formFooter}>
          <button onClick={() => handleSave('WEBSITE')} disabled={loading} className={styles.btnPrimary}>
            Save Brand Settings
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Contact & Social Settings</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>WhatsApp Number</label>
            <input
              type="text"
              value={contact.whatsappNumber || ''}
              onChange={e => setContact({ ...contact, whatsappNumber: e.target.value })}
              placeholder="+917357736807"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Instagram Link</label>
            <input
              type="text"
              value={contact.instagramLink || ''}
              onChange={e => setContact({ ...contact, instagramLink: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Contact Number</label>
            <input
              type="text"
              value={contact.contactNumber || ''}
              onChange={e => setContact({ ...contact, contactNumber: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Support Email</label>
            <input
              type="email"
              value={contact.supportEmail || ''}
              onChange={e => setContact({ ...contact, supportEmail: e.target.value })}
            />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Physical Address</label>
            <textarea
              rows={3}
              value={contact.address || ''}
              onChange={e => setContact({ ...contact, address: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.formFooter}>
          {saved && <span className={styles.successMsg}><CheckCircle size={16} /> Saved!</span>}
          <button onClick={() => handleSave('CONTACT')} disabled={loading} className={styles.btnPrimary}>
            Save Contact Settings
          </button>
        </div>
      </div>
    </div>
  )
}
