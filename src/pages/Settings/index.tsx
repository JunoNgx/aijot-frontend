import { useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"
import { useSyncFn } from "@/hooks/useSync"
import { useNavigateRoutes } from "@/hooks/useNavigateRoutes"
import { useLocalAppData } from "@/store/localAppData"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { useCommandPaletteStore } from "@/store/commandPaletteStore"
import { useProfileSettings } from "@/store/profileSettings"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"
import { useLocalSyncData } from "@/store/localSyncData"
import { useDialogStore } from "@/store/dialogStore"
import {
    exportData,
    parseImportFile,
    getImportSummary,
    commitImport,
} from "@/services/exportImport"
import { clearAllData, resetApp } from "@/utils/clearData"
import type { ExportData, ImportSummary } from "@/types"
import { queryKeys } from "@/db/queryKeys"
import styles from "./index.module.scss"
import BackBtn from "@/components/BackBtn"

export default function Settings() {
    const queryClient = useQueryClient()
    const importInputRef = useRef<HTMLInputElement>(null)
    const [pendingImport, setPendingImport] = useState<ExportData | null>(null)
    const [importSummary, setImportSummary] = useState<ImportSummary | null>(
        null,
    )
    const [isClearingData, setIsClearingData] = useState(false)
    const [isResettingApp, setIsResettingApp] = useState(false)
    const [isDebugMode, setIsDebugMode] = useState(false)

    const theme = useLocalUserSettings((s) => s.theme)

    const is24HourClock = useProfileSettings((s) => s.is24HourClock)
    const setIs24HourClock = useProfileSettings((s) => s.setIs24HourClock)

    const userDisplayName = useProfileSettings((s) => s.userDisplayName)
    const setUserDisplayName = useProfileSettings((s) => s.setUserDisplayName)
    const shouldApplyTagsOfCurrCollection = useProfileSettings(
        (s) => s.shouldApplyTagsOfCurrCollection,
    )
    const setShouldApplyTagsOfCurrCollection = useProfileSettings(
        (s) => s.setShouldApplyTagsOfCurrCollection,
    )
    const shouldCustomSortCollections = useProfileSettings(
        (s) => s.shouldCustomSortCollections,
    )
    const setShouldCustomSortCollections = useProfileSettings(
        (s) => s.setShouldCustomSortCollections,
    )
    const shouldShowJotItemExtraInfo = useProfileSettings(
        (s) => s.shouldShowJotItemExtraInfo,
    )
    const setShouldShowJotItemExtraInfo = useProfileSettings(
        (s) => s.setShouldShowJotItemExtraInfo,
    )

    const allCollection = useCoreCollectionSettings((s) => s.all)
    const setAll = useCoreCollectionSettings((s) => s.setAll)
    const untaggedCollection = useCoreCollectionSettings((s) => s.untagged)
    const setUntagged = useCoreCollectionSettings((s) => s.setUntagged)
    const trashCollection = useCoreCollectionSettings((s) => s.trash)
    const setTrash = useCoreCollectionSettings((s) => s.setTrash)

    const syncStatus = useLocalSyncData((s) => s.syncStatus)
    const syncError = useLocalSyncData((s) => s.syncError)
    const lastSyncTime = useLocalSyncData((s) => s.lastSyncTime)
    const setShouldShowDemoDataBanner = useLocalAppData(
        (s) => s.setShouldShowDemoDataBanner,
    )

    const {
        isConnected,
        isConnecting,
        connectError,
        connect,
        disconnect,
        authToken,
    } = useGoogleAuth()
    const { sync } = useSyncFn()
    const { navigateToHelp, navigateToPrivacy, navigateToTerms } =
        useNavigateRoutes()

    const closeAllDialogs = useDialogStore((s) => s.closeAllDialogs)

    const handleExport = async () => {
        await exportData({
            profile: { userDisplayName, shouldApplyTagsOfCurrCollection },
            coreCollections: {
                all: allCollection,
                untagged: untaggedCollection,
                trash: trashCollection,
            },
        })
    }

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const data = await parseImportFile(file)
            const summary = await getImportSummary(data)
            setPendingImport(data)
            setImportSummary(summary)
        } catch {
            toast.error("Failed to read file: invalid format")
        } finally {
            e.target.value = ""
        }
    }

    const handleConfirmImport = async () => {
        if (!pendingImport) return
        try {
            const settings = await commitImport(pendingImport)
            setUserDisplayName(settings.profile.userDisplayName)
            setShouldApplyTagsOfCurrCollection(
                settings.profile.shouldApplyTagsOfCurrCollection,
            )
            setAll(settings.coreCollections.all)
            setUntagged(settings.coreCollections.untagged)
            setTrash(settings.coreCollections.trash)
            queryClient.invalidateQueries({ queryKey: queryKeys.items })
            queryClient.invalidateQueries({ queryKey: queryKeys.collections })
            toast("Data imported successfully")
        } catch {
            toast.error("Failed to import data")
        } finally {
            setPendingImport(null)
            setImportSummary(null)
        }
    }

    const handleClearData = async () => {
        setIsClearingData(true)
        try {
            disconnect()
            await clearAllData()
            setShouldShowDemoDataBanner(true)
            toast("All data cleared. Reloading...")
            setTimeout(() => window.location.reload(), 1500)
        } catch {
            toast.error("Failed to clear data")
            setIsClearingData(false)
        }
    }

    const handleResetApp = async () => {
        setIsResettingApp(true)
        try {
            await resetApp()
        } catch {
            toast.error("Failed to reset app")
            setIsResettingApp(false)
        }
    }

    const openClearDataDialog = () => {
        useDialogStore.getState().openDialog({
            children: (
                <>
                    <p className={styles.Settings__DialogWarning}>
                        This cannot be undone.
                    </p>
                    <div className={styles.Settings__DialogFooter}>
                        <button
                            className={styles.Settings__BtnAction}
                            type="button"
                            onClick={closeAllDialogs}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.Settings__BtnDanger}
                            type="button"
                            disabled={isClearingData}
                            onClick={handleClearData}
                        >
                            {isClearingData ? "Clearing..." : "Clear"}
                        </button>
                    </div>
                </>
            ),
        })
    }

    const openResetAppDialog = () => {
        useDialogStore.getState().openDialog({
            children: (
                <>
                    <p className={styles.Settings__DialogWarning}>
                        This cannot be undone.
                    </p>
                    <div className={styles.Settings__DialogFooter}>
                        <button
                            className={styles.Settings__BtnAction}
                            type="button"
                            onClick={closeAllDialogs}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.Settings__BtnDanger}
                            type="button"
                            disabled={isResettingApp}
                            onClick={handleResetApp}
                        >
                            {isResettingApp ? "Resetting..." : "Reset app"}
                        </button>
                    </div>
                </>
            ),
        })
    }

    const handleTitleClick = () => {
        if (!isDebugMode) {
            setIsDebugMode(true)
            toast("Debug mode enabled")
        }
    }

    const itemDisplayDescId = "SettingDescDisplayMode"
    const hourModeDescId = "SettingDescHourMode"
    const autoApplyTagsDescId = "SettingDesAutoApplyTag"

    return (
        <div className={styles.Settings}>
            <BackBtn />
            <h1 className={styles.Settings__Title} onClick={handleTitleClick}>
                Settings
            </h1>

            <section className={styles.Section}>
                <h2 className={styles.Section__Title}>Sync</h2>
                <p className={styles.Section__Description}>
                    Back up your data to Google Drive
                </p>
                {isConnected && authToken && (
                    <div className={styles.Field__SyncStatus}>
                        <span>Connected as {authToken.email}</span>
                        {lastSyncTime && (
                            <span>
                                Last sync:{" "}
                                {new Date(lastSyncTime).toLocaleString()}
                            </span>
                        )}
                        {syncStatus === "syncing" && <span>Syncing...</span>}
                        {syncStatus === "error" && syncError && (
                            <span>Error: {syncError}</span>
                        )}
                    </div>
                )}
                {connectError && (
                    <div className={styles.Field__SyncStatus}>
                        {connectError}
                    </div>
                )}
                <div className="FlexRow">
                    {isConnected ? (
                        <>
                            <button
                                className={styles.Settings__BtnAction}
                                type="button"
                                disabled={syncStatus === "syncing"}
                                onClick={() => sync()}
                            >
                                Sync now
                            </button>
                            <button
                                className={styles.Settings__BtnAction}
                                type="button"
                                onClick={disconnect}
                            >
                                Disconnect
                            </button>
                        </>
                    ) : (
                        <button
                            className={styles.Settings__BtnConnect}
                            type="button"
                            disabled={isConnecting}
                            onClick={connect}
                        >
                            {isConnecting ? "Connecting..." : "Connect"}
                        </button>
                    )}
                </div>
            </section>

            <section className={styles.Section}>
                <h2 className={styles.Section__Title}>Preferences</h2>

                <div className={`${styles.Field} ${styles["Field--FlexRow"]}`}>
                    <label
                        className={styles.Field__Label}
                        htmlFor="displayName"
                    >
                        Display name
                    </label>
                    <input
                        id="displayName"
                        type="text"
                        className={styles.Field__Input}
                        value={userDisplayName}
                        onChange={(e) => setUserDisplayName(e.target.value)}
                    />
                </div>

                <div className={`${styles.Field} ${styles["Field--FlexRow"]}`}>
                    <label className={styles.Field__Label}>
                        Collection sort order:
                    </label>
                    <div className={styles.Field__RadioGroup}>
                        <label className={styles.Field__Radio}>
                            <input
                                type="radio"
                                name="collectionSortOrder"
                                checked={shouldCustomSortCollections}
                                onChange={() =>
                                    setShouldCustomSortCollections(true)
                                }
                            />
                            Custom
                        </label>
                        <label className={styles.Field__Radio}>
                            <input
                                type="radio"
                                name="collectionSortOrder"
                                checked={!shouldCustomSortCollections}
                                onChange={() =>
                                    setShouldCustomSortCollections(false)
                                }
                            />
                            Alphabetically
                        </label>
                    </div>
                </div>

                <div className={styles.Field}>
                    <label className={styles.Field__Checkbox}>
                        <input
                            aria-describedby={hourModeDescId}
                            type="checkbox"
                            checked={is24HourClock}
                            onChange={(e) => {
                                setIs24HourClock(e.target.checked)
                            }}
                        />
                        Use 24-hour clock
                    </label>
                    <small
                        id={hourModeDescId}
                        className={styles.Field__Description}
                    >
                        16:35 vs 04:35 pm
                    </small>
                </div>

                <div className={styles.Field}>
                    <label className={styles.Field__Checkbox}>
                        <input
                            aria-describedby={itemDisplayDescId}
                            type="checkbox"
                            checked={shouldShowJotItemExtraInfo}
                            onChange={(e) => {
                                setShouldShowJotItemExtraInfo(e.target.checked)
                            }}
                        />
                        Show extra information in jot list
                    </label>
                    <small
                        id={itemDisplayDescId}
                        className={styles.Field__Description}
                    >
                        Default initial state for item display mode. Can be
                        toggled mid-session.
                    </small>
                </div>

                <div className={styles.Field}>
                    <label className={styles.Field__Checkbox}>
                        <input
                            aria-describedby={autoApplyTagsDescId}
                            type="checkbox"
                            checked={shouldApplyTagsOfCurrCollection}
                            onChange={(e) =>
                                setShouldApplyTagsOfCurrCollection(
                                    e.target.checked,
                                )
                            }
                        />
                        Auto-apply collection tags when creating items
                    </label>
                    <small
                        id={autoApplyTagsDescId}
                        className={styles.Field__Description}
                    >
                        The tags of the current collection will also be applied,
                        in addition to syntax specification.
                    </small>
                </div>

                <div className={`${styles.Field} ${styles["Field--FlexRow"]}`}>
                    <label className={styles.Field__Label}>Current theme:</label>
                    <span className={styles.Settings__CurrentTheme}>
                        {theme}
                    </span>
                    <button
                        type="button"
                        className={styles.Settings__BtnAction}
                        onClick={() => {
                            useCommandPaletteStore.getState().open("theme")
                        }}
                    >
                        Change Theme
                    </button>
                </div>
            </section>

            <section className={styles.Section}>
                <h2 className={styles.Section__Title}>Data</h2>
                <p className={styles.Section__Description}>
                    Export or import your items, collections, and settings
                </p>
                <div className="FlexRow">
                    <button
                        className={styles.Settings__BtnAction}
                        type="button"
                        onClick={handleExport}
                    >
                        Export
                    </button>
                    <button
                        className={styles.Settings__BtnAction}
                        type="button"
                        onClick={() => importInputRef.current?.click()}
                    >
                        Import
                    </button>
                    <input
                        ref={importInputRef}
                        type="file"
                        accept=".json"
                        style={{ display: "none" }}
                        onChange={handleImportFile}
                    />
                </div>
                {pendingImport && importSummary && (
                    <div className={styles.Settings__ImportPreview}>
                        <span>
                            {importSummary.newItems} new,{" "}
                            {importSummary.updatedItems} updated items
                        </span>
                        <span>
                            {importSummary.newCollections} new,{" "}
                            {importSummary.updatedCollections} updated
                            collections
                        </span>
                        <div className={styles.Settings__ImportPreviewActions}>
                            <button
                                className={styles.Settings__BtnAction}
                                type="button"
                                onClick={handleConfirmImport}
                            >
                                Confirm
                            </button>
                            <button
                                className={styles.Settings__BtnAction}
                                type="button"
                                onClick={() => {
                                    setPendingImport(null)
                                    setImportSummary(null)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <section className={styles.Section}>
                <h2 className={styles.Section__Title}>Help</h2>
                <button
                    className={styles.Settings__BtnAction}
                    type="button"
                    onClick={navigateToHelp}
                >
                    Help guide
                </button>
            </section>

            <section className={styles.Section}>
                <h2 className={styles.Section__Title}>About</h2>
                <p className={styles.Settings__Version}>Version 0.0.1</p>
                <div className="FlexRow">
                    <button
                        className={styles.Settings__BtnAction}
                        type="button"
                        onClick={navigateToPrivacy}
                    >
                        Privacy policy
                    </button>
                    <button
                        className={styles.Settings__BtnAction}
                        type="button"
                        onClick={navigateToTerms}
                    >
                        Terms of Services
                    </button>
                </div>
            </section>

            <section
                className={`${styles.Section} ${styles["Section--Spaced"]}`}
            >
                <h2
                    className={`${styles.Section__Title} ${styles["Section__Title--Danger"]}`}
                >
                    Danger Zone
                </h2>
                <p className={styles.Section__Description}>
                    Removes all items and collections. Your data on Google Drive
                    will remain intact.
                </p>
                <button
                    className={styles.Settings__BtnDanger}
                    type="button"
                    onClick={openClearDataDialog}
                >
                    Clear all data
                </button>
            </section>

            {isDebugMode && (
                <section className={styles.Section}>
                    <h2 className={styles.Section__Title}>Debug</h2>
                    <button
                        className={styles.Settings__Btn}
                        type="button"
                        onClick={() =>
                            toast(
                                "Debug toast message with slightly long content",
                                {
                                    duration: Infinity,
                                },
                            )
                        }
                    >
                        Trigger test toast
                    </button>
                    <p className={styles.Section__Description}>
                        Wipes local database and all local app data. Cannot be
                        undone.
                    </p>
                    <button
                        className={styles.Settings__BtnDanger}
                        type="button"
                        onClick={openResetAppDialog}
                    >
                        Reset app
                    </button>
                </section>
            )}
        </div>
    )
}
