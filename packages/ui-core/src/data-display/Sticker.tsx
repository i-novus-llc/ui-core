import classNames from 'classnames'
import { FC } from 'react'

import { ComponentBaseProps, useConfigProvider } from '../core'

export const Sticker: FC<ComponentBaseProps> = ({ className, prefix, children, visible = true, style }) => {
    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    if (!visible) {
        return null
    }

    return (
        <div
            role="presentation"
            className={classNames(`${prefixCls}-sticker`, className)}
            style={style}
        >
            {children}
        </div>
    )
}

Sticker.displayName = 'Sticker'
