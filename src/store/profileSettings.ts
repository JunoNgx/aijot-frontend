import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProfileSettingsStore } from '../types'

export const useProfileSettings = create<ProfileSettingsStore>()(
    persist(
        (set) => ({
            userDisplayName: '',
            shouldApplyTagsOfCurrCollection: true,
            setUserDisplayName: (userDisplayName) => set({ userDisplayName }),
            setShouldApplyTagsOfCurrCollection: (value) => set({ shouldApplyTagsOfCurrCollection: value }),
        }),
        { name: 'profileSettings' },
    ),
)
