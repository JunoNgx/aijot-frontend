import styles from "./index.module.scss"
import BackBtn from "@/components/BackBtn"

export default function Help() {
    return (
        <div className={styles.Help}>
            <BackBtn />
            <h1 className={styles.Help__Title}>Help</h1>
        </div>
    )
}
