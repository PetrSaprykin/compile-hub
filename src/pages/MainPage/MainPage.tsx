import styles from "./MainPage.module.css"
import { Filebar } from "@/components/common/Filebar/Filebar"
export default function MainPage() {
  return (
    <main className={styles.main}>
      <Filebar />
    </main>
  )
}
