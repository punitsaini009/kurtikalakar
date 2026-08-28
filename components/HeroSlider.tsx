'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HeroSlider.module.css'

const slides = [
  {
    id: 1,
    image: '/images/hero.1.png',
    title: 'The Royal Maroon Collection',
    subtitle: 'Experience elegance in every thread.',
    link: '/collections/luxury'
  },
  {
    id: 2,
    image: '/images/hero_2.png',
    title: 'Pristine Chikankari',
    subtitle: 'Timeless grace for the modern woman.',
    link: '/collections/chikankari'
  },
  {
    id: 3,
    image: '/images/hero_3.png',
    title: 'Blush & Ivory Splendor',
    subtitle: 'Contemporary luxury meets traditional craftsmanship.',
    link: '/collections/festive'
  },
  {
    id: 4,
    image: '/images/hero_4.png',
    title: 'The Burgundy Edit',
    subtitle: 'Sophisticated modern trends for the festive season.',
    link: '/collections/trending'
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => slides.length > 0 ? (prev + 1) % slides.length : 0)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  if (!slides || slides.length === 0) return null;

  return (
    <div className={styles.hero}>
      {slides.map((slide, index) => {
        if (!slide || !slide.image) return null;
        return (
          <div 
            key={slide.id || index}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            <div className={styles.imageWrapper}>
              <Image 
                src={slide.image} 
                alt={slide.title || 'Hero Banner'}
                fill
                sizes="100vw"
                priority
                className={styles.image}
              />
            </div>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
              {slide.title && <h2 className={styles.title}>{slide.title}</h2>}
              {slide.subtitle && <p className={styles.subtitle}>{slide.subtitle}</p>}
              {slide.link && (
                <Link href={slide.link} className={styles.button}>
                  Shop Now
                </Link>
              )}
            </div>
          </div>
        );
      })}
      
      <div className={styles.indicators}>
        {slides.map((slide, index) => {
          if (!slide || !slide.image) return null;
          return (
            <button
              key={slide.id || index}
              className={`${styles.indicator} ${index === currentSlide ? styles.activeIndicator : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  )
}
