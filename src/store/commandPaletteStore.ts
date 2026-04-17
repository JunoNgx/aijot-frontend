import { create } from "zustand"
import type { CommandPaletteStore } from "@/types"

export const useCommandPaletteStore = create<CommandPaletteStore>((set) => ({
    isOpen: false,
    mode: "main",
    open: (mode = "main") => set({ isOpen: true, mode }),
    close: () => set({ isOpen: false }),
    setMode: (mode) => set({ mode }),
}))
