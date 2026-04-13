import { create } from "zustand"
import type { DialogStore } from "@/types"

export const useDialogStore = create<DialogStore>((set) => ({
    isOpen: false,
    children: null,
    openDialog: ({ children }) => set({ isOpen: true, children }),
    closeAllDialogs: () => set({ isOpen: false, children: null }),
}))
