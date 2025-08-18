import { create } from "zustand"
import { type Item } from "@/types/fileSystem"
import { CodeService } from "@/services/codeService"

interface EditorState {
  currentFile: Item | null
  code: string
  isLoading: boolean
  isCompiling: boolean
  inputRequired: boolean
  error: string | null
  output: string
}

interface EditorActions {
  loadCode: (file: Item) => Promise<void>
  saveCode: (code: string) => void
  compileCode: () => Promise<void>
  sendInput: (input: string) => Promise<void>
  clearError: () => void
}

const LOCAL_STORAGE_KEY = "editor_code_cache"

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  // State
  currentFile: null,
  code: "",
  isLoading: false,
  isCompiling: false,
  inputRequired: false,
  error: null,
  output: "",

  // действия
  loadCode: async (file) => {
    set({ isLoading: true, error: null })

    try {
      // Проверяем локальное хранилище
      const cachedCode = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${file.id}`)

      if (cachedCode) {
        set({ code: cachedCode })
      }

      // Загружаем с сервера
      const code = await CodeService.fetchCode(file.id)
      set({
        currentFile: file,
        code: code || cachedCode || "",
        inputRequired: false,
        output: ""
      })

      // Сохраняем в локальное хранилище
      if (code) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_${file.id}_code`, code)
      }
    } catch (error) {
      set({ error: "Failed to load file" })
    } finally {
      set({ isLoading: false })
    }
  },

  saveCode: (code) => {
    const { currentFile } = get()
    if (!currentFile) return

    set({ code })
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${currentFile.id})_code`, code)
  },

  compileCode: async () => {
    set({ isCompiling: true, error: null, output: "" })

    try {
      const { code } = get()
      const result = await CodeService.compileCode(code)

      if (result.requiresInput) {
        set({ inputRequired: true })
      } else {
        set({ output: result.output })
      }
    } catch (error) {
      set({ error: "Compilation failed" })
    } finally {
      set({ isCompiling: false })
    }
  },

  sendInput: async (input) => {
    set({ isCompiling: true })

    try {
      const { code } = get()
      const result = await CodeService.compileWithInput(code, input)
      set({
        output: result,
        inputRequired: false
      })
    } catch (error) {
      set({ error: "Compilation failed" })
    } finally {
      set({ isCompiling: false })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))
