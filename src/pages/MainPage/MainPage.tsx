import styles from "./MainPage.module.css"
import { Filebar } from "@/components/common/Filebar/Filebar"
export default function MainPage() {
  return (
    <main className={styles.main}>
      <Filebar />
      <div className={styles.editorContainer}>
        <div className={styles.stub}></div>
      </div>
    </main>
  )
}
