import styles from "./AboutTab.module.css"

export const AboutTab = () => {
  return (
    <div className={styles.mainContainer}>
      <h3>О программе</h3>
      <p>
        CompileHub - это простой и удобный способ компилировать ваш код прямо в
        веб-браузере
      </p>
      <p>Список поддерживаемых языков:</p>
      <ul>
        <li>Python</li>
        <li>Java</li>
        <li>Golang</li>
        <li>JavaScript</li>
        <li>C++</li>
      </ul>
      <p>Авторы: Пётр Сапрыкин, Егор Деев</p>
    </div>
  )
}
