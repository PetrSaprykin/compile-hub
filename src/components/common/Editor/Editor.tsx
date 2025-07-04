import { useState, useRef, useEffect } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { atomone } from "@uiw/codemirror-theme-atomone"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import styles from "./Editor.module.css"

export const Editor = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [editorHeight, setEditorHeight] = useState("100%")
  const [output, setOutput] = useState<string[]>([])
  const [code, setCode] = useState("console.log('Hello World!');")

  // авторесайз редактора
  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setEditorHeight(`${entry.contentRect.height}px`)
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  // Функция выполнения кода (JS)
  const executeCode = () => {
    try {
      const newOutput = []
      // Сохраняем оригинальный console.log
      const originalConsoleLog = console.log

      // Перехватываем вывод
      console.log = (...args) => {
        newOutput.push(args.join(" "))
        originalConsoleLog(...args)
      }

      newOutput.push(`> ${code}`) // Добавляем ввод

      // Выполняем код
      new Function(code)()

      newOutput.push("Execution completed")
      setOutput(newOutput)

      // Восстанавливаем console.log
      console.log = originalConsoleLog
    } catch (error) {
      setOutput([...output, `Error: ${error}`])
    }
  }

  return (
    <>
      <div ref={containerRef} className={styles.editorContainer}>
        <PanelGroup direction='horizontal'>
          {/* Редактор кода */}
          <Panel defaultSize={50} minSize={30}>
            <div className={styles.editorWrapper}>
              <CodeMirror
                value={code}
                height={editorHeight}
                extensions={[javascript()]}
                theme={atomone}
                onChange={(value) => setCode(value)}
                className={styles.editor}
              />
              <button onClick={executeCode} className={styles.runButton}>
                Run Code
              </button>
            </div>
          </Panel>
          <PanelResizeHandle className={styles.resizeHandle} />
          {/* Консоль вывода */}
          <Panel minSize={20}>
            <pre className={styles.consoleOutput}>{output.join("\n")}</pre>
          </Panel>
        </PanelGroup>
      </div>
    </>
  )
}
