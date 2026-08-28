import styles from './page.module.css'
import HeroSlider from '../components/HeroSlider'
import CollectionsGrid from '../components/CollectionsGrid'

export const revalidate = 0 // Disable cache to show updated Hero images immediately

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSlider />
      <CollectionsGrid />
    </main>
  )
}
