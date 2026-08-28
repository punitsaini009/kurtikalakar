/**
 * Client-side image compression utility using HTML5 Canvas.
 * Compresses and resizes large images before upload.
 */
export async function compressImage(file: File, maxWidth = 1024, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    // Only compress images
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file) // Fallback if blob creation fails
            }
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => {
        resolve(file) // Fallback to original file on error
      }
    }
    
    reader.onerror = () => {
      resolve(file)
    }
  })
}
