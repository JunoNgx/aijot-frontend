export const themes = [
    {
        name: "JustJot Light",
        colBg: "#e0e0e0",
        colMain: "#0098a9",
        colSub: "#777777",
        colText: "#121212",
        colDanger: "#fa5252",
    },
    {
        name: "JustJot Dark",
        colBg: "#121212",
        colMain: "#0098a9",
        colSub: "#777777",
        colText: "#e0e0e0",
        colDanger: "#fa5252",
    },
    {
        name: "Pura Tela",
        colBg: "#E3E0D6",
        colMain: "#1AC4F5",
        colSub: "#323740",
        colText: "#232042",
        colDanger: "#bb474f",
    },
] as const

export type ThemeName = (typeof themes)[number]["name"]

export type ThemeColors = Omit<(typeof themes)[number], "name">
