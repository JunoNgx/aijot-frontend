import { useNavigate } from "react-router-dom"
import { IconArrowNarrowLeft } from "@tabler/icons-react"
import styles from "./BackBtn.module.scss"

export default function BackBtn() {
    const navigate = useNavigate()

    return (
        <button className={`Btn Btn--Quart ${styles.BackBtn}`} onClick={() => navigate(-1)}>
            <IconArrowNarrowLeft size={18} />
            return
        </button>
    )
}
