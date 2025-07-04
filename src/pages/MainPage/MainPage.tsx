import styles from "./MainPage.module.css"
import { Filebar } from "@/components/common/Filebar/Filebar"
import { Editor } from "@/components/common/Editor"
export default function MainPage() {
  return (
    <main className={styles.main}>
      <Filebar />
      <div className={styles.editorContainer}>
        <Editor />
      </div>
    </main>
  )
}
