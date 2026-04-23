import { Link } from "react-router-dom"
import styles from "./index.module.scss"
import {
    ROUTE_JOT,
    ROUTE_HELP,
    ROUTE_PRIVACY,
    ROUTE_TERMS,
} from "@/config/constants"

export default function Landing() {
    return (
        <div className={styles.Landing}>
            <section className={styles.Landing__Hero}>
                <h1 className={styles.Landing__Title}>ai*jot</h1>
                <p className={styles.Landing__Tagline}>*sloth, not LLM</p>
                {/* <p className={styles.Landing__Definition}>
                    ai&nbsp;&nbsp;/ˈɑ.i/&nbsp;&nbsp;noun
                    <br />
                    three-toed sloth
                </p> */}
                <p className={styles.Landing__Description}>
                    A minimalist keyboard-first note app.
                </p>
            </section>

            <section className={styles.Landing__Section}>
                <h2 className={styles.Landing__SectionTitle}>Use keyboard; be more like sloth</h2>
                <p className={styles.Landing__Text}>
                    Sloth achieves a lot despite moving very little, just like you can with your keyboard. Create everything with tags from one single input, and do everything else with command palette like a neovim nerd, because you can in this app.
                </p>
            </section>

            <section className={styles.Landing__Section}>
                <h2 className={styles.Landing__SectionTitle}>A simple, sane, and flexible system</h2>
                <p className={styles.Landing__Text}>
                    All you need for noting: text, bookmarks, and todos. Add tags to create collections. Browse what you want to see, and instantly search for what you need.
                </p>
            </section>

            <section className={styles.Landing__Section}>
                <h2 className={styles.Landing__SectionTitle}>Dark/light theme is so 2015; get some personality</h2>
                <p className={styles.Landing__Text}>
                    Spotify can't even do light theme as of 2026, but I don't work for them. Choose from original tasteful themes, or 60 other well-known and proven colour palettes. Randomise or pick one. Go wild.
                </p>
            </section>

            <section className={styles.Landing__Section}>
                <h2 className={styles.Landing__SectionTitle}>All the FOSS fuss</h2>
                <p className={styles.Landing__Text}>
                    You probably know the drill. No ad, no sub, no tracking. Open source and free forever. Fork and host all you want. Backend only does what it needs, no remote database. Data only leave your device to go to your Google Drive, only when you choose.
                </p>
            </section>

            <Link to={ROUTE_JOT} className={styles.Landing__Btn}>
                Get started
            </Link>
            <p className={styles.Landing__BtnHint}>
                (local-first, no account needed)
            </p>

            <footer className={styles.Landing__Footer}>
                <p className={styles.Landing__FooterCredit}>
                    Made by{" "}
                    <a
                        href="https://JunoNgx.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Juno Nguyen
                    </a>
                </p>
                <div className={styles.Landing__FooterLinks}>
                    <Link to={ROUTE_HELP}>Help guide</Link>
                    <span className={styles.Landing__FooterDivider}>·</span>
                    <Link to={ROUTE_PRIVACY}>Privacy</Link>
                    <span className={styles.Landing__FooterDivider}>·</span>
                    <Link to={ROUTE_TERMS}>Terms</Link>
                    <span className={styles.Landing__FooterDivider}>·</span>
                    <a
                        href="https://github.com/JunoNgx/aijot-frontend"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Source
                    </a>
                </div>
            </footer>
        </div>
    )
}
