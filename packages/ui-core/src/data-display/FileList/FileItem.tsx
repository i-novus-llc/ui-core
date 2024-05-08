import { FC, useCallback } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { UploadError } from './components/UploadError'
import { UploadInProgress } from './components/UploadInProgress'
import { UploadSuccess } from './components/UploadSuccess'
import { FileInfo, FileUploadError, FileUploadInProgress, FileUploadSuccess } from './types'
import { isUploadError, isUploadInProgress, isUploadSuccess } from './utils'

interface FileItemProps extends ComponentBaseProps {
    file: FileUploadError | FileUploadSuccess | FileUploadInProgress
    onCancelLoad?(file: FileInfo): void
    onRemove?(file: FileInfo): void
    readOnly?: boolean
}

export const FileItem: FC<FileItemProps> = ({ file, onCancelLoad, onRemove, visible = true,
    className, children, prefix, style, readOnly }) => {
    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    const onCancelLoadFile = useCallback(() => {
        if (onCancelLoad) {
            onCancelLoad(file)
        }
    }, [onCancelLoad, file])

    const onRemoveFile = useCallback(() => {
        if (onRemove) {
            onRemove(file)
        }
    }, [onRemove, file])

    if (!visible) {
        return null
    }

    if (isUploadError(file)) {
        return <UploadError prefix={prefix} file={file} onRemove={onRemoveFile} />
    }

    if (isUploadInProgress(file)) {
        return <UploadInProgress prefix={prefix} file={file} onCancel={onCancelLoadFile} />
    }

    if (isUploadSuccess(file) || readOnly) {
        return <UploadSuccess file={file} onRemove={onRemoveFile} readOnly={readOnly} />
    }

    return (
        <div className={classNames(`${prefixCls}-file-list-item`, className)} style={style}>
            {children}
        </div>
    )
}
