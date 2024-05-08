import { ChangeEvent, FC, useCallback, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'
import { Button } from '../general/Button'
import { Icon } from '../data-display/Icon'

interface FilePickerProps extends ComponentBaseProps {
    accept?: string[],
    description?: string
    label?: string,
    multiple?: boolean,
    onChange(files: File[], event: ChangeEvent<HTMLInputElement>): void
}

const DEFAULT_HEIGHT = 150

export const FilePicker: FC<FilePickerProps> = ({ prefix, className, description, label,
    onChange, accept = [], disabled = false, multiple = false }) => {
    const contentRef = useRef(null)
    const [height, setHeight] = useState(DEFAULT_HEIGHT)

    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    const [isDrag, setIsDrag] = useState(false)
    const nativeInputRef = useRef<HTMLInputElement>(null)

    const handleFileInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { files: filesList } = event.target

        if (!filesList || filesList.length === 0) { return }

        const files: File[] = [...filesList]

        onChange(files, event)
        if (nativeInputRef.current) {
            nativeInputRef.current.value = ''
        }
    }, [onChange])

    const handleUploadButtonClick = useCallback(() => {
        const { current } = nativeInputRef

        if (!current) { return }

        current.click()
    }, [nativeInputRef])

    const handleDragOver = useCallback(() => {
        setIsDrag(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDrag(false)
    }, [])

    useLayoutEffect(() => {
        if (contentRef?.current) {
            setHeight((contentRef.current as HTMLDivElement).getBoundingClientRect()?.height || DEFAULT_HEIGHT)
        }
    }, [contentRef])

    return (
        <div className={classNames(`${prefixCls}-file-picker`, isDrag && `${prefixCls}-file-picker__drag`, disabled && `${prefixCls}-file-picker__disabled`, className)} style={{ height }}>
            <input
                ref={nativeInputRef}
                type="file"
                multiple={multiple}
                accept={accept.join(',')}
                disabled={disabled}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDragLeave}
                onChange={handleFileInputChange}
            />
            <svg width="100%" height="100%">
                <rect width="100%" height="100%" x="2" y="2" rx="8" ry="8" />
            </svg>
            <div ref={contentRef} className={`${prefixCls}-file-picker_drop-area`}>
                <span className={`${prefixCls}-file-picker_description`}>{description || 'Перетащите файлы или выберите на компьютере'}</span>
                <Button className={`${prefixCls}-file-picker_button`} disabled={disabled} variant="link" onClick={handleUploadButtonClick}>
                    <Icon icon="common-add" />
                    {label || 'Выбрать файл'}
                </Button>
            </div>
        </div>
    )
}

FilePicker.displayName = 'FilePicker'
