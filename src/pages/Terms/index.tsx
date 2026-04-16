import styles from "./index.module.scss"
import BackBtn from "@/components/BackBtn"

export default function Terms() {
    return (
        <div className={styles.Terms}>
            <BackBtn />
            <h1 className={styles.Terms__Title}>Terms</h1>
        </div>
    )
}
