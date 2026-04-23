import styles from "./index.module.scss"
import BackBtn from "@/components/BackBtn"

export default function Help() {
    return (
        <div className={styles.Help}>
            <BackBtn />
            <h2 className={styles.Help__Title}>Help</h2>

            <section className={styles.Help__Section}>
                <h3>Creating items</h3>
                <p>
                    Type into the main input and press Enter to create an item.
                    The item type is detected automatically, or you can use a
                    prefix to force it.
                </p>
                <ul>
                    <li>
                        <strong>Text</strong>: type anything
                    </li>
                    <li>
                        <strong>Todo</strong>: <code>:td:</code> Buy milk
                    </li>
                    <li>
                        <strong>Link</strong>: paste or type a URL
                    </li>
                    <li>
                        <strong>Long text</strong>: <code>:t:</code> My note
                        title
                    </li>
                </ul>
            </section>

            <section className={styles.Help__Section}>
                <h3>Tags and collections</h3>
                <p>
                    Append flags when creating an item to assign tags or
                    collections.
                </p>
                <ul>
                    <li>
                        <code>::tg work urgent</code> - adds tags
                    </li>
                    <li>
                        <code>::col projects</code> - adds to collection
                    </li>
                </ul>
            </section>

            <section className={styles.Help__Section}>
                <h3>Searching</h3>
                <p>
                    Type in the main input without pressing Enter to filter
                    items.
                </p>
                <ul>
                    <li>
                        <code>##work</code> - filter by tag
                    </li>
                    <li>
                        <code>::td::</code> - show only todos
                    </li>
                    <li>
                        <code>::link::</code> - show only links
                    </li>
                    <li>
                        <code>::itd::</code> / <code>::ctd::</code> - incomplete
                        / completed todos
                    </li>
                </ul>
            </section>

            <section className={styles.Help__Section}>
                <h3>Keyboard shortcuts</h3>
                <p>
                    Press <kbd>mod + /</kbd> to see the full list of shortcuts.
                    Common ones include navigation with arrow keys, editing
                    selected items, and opening the command palette.
                </p>
            </section>

            <section className={styles.Help__Section}>
                <h3>Collections</h3>
                <p>
                    Collections group items by tag. The sidebar shows the core
                    collections:
                </p>
                <ul>
                    <li>
                        <strong>Everything</strong> - all items
                    </li>
                    <li>
                        <strong>Untagged</strong> - items with no tags
                    </li>
                    <li>
                        <strong>Trash</strong> - deleted items, purged after 7
                        days
                    </li>
                </ul>
            </section>

            <section className={styles.Help__Section}>
                <h3>Sync and backup</h3>
                <p>
                    Connect Google Drive in Settings to back up your data. You
                    can also export everything as a JSON file, import from an
                    aijot or JustJot backup, or clear all local data from the
                    Settings page.
                </p>
            </section>
        </div>
    )
}
