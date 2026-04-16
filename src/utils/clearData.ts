import { storage, forceDeleteDb as deleteDb } from "@/db"
import { useLocalAppData } from "@/store/localAppData"
import { useLocalSyncData } from "@/store/localSyncData"
import { useLocalUserSettings } from "@/store/localUserSettings"
import { useProfileSettings } from "@/store/profileSettings"
import { useCoreCollectionSettings } from "@/store/coreCollectionSettings"

export async function clearAllData(): Promise<void> {
    await storage.clearAllData()
}

export async function forceDeleteDb(): Promise<void> {
    await deleteDb()
}

export async function clearAllCaches(): Promise<void> {
    if (!("caches" in window)) return
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
}

export function resetZustandStores(): void {
    useLocalAppData.persist.clearStorage()
    useLocalSyncData.persist.clearStorage()
    useLocalUserSettings.persist.clearStorage()
    useProfileSettings.persist.clearStorage()
    useCoreCollectionSettings.persist.clearStorage()
}

export function clearAllStorage(): void {
    localStorage.clear()
    sessionStorage.clear()
}

export async function resetApp(): Promise<void> {
    clearAllStorage()
    await forceDeleteDb()
    await clearAllCaches()
    window.location.href = "/"
}
