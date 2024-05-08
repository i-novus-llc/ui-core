import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'

interface IconProps extends Omit<ComponentBaseProps, 'children'>, HTMLAttributes<HTMLSpanElement> {
    icon?: ReactNode
    iconPrefix?: string
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
    const { className, visible = true, icon, iconPrefix: externalIconPrefix, style, ...rest } = props

    const { iconPrefix } = useConfigProvider()

    if (!visible) { return null }

    const prefixCls = externalIconPrefix || iconPrefix

    if (typeof icon === 'string') {
        return <i {...rest} className={classNames(prefixCls, `${prefixCls}-${icon}`, className)} style={style} />
    }

    return (
        <span {...rest} ref={ref} className={classNames(prefixCls, className)} style={style}>
            {icon}
        </span>
    )
})
