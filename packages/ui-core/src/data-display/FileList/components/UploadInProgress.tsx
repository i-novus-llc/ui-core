import { FC, useCallback } from 'react'
import classNames from 'classnames'

import { Button } from '../../../general/Button'
import { useConfigProvider } from '../../../core'
import { Spin } from '../../../feedback/Spin'
import { Divider } from '../../../layout/Divider'
import { FileUploadInProgress } from '../types'

interface UploadInProgressProps {
    file: FileUploadInProgress
    onCancel?(file: FileUploadInProgress): void
    prefix?: string,
}

export const UploadInProgress: FC<UploadInProgressProps> = ({ file, prefix, onCancel }) => {
    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    const onCancelLoadFile = useCallback(() => {
        if (onCancel) {
            onCancel(file)
        }
    }, [file, onCancel])

    return (
        <div className={classNames(`${prefixCls}-file-list-item`, `${prefixCls}-file-list-item__progress`)}>
            <Spin className={`${prefixCls}-file-list-item_spin`} />
            <span className={`${prefixCls}-file-list-item`}>{file.name}</span>
            <Divider variant="vertical" />
            <span className={`${prefixCls}-file-list-item_status`}>загружается...</span>
            <Button
                className={classNames(`${prefixCls}-file-list-item_button`, `${prefixCls}-file-list-item_action`)}
                variant="link"
                onClick={onCancelLoadFile}
            >
                Отменить
            </Button>
        </div>
    )
}
