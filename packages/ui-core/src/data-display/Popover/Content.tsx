import { FC, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

export const Content: FC<ComponentBaseProps & HTMLAttributes<HTMLDivElement>> = ({
    prefix,
    className,
    children,
    ...rest
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div id="popover" className={classNames(`${prefixCls}-popover-content`, className)} {...rest}>
            {children}
        </div>
    )
}

Content.displayName = 'PopoverContent'
