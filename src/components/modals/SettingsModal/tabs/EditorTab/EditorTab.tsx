import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Switcher } from "@/components/ui/Switcher"
import styles from "./EditorTab.module.css"
import { useState } from "react"

export const EditorTab = () => {
  const [fontSize, setFontSize] = useState<number>(14)
  const MIN_FONT_SIZE = 8
  const MAX_FONT_SIZE = 18

  // Обработчик уменьшения
  const handleDecrease = () => {
    setFontSize((prev) => Math.max(MIN_FONT_SIZE, prev - 1))
  }

  // Обработчик увеличения
  const handleIncrease = () => {
    setFontSize((prev) => Math.min(MAX_FONT_SIZE, prev + 1))
  }

  return (
    <div className={styles.mainContainer}>
      <h3>Настройки редактора</h3>
      <div className={styles.optionContainer}>
        <span>Размер шрифта</span>
        <div className={styles.fontSizeInput}>
          <Button
            variant='primary'
            onClick={handleDecrease}
            disabled={fontSize <= MIN_FONT_SIZE}
          >
            -
          </Button>
          <Input
            className={styles.fontSizeInput2}
            type='number'
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            value={fontSize}
            readOnly
          />
          <Button
            variant='primary'
            onClick={handleIncrease}
            disabled={fontSize >= MAX_FONT_SIZE}
          >
            +
          </Button>
        </div>
      </div>
      <div className={styles.optionContainer}>
        <span>Автодополнение</span>
        {/* В пропс init value можно запихнуть настройку юзера и облачно синхронизировать*/}
        <Switcher />
      </div>
    </div>
  )
}
