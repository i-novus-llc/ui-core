import { FC, useCallback } from 'react'
import classNames from 'classnames'

import { Button } from '../../../general/Button'
import { useConfigProvider } from '../../../core'
import { Icon } from '../../Icon'
import { FileUploadError } from '../types'

interface UploadErrorProps {
    file: FileUploadError
    onRemove(file: FileUploadError): void
    prefix?: string,
}

export const UploadError: FC<UploadErrorProps> = ({ file, prefix, onRemove }) => {
    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    const onRemoveFile = useCallback(() => {
        onRemove(file)
    }, [file, onRemove])

    return (
        <div className={`${prefixCls}-file-list-item_wrapper`}>
            <div className={classNames(`${prefixCls}-file-list-item`, `${prefixCls}-file-list-item__error`)}>
                <Icon
                    className={classNames(`${prefixCls}-file-list-item_icon`, `${prefixCls}-file-list-item_icon__error`)}
                    icon="format-error"
                />
                <span className={`${prefixCls}-file-list-item`}>Ошибка при загрузке файла</span>
                <Button
                    className={classNames(`${prefixCls}-file-list-item_button`, `${prefixCls}-file-list-item_action`)}
                    variant="link-delete"
                    onClick={onRemoveFile}
                >
                    Удалить
                </Button>
            </div>
            <div className={`${prefixCls}-file-list_item-sub`}>
                {file.error || 'Попробуйте загрузить другой файл'}
            </div>
        </div>
    )
}
