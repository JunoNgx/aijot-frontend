import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LocalSyncDataStore } from '../types'

export const useLocalSyncData = create<LocalSyncDataStore>()(
    persist(
        (set) => ({
            authToken: undefined,
            driveFolderId: undefined,
            lastSyncTime: undefined,
            syncStatus: 'idle',
            syncError: undefined,
            setAuthToken: (authToken) => set({ authToken }),
            setDriveFolderId: (driveFolderId) => set({ driveFolderId }),
            setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
            setSyncStatus: (syncStatus) => set({ syncStatus }),
            setSyncError: (syncError) => set({ syncError }),
        }),
        { name: 'localSyncData' },
    ),
)
