import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"

import App from "@/App"
import { theme } from "@/theme"

import "@fontsource/space-grotesk"
import "@fontsource/space-mono"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
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
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <App />
                </MantineProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)
