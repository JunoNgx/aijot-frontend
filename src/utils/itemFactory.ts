import { DateTime } from "luxon"
import { v4 as uuidv4 } from "uuid"
import type { Item, MainInputCreationData } from "@/types"

export function buildDemoItems(): Item[] {
    const base = DateTime.now()
    const at = (minutesAgo: number) => base.minus({ minutes: minutesAgo }).toISO()
    return [
        {
            id: uuidv4(),
            type: "link",
            content: "https://www.mozilla.org/en-US/",
            title: "Mozilla",
            tags: ["organisation", "web", "pretty"],
            createdAt: at(12),
            jottedAt: at(12),
            updatedAt: at(12),
        },
        {
            id: uuidv4(),
            type: "link",
            content: "https://xkcd.com/",
            title: "xkcd",
            tags: ["fun"],
            createdAt: at(11),
            jottedAt: at(11),
            updatedAt: at(11),
        },
        {
            id: uuidv4(),
            type: "link",
            content:
                "https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values",
            title: "Keyboard code reference",
            tags: ["work", "programming", "web"],
            createdAt: at(10),
            jottedAt: at(10),
            updatedAt: at(10),
        },
        {
            id: uuidv4(),
            type: "link",
            content: "https://fredrocha.net/2025/05/21/small-web-is-beautiful/",
            title: "Small (web) is beautiful",
            tags: ["small-web", "essay", "goodread", "web"],
            createdAt: at(9),
            jottedAt: at(9),
            updatedAt: at(9),
        },
        {
            id: uuidv4(),
            type: "text",
            title: "Hexcode validator func",
            content: `export const isValidHexColourCode = (str: string): boolean => {
    const hexColourCodeRegEx = /(^#[A-Fa-f0-9]{6}$)/;
    return hexColourCodeRegEx.test(str);
}`,
            tags: ["work", "web", "programming"],
            createdAt: at(8),
            jottedAt: at(8),
            updatedAt: at(8),
        },
        {
            id: uuidv4(),
            type: "todo",
            content: "Submit PR to fix keyboard shortcut",
            tags: ["work", "programming"],
            isDone: false,
            createdAt: at(7),
            jottedAt: at(7),
            updatedAt: at(7),
        },
        {
            id: uuidv4(),
            type: "text",
            title: "Carian Knight build",
            content: `Lvl: 150
Astrologer

VIG 60
MIN 31
END 20
STR 10
DEX 12
INT 80
FAI 7
ARC 9`,
            tags: ["er"],
            createdAt: at(6),
            jottedAt: at(6),
            updatedAt: at(6),
        },
        {
            id: uuidv4(),
            type: "todo",
            content: "Try Quadrilateral Cowboy",
            tags: [],
            isDone: false,
            createdAt: at(5),
            jottedAt: at(5),
            updatedAt: at(5),
        },
        {
            id: uuidv4(),
            type: "todo",
            content: "Buy bacon",
            tags: ["chore"],
            isDone: true,
            createdAt: at(4),
            jottedAt: at(4),
            updatedAt: at(4),
        },
        {
            id: uuidv4(),
            type: "todo",
            content: "Refill toilet supplies",
            tags: ["chore"],
            isDone: true,
            createdAt: at(3),
            jottedAt: at(3),
            updatedAt: at(3),
        },
        {
            id: uuidv4(),
            type: "todo",
            content: "Get Carian Slicer",
            tags: ["er"],
            isDone: false,
            createdAt: at(2),
            jottedAt: at(2),
            updatedAt: at(2),
        },
        {
            id: uuidv4(),
            type: "todo",
            content: "Get Sword Dance",
            tags: ["er"],
            isDone: false,
            createdAt: at(1),
            jottedAt: at(1),
            updatedAt: at(1),
        },
    ]
}

export function buildItem(creationData: MainInputCreationData): Item {
    const now = DateTime.now().toISO()
    return {
        id: uuidv4(),
        createdAt: now,
        jottedAt: now,
        updatedAt: now,
        tags: creationData.tags,
        type: creationData.itemType,
        content: creationData.content,
        title: creationData.title,
    }
}
