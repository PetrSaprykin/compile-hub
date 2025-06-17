// src/router/routes.ts
import MainPage from '@/pages/MainPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Типизация для маршрутов
export interface RouteConfig {
  path: string
  element: React.ReactNode
  title?: string
}

// Константы путей для удобства использования
export const ROUTES = {
  MAIN: '/',
  // Другие маршруты в будущем
  // ABOUT: '/about',
  // PROFILE: '/profile',
}

// Конфигурация маршрутов
export const routeConfig: RouteConfig[] = [
  {
    path: ROUTES.MAIN,
    element: <MainPage />,
    title: 'Главная',
  },
  // Маршрут 404 для обработки несуществующих URL
  {
    path: '*',
    element: <NotFoundPage />,
    title: 'Страница не найдена',
  },
]
