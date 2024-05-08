import { forwardRef, ReactNode } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'
import { Typography } from '../general/Typography'

interface StatusProps extends Omit<ComponentBaseProps, 'children'> {
    color?: string,
    label: ReactNode,
    to?: string
}

export const Status = forwardRef<HTMLDivElement, StatusProps>((props, ref) => {
    const { color, label, to, className, prefix, style } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div ref={ref} className={classNames(`${prefixCls}-status`, className)} style={{ ...style, backgroundColor: color }}>
            <span className={`${prefixCls}-status__content`}>
                {to
                    ? <Typography.Link to={to} target="_blank" fontSize={12}>{label}</Typography.Link>
                    : label}
            </span>
        </div>
    )
})

Status.displayName = 'Status'
