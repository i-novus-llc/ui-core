import { FC } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { FileItem } from './FileItem'
import { FileInfo } from './types'

interface FileListProps extends ComponentBaseProps {
    files: FileInfo[],
    onCancelLoad?(file: FileInfo): void,
    onRemove?(file: FileInfo): void,
    readOnly?: boolean
}

export const FileList: FC<FileListProps> = ({ files, onCancelLoad, onRemove, className, visible = true,
    children, prefix, style, readOnly = false }) => {
    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    if (!visible) {
        return null
    }

    return (
        <div className={classNames(`${prefixCls}-file-list`, className)} style={style}>
            {children || files?.map(file => (
                <FileItem
                    key={file.id}
                    file={file}
                    prefix={prefix}
                    onCancelLoad={onCancelLoad}
                    onRemove={onRemove}
                    readOnly={readOnly}
                />
            ))}
        </div>
    )
}
