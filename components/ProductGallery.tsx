'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ProductGallery.module.css'

export default function ProductGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [direction, setDirection] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePos({ x, y })
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => {
      let nextIndex = prev + newDirection
      if (nextIndex < 0) nextIndex = images.length - 1
      if (nextIndex >= images.length) nextIndex = 0
      return nextIndex
    })
  }

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x
    if (swipe < -10000) paginate(1)
    else if (swipe > 10000) paginate(-1)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <div className={styles.gallery}>
      <div 
        className={styles.mainImageContainer}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className={styles.imageWrapper}
            style={isZoomed ? { 
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: 'scale(2)',
              cursor: 'zoom-out'
            } : { cursor: 'zoom-in' }}
          >
            <Image 
              src={images[currentIndex]} 
              alt={`Product image ${currentIndex + 1}`} 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.mainImage}
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows for Desktop */}
        <button className={`${styles.navArrow} ${styles.prevArrow}`} onClick={() => paginate(-1)}>&#10094;</button>
        <button className={`${styles.navArrow} ${styles.nextArrow}`} onClick={() => paginate(1)}>&#10095;</button>
      </div>
      
      <div className={styles.thumbnailContainer}>
        {images.map((img, index) => (
          <button 
            key={index} 
            className={`${styles.thumbnailBtn} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="100px"
              className={styles.thumbnail}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
