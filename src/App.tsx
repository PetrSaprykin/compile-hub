// src/App.tsx
import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "@/router"
import { Modal } from "./components/ui/Modal"
import Header from "@/components/common/Header"

function App() {
  const str = "abc" // 6
  let res = 0
  for (let i = 0; i < str.length - 2; i++) {
    if (str[i] === "a" && str[i + 1] === "b" && str[i + 2] === "c") {
      res++
    }
  }

  alert(res)
  return (
    <BrowserRouter>
      <div className='app'>
        <Header />
        <AppRouter />
        <Modal />
      </div>
    </BrowserRouter>
  )
}

export default App
