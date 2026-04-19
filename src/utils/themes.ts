const originalThemes = [
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

/**
 * Theme definitions adapted from Monkey Type
 * Source: https://github.com/monkeytypegame/monkeytype
 * License: GNU General Public License v3 (GPLv3)
 * Credits to Monkey Type contributors
 */
const adaptedThemes = [
    {
        name: "Pale Nimbus",
        colBg: "#433e4c",
        colMain: "#94ffc2",
        colSub: "#ffaca3",
        colText: "#feffdb",
        colDanger: "#ff5c5c",
    },
] as const

export const themes = [
    ...originalThemes,
    ...adaptedThemes,
] as const

export type ThemeName = (typeof themes)[number]["name"]
