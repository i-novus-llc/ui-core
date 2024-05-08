import { FileInfo, FileUploadError, FileUploadInProgress, FileUploadSuccess } from './types'

export const formatFileSize = (bytes: number) => {
    const binaryThousand = 1024
    const sizes = ['Байт', 'Кб', 'Мб', 'Гб']
    const i = Math.floor(Math.log(bytes) / Math.log(binaryThousand))

    if (bytes === 0) { return 0 }

    return `${Math.round((bytes / binaryThousand ** i) * 10) / 10} ${sizes[i]}`
}

export const isSameOrigin = (url1: string, url2: string) => {
    try {
        const firstUrl = new URL(url1)
        const secondUrl = new URL(url2)

        return firstUrl.origin === secondUrl.origin
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false
    }
}

export const isUploadError = (file: FileInfo): file is FileUploadError => {
    return (file as FileUploadError).error !== undefined
}

export const isUploadSuccess = (file: FileInfo): file is FileUploadSuccess => {
    return (file as FileUploadSuccess).url !== undefined
}

export const isUploadInProgress = (file: FileInfo): file is FileUploadInProgress => {
    return (file as FileUploadInProgress).progress !== undefined
}
