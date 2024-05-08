import React from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'
import { Icon } from '../Icon'

export interface PopoverHeaderProps extends ComponentBaseProps {
    onClose?(): void
    showCloseButton?: boolean
    underline?: boolean
}

export const Header = ({ prefix, showCloseButton = false, underline = false,
    onClose, className, children, style }: PopoverHeaderProps) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div
            style={style}
            className={classNames(`${prefixCls}-popover-header`, underline && `${prefixCls}-popover-header-underline`, className)}
        >
            {children && <span className={`${prefixCls}-popover-header-content`}>{children}</span>}
            {showCloseButton && (
                <button
                    type="button"
                    className={`${prefixCls}-popover-close`}
                    onClick={onClose}
                >
                    <Icon icon="common-close" />
                </button>
            )}
        </div>
    )
}

Header.displayName = 'PopoverHeader'
