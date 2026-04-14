import { Link } from "react-router-dom"
import styles from "./index.module.scss"

export default function Landing() {
    return (
        <div className={styles.Landing}>
            <h1 className={styles.Landing__Title}>ai*jot</h1>
            <p className={styles.Landing__Tagline}>*sloth, not LLM</p>
            <p className={styles.Landing__Tagline}>A minimal keyboard-first note app</p>
            <Link to="/jot" className={styles.Landing__Btn}>
                Get started
            </Link>
        </div>
    )
}
