import styles from "./index.module.scss"
import BackBtn from "@/components/BackBtn"

export default function Privacy() {
    return (
        <div className={styles.Privacy}>
            <BackBtn />
            <h1 className={styles.Privacy__Title}>Privacy</h1>
        </div>
    )
}
