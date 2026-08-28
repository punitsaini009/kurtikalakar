'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      style={{
        textAlign: 'left',
        padding: '1rem',
        width: '100%',
        color: '#800000',
        fontWeight: '500',
        borderTop: '1px solid #E5E7EB',
        marginTop: '1rem'
      }}
    >
      Sign Out
    </button>
  )
}
