import { BACKEND_URL } from "@/config/constants"
import type { AuthToken } from "@/types"

export async function postAuthCallback(code: string): Promise<AuthToken> {
    const res = await fetch(`${BACKEND_URL}/api/auth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, redirect_uri: "postmessage" }),
    })

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Authentication failed")
    }

    const data = await res.json()
    return {
        id: "google",
        accessToken: data.accessToken,
        expiresAt: data.expiresAt,
        email: data.email,
    }
}

export async function postAuthRefresh(): Promise<
    Pick<AuthToken, "accessToken" | "expiresAt">
> {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
    })

    if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Token refresh failed")
    }

    const data = await res.json()
    return {
        accessToken: data.accessToken,
        expiresAt: data.expiresAt,
    }
}

export async function postAuthLogout(): Promise<void> {
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    })
}
