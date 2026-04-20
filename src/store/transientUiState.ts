import { create } from "zustand"

export const useTransientUiState = create<{
    copiedItemIds: string[]
    addCopiedItemId: (id: string) => void
    removeCopiedItemId: (id: string) => void
    fetchingLinkMetaItemIds: string[]
    addFetchingLinkMetaItemId: (id: string) => void
    removeFetchingLinkMetaItemId: (id: string) => void
}>((set) => ({
    copiedItemIds: [],
    addCopiedItemId: (id) =>
        set((state) => ({
            copiedItemIds: [
                ...state.copiedItemIds.filter(
                    (existingId) => existingId !== id,
                ),
                id,
            ],
        })),
    removeCopiedItemId: (id) =>
        set((state) => ({
            copiedItemIds: state.copiedItemIds.filter(
                (existingId) => existingId !== id,
            ),
        })),
    fetchingLinkMetaItemIds: [],
    addFetchingLinkMetaItemId: (id) =>
        set((state) => ({
            fetchingLinkMetaItemIds: [
                ...state.fetchingLinkMetaItemIds.filter(
                    (existingId) => existingId !== id,
                ),
                id,
            ],
        })),
    removeFetchingLinkMetaItemId: (id) =>
        set((state) => ({
            fetchingLinkMetaItemIds: state.fetchingLinkMetaItemIds.filter(
                (existingId) => existingId !== id,
            ),
        })),
}))
