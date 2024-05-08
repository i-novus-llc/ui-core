interface FileItem {
    date?: string,
    id: string,
    name: string,
    size: number
    type: string
}

export interface FileUploadError extends FileItem { error: string }
export interface FileUploadSuccess extends FileItem { url: string }
export interface FileUploadInProgress extends FileItem { progress: number }

export type FileInfo = FileUploadError | FileUploadSuccess | FileUploadInProgress
