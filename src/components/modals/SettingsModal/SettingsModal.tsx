import { useState } from "react"
import { GeneralTab } from "./tabs/GeneralTab/GeneralTab"
import { EditorTab } from "./tabs/EditorTab/EditorTab"
import styles from "./SettingsModal.module.css"
import { AboutTab } from "./tabs/AboutTab/AboutTab"

type TabType = "profile" | "editor" | "appearance" | "about"

export const SettingsModal = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  return (
    <div className={styles.main}>
      {/* Боковая панель с вкладками */}
      <div className={styles.tabPanel}>
        <button
          onClick={() => setActiveTab("profile")}
          className={`${styles.tabButton} ${activeTab === "profile" ? styles.isActive : ""}`}
        >
          Общее
        </button>
        <button
          onClick={() => setActiveTab("editor")}
          className={`${styles.tabButton} ${activeTab === "editor" ? styles.isActive : ""}`}
        >
          Редактор
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`${styles.tabButton} ${activeTab === "appearance" ? styles.isActive : ""}`}
        >
          Отображение
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`${styles.tabButton} ${activeTab === "about" ? styles.isActive : ""}`}
        >
          О программе
        </button>
      </div>

      {/* Контент вкладки */}
      <div className={styles.tabContent}>
        {activeTab === "profile" && <GeneralTab />}
        {activeTab === "editor" && <EditorTab />}
        {activeTab === "appearance" && <AppearanceTab />}
        {activeTab === "about" && <AboutTab />}
      </div>
    </div>
  )
}

const AppearanceTab = () => (
  <div>
    <h3 className='text-lg font-medium mb-4'>Внешний вид</h3>
    <div className='space-y-4'>
      <p>Темная/светлая тема, акцентный цвет...</p>
    </div>
  </div>
)
