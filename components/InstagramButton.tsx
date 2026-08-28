import { Instagram } from 'lucide-react'
import styles from './InstagramButton.module.css'

export default function InstagramButton() {
  return (
    <a
      href="https://www.instagram.com/kurti___kalakar_?igsh=MjQyaTlvdjFnMjdp"
      className={styles.float}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow us on Instagram"
    >
      <Instagram size={30} />
    </a>
  )
}
