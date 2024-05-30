import React from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'
import { Icon } from '../Icon'

export interface PopoverHeaderProps extends ComponentBaseProps {
    onClick?(): void
    onClose?(): void
    showCloseButton?: boolean
    underline?: boolean
}

export const Header = ({
    prefix,
    onClick,
    onClose,
    className,
    children,
    style,
    showCloseButton = false,
    underline = false,
}: PopoverHeaderProps) => {
    const { getPrefix } = useConfigProvider()
    const prefixCls = `${getPrefix(prefix)}-popover`

    return (
        <div
            onClick={onClick}
            style={style}
            className={classNames(`${prefixCls}-header`, className, underline && `${prefixCls}-header-underline`)}
        >
            {children && <span className={`${prefixCls}-header-content`}>{children}</span>}
            {showCloseButton && (
                <button type="button" className={`${prefixCls}-close`} onClick={onClose}>
                    <Icon icon="common-close" />
                </button>
            )}
        </div>
    )
}

Header.displayName = 'PopoverHeader'
