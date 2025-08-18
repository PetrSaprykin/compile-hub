import { useFileSystemStore } from "@/store/fileSystemStore"
import { useUserStore } from "@/store/userStore"
import { type User, type Item } from "@/types"

export const AuthService = {
  async login(username: string, password: string) {
    try {
      // Заглушка для запроса к API
      const testUser: User = {
        id: "123456789",
        email: "test@email.com",
        username: "vasya",
        token: "random-token",
        isGuest: true
      }

      // установка залогиневшегося юзера как currentUser в userStore
      useUserStore.getState().login(testUser)

      // Загружаем файлы пользователя
      await useFileSystemStore.getState().loadItems(testUser.id)

      return ["You successfully logged in", true] as [string, boolean]
    } catch (error) {
      console.error("Login error:", error)
      return ["Failed to log in, check your credentials", false] as [string, boolean]
    }
  },

  async logout() {
    // Опционально: можно сделать запрос к API для logout
    useUserStore.getState().logout()
  },

  async register(userData: { email: string; password: string; username: string }) {
    if (userData.email && userData.password && userData.username) {
      return ["Succesully signed up, please login", true] as [string, boolean]
    } else {
      return ["Failed to sign up, please try again", false] as [string, boolean]
    }

    const { currentUser } = useUserStore.getState()
    const guestFiles = currentUser.isGuest ? useFileSystemStore.getState().items : []

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" }
    })

    const data = await response.json()

    if (response.ok) {
      return data.user
    } else {
      throw new Error(data.message || "Registration failed")
    }

    if (currentUser.isGuest && guestFiles.length > 0) {
      await this.migrateFiles(guestFiles, user.id)
    }
  },

  async migrateFiles(files: Item[], userId: string) {
    try {
      // Оптимизация: переносим только последние 20 файлов
      const filesToMigrate = files.slice(-20).filter((f) => f.size < 500_000) // 500KB max

      await fetch("/api/files/migrate", {
        method: "POST",
        body: JSON.stringify({
          userId,
          files: filesToMigrate
        })
      })

      // Очистка гостевых данных
      localStorage.removeItem("guest_files")
    } catch (error) {
      console.error("Migration failed", error)
      // Файлы остаются в гостевом хранилище
    }
  }
}
