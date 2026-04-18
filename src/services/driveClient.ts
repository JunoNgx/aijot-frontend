const DRIVE_API = "https://www.googleapis.com/drive/v3"
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3"
const FOLDER_NAME = "aijot"
const FOLDER_MIME = "application/vnd.google-apps.folder"

export const DATA_FILE = "data.json"

export interface DriveFile {
    id: string
    name: string
    modifiedTime: string
}

interface DriveFileList {
    files: DriveFile[]
}

function authHeader(token: string): HeadersInit {
    return { Authorization: `Bearer ${token}` }
}

async function expectOk(response: Response): Promise<Response> {
    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Drive API error ${response.status}: ${text}`)
    }
    return response
}

function buildMultipart(
    metadata: Record<string, unknown>,
    content: string,
): { body: string; boundary: string } {
    const boundary = "aijot_boundary"
    const body = [
        `--${boundary}`,
        "Content-Type: application/json; charset=UTF-8",
        "",
        JSON.stringify(metadata),
        `--${boundary}`,
        "Content-Type: application/json",
        "",
        content,
        `--${boundary}--`,
    ].join("\r\n")
    return { body, boundary }
}

export async function getOrCreateAijotFolder(token: string): Promise<string> {
    const query = encodeURIComponent(
        `name='${FOLDER_NAME}' and mimeType='${FOLDER_MIME}' and trashed=false`,
    )
    const listRes = await expectOk(
        await fetch(`${DRIVE_API}/files?q=${query}&fields=files(id)`, {
            headers: authHeader(token),
        }),
    )
    const { files } = (await listRes.json()) as DriveFileList

    if (files.length > 0) return files[0].id

    const createRes = await expectOk(
        await fetch(`${DRIVE_API}/files`, {
            method: "POST",
            headers: {
                ...authHeader(token),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: FOLDER_NAME, mimeType: FOLDER_MIME }),
        }),
    )
    const folder = (await createRes.json()) as DriveFile
    return folder.id
}

export async function findFile(
    token: string,
    folderId: string,
    name: string,
): Promise<DriveFile | null> {
    const query = encodeURIComponent(
        `name='${name}' and '${folderId}' in parents and trashed=false`,
    )
    const res = await expectOk(
        await fetch(
            `${DRIVE_API}/files?q=${query}&fields=files(id,name,modifiedTime)`,
            { headers: authHeader(token) },
        ),
    )
    const { files } = (await res.json()) as DriveFileList
    return files.length > 0 ? files[0] : null
}

export async function downloadFile<T>(
    token: string,
    fileId: string,
): Promise<T> {
    const res = await expectOk(
        await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
            headers: authHeader(token),
        }),
    )
    return res.json() as Promise<T>
}

export async function createFile(
    token: string,
    folderId: string,
    name: string,
    data: unknown,
): Promise<void> {
    const { body, boundary } = buildMultipart(
        { name, parents: [folderId] },
        JSON.stringify(data, null, 2),
    )
    await expectOk(
        await fetch(
            `${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`,
            {
                method: "POST",
                headers: {
                    ...authHeader(token),
                    "Content-Type": `multipart/related; boundary=${boundary}`,
                },
                body,
            },
        ),
    )
}

export async function updateFile(
    token: string,
    fileId: string,
    data: unknown,
): Promise<void> {
    const { body, boundary } = buildMultipart({}, JSON.stringify(data, null, 2))
    await expectOk(
        await fetch(
            `${DRIVE_UPLOAD_API}/files/${fileId}?uploadType=multipart`,
            {
                method: "PATCH",
                headers: {
                    ...authHeader(token),
                    "Content-Type": `multipart/related; boundary=${boundary}`,
                },
                body,
            },
        ),
    )
}

export async function upsertFile(
    token: string,
    folderId: string,
    name: string,
    data: unknown,
    knownFileId?: string,
): Promise<void> {
    if (knownFileId) {
        await updateFile(token, knownFileId, data)
        return
    }
    const existingFile = await findFile(token, folderId, name)
    if (existingFile) {
        await updateFile(token, existingFile.id, data)
    } else {
        await createFile(token, folderId, name, data)
    }
}
