import { useState, useRef, useEffect } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { atomone } from "@uiw/codemirror-theme-atomone"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { useEditorStore } from "@/store/editorStore"
import styles from "./Editor.module.css"

export const Editor = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [editorHeight, setEditorHeight] = useState("100%")

  const {
    currentFile,
    code,
    isLoading,
    isCompiling,
    output,
    inputRequired,
    loadCode,
    saveCode,
    compileCode,
    sendInput
  } = useEditorStore()

  useEffect(() => {
    if (currentFile) {
      loadCode(currentFile)
    }
  }, [currentFile, loadCode])

  const handleCodeChange = (value: string) => {
    saveCode(value)
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading code...</div>
  }

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
                onChange={handleCodeChange}
                className={styles.editor}
              />
              <button
                onClick={compileCode}
                className={styles.runButton}
                disabled={isCompiling && isLoading}
              >
                {isCompiling ? "Running..." : "Run Code"}
              </button>
            </div>
          </Panel>
          <PanelResizeHandle className={styles.resizeHandle} />
          {/* Консоль вывода */}
          <Panel minSize={20}>
            <div className={styles.consoleContainer}>
              <pre className={styles.consoleOutput}>
                {output || "Output will appear here..."}
              </pre>
              {inputRequired && (
                <div className={styles.inputContainer}>
                  <input
                    type='text'
                    placeholder='Enter input...'
                    className={styles.inputField}
                  />
                  <button
                    onClick={() => sendInput("user input")}
                    className={styles.sendButton}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </>
  )
}
