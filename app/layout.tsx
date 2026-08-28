import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import InstagramButton from '../components/InstagramButton'
import { CartProvider } from '../providers/CartProvider'
import { AuthProvider } from '../providers/AuthProvider'
import { WishlistProvider } from '../providers/WishlistProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

export const metadata: Metadata = {
  title: 'Kurti Kalakar | Luxury Fashion for Indian Women',
  description: 'Premium Kurti, Pajama, and Dupatta sets designed for elegance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <WhatsAppButton />
              <InstagramButton />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
