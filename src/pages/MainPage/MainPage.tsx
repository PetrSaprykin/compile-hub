import styles from "./MainPage.module.css"
import { Filebar } from "@/components/common/Filebar/Filebar"
import { Editor } from "@/components/common/Editor"
export default function MainPage() {
  return (
    <main className={styles.main}>
      <Filebar />
      <div className={styles.editorContainer}>
        <div className={styles.controlPanel}></div>
        <Editor />
      </div>
    </main>
  )
}
