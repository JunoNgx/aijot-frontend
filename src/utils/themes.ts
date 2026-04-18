export const themes = [
    {
        name: "light",
        colBg: "#e0e0e0",
        colMain: "#0098a9",
        colSub: "#777777",
        colBgSub: "#cfcfcf",
        colText: "#121212",
        colDanger: "#fa5252",
    },
    {
        name: "dark",
        colBg: "#121212",
        colMain: "#0098a9",
        colSub: "#777777",
        colBgSub: "#222222",
        colText: "#e0e0e0",
        colDanger: "#fa5252",
    },
] as const

export type ThemeName = (typeof themes)[number]["name"]

export type ThemeColors = Omit<(typeof themes)[number], "name">
