import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"

import App from "@/App"
import DialogManager from "@/components/DialogManager"
import CommandPaletteManager from "@/components/CommandPaletteManager"

import "@fontsource/space-grotesk"
import "@fontsource/space-mono"
import "./styles/global.scss"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            retry: 1,
        },
    },
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Toaster position="bottom-right" />
                <DialogManager />
                <CommandPaletteManager />
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)
