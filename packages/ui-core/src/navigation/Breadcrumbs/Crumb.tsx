import { FC, PropsWithChildren } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'
import { Link } from '../../general/Typography/Link'

export interface CrumbTagProps extends ComponentBaseProps { to: string }

export interface CrumbProps extends ComponentBaseProps {
    path: string
    tag?: FC<CrumbTagProps>
}

export const Crumb: FC<PropsWithChildren<CrumbProps>> = ({
    children,
    path,
    prefix,
    style,
    className,
    disabled = false,
    tag: Tag = Link,
    visible = true,
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    if (!children || !visible) {
        return null
    }

    return (
        <Tag
            style={style}
            className={classNames(className, `${prefixCls}-crumb`, {
                [`${prefixCls}-crumb_disabled`]: !path || disabled,
            })}
            to={path}
            disabled={!path || disabled}
        >
            {children}
        </Tag>
    )
}

Crumb.displayName = 'Crumb'
