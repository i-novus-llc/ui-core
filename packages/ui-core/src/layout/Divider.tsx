import { FC } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'

interface DividerProps extends Omit<ComponentBaseProps, 'children'> {
    dotted?: boolean
    variant?: 'vertical' | 'horizontal'
}

export const Divider: FC<DividerProps> = ({ dotted = false, variant = 'horizontal', className, style, prefix, visible = true }) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    if (!visible) {
        return null
    }

    return (
        <hr
            className={classNames(`${prefixCls}-divider`, `${prefixCls}-divider_${variant}`, dotted && `${prefixCls}-divider_dotted`, className)}
            style={style}
        />
    )
}

Divider.displayName = 'Divider'
