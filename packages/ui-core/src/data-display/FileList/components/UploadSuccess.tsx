import { FC, useCallback, useState, useMemo } from 'react'
import classNames from 'classnames'

import { Button } from '../../../general/Button'
import { Spin } from '../../../feedback/Spin'
import { useConfigProvider } from '../../../core'
import { Divider } from '../../../layout/Divider'
import { Icon } from '../../Icon'
import { FileUploadSuccess } from '../types'
import { formatFileSize, isSameOrigin } from '../utils'

interface UploadSuccessProps {
    file: FileUploadSuccess
    onRemove?(file: FileUploadSuccess): void
    prefix?: string,
    readOnly?: boolean
}

const CAN_OPEN_FILES = ['png', 'jpg', 'pdf']
let abortController = new AbortController()

const enum FileOperation {
    download = 'download',
    open = 'open',
}

export const UploadSuccess: FC<UploadSuccessProps> = ({ file, prefix, onRemove, readOnly }) => {
    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    const [disabledDownload, setDisabledDownload] = useState(false)

    const onRemoveFile = useCallback(() => {
        if (onRemove) {
            onRemove(file)
        }
    }, [file, onRemove])

    const sendRequest = useCallback((operationType: FileOperation) => {
        abortController = new AbortController()
        setDisabledDownload(true)
        fetch(file.url, {
            signal: abortController.signal,
        }).then(response => response.blob()).then((blob) => {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')

            switch (operationType) {
                case FileOperation.open:
                    window.open(url)

                    break
                case FileOperation.download:
                default:

                    link.download = file.name
                    link.href = url
                    link.click()

                    break
            }
        }).catch((error) => {
            console.error(error)
        })
            .finally(() => {
                setDisabledDownload(false)
            })
    }, [file])

    const onDownloadFile = useCallback(() => {
        if (isSameOrigin(file.url, window.location.toString())) {
            const link = document.createElement('a')

            link.download = `${file.name}.${file.type}`
            link.href = file.url
            link.click()
        } else {
            sendRequest(FileOperation.download)
        }
    }, [file, sendRequest])

    const onAbortDownloadFile = useCallback(() => {
        abortController.abort()
    }, [])

    const onOpenFile = useCallback(() => {
        sendRequest(FileOperation.open)
    }, [sendRequest])

    const formatIcon = useMemo(() => {
        switch (file.type) {
            case 'docx': {
                return 'format-doc'
            }

            case 'xlsx': {
                return 'format-xls'
            }

            case 'pptx': {
                return 'format-ppt'
            }

            default: {
                return `format-${file.type}`
            }
        }
    }, [file.type])

    return (
        <div className={`${prefixCls}-file-list-item_wrapper`}>
            <div className={`${prefixCls}-file-list-item`}>
                <Icon
                    className={classNames(`${prefixCls}-file-list-item_icon`, `${prefixCls}-file-list-item_icon__success`)}
                    icon={formatIcon}
                />
                <span className={`${prefixCls}-file-list-item`}>{file.name}</span>
                <Divider variant="vertical" />
                <span className={`${prefixCls}-file-list-item_size`}>{formatFileSize(file.size)}</span>
                {file.date && <span className={`${prefixCls}-file-list-item_date`}>{file.date}</span>}
                {!readOnly &&
                    (
                        <Button
                            className={classNames(`${prefixCls}-file-list-item_button`, `${prefixCls}-file-list-item_action`)}
                            variant="link-delete"
                            onClick={onRemoveFile}
                        >
                            Удалить
                        </Button>
                    )}
            </div>
            <div className={`${prefixCls}-file-list-item_actions`}>
                {CAN_OPEN_FILES.includes(file.type) &&
                    (
                        <Button
                            variant="link"
                            className={`${prefixCls}-file-list-item_button`}
                            onClick={onOpenFile}
                        >
                            Смотреть
                        </Button>
                    )}
                <Button
                    variant="link"
                    className={`${prefixCls}-file-list-item_button`}
                    onClick={onDownloadFile}
                    disabled={disabledDownload}
                >
                    Скачать
                </Button>
                {disabledDownload && (
                    <div className={`${prefixCls}-file-list-item_button`}>
                        <Spin className={`${prefixCls}-file-list-item_spin`} />
                        <Button
                            variant="link"
                            className={`${prefixCls}-file-list-item_button`}
                            onClick={onAbortDownloadFile}
                        >
                            <Icon icon="common-close" className={`${prefixCls}-file-list-item_icon__error`} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
