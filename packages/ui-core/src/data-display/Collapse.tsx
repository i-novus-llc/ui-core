import { forwardRef, HTMLAttributes, ReactNode, SyntheticEvent, useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'

import { Icon } from './Icon'

export interface CollapseProps extends ComponentBaseProps, HTMLAttributes<HTMLDivElement> {
    arrowPosition?: 'left' | 'right',
    contentIndented?: boolean,
    header: ReactNode
    icon?: ReactNode,
    onToggle?(open: boolean, event: SyntheticEvent): void,
    open?: boolean
    forceRender?: boolean
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>((props, ref) => {
    const {
        className,
        children,
        header,
        open: openExternal,
        onToggle: onToggleExternal,
        visible = true,
        arrowPosition = 'left',
        contentIndented = true,
        icon,
        prefix,
        forceRender = false,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [openInternal, setOpenInternal] = useState(false)

    const onToggleInternal = useCallback(() => {
        setOpenInternal(prev => !prev)
    }, [])

    const open = useMemo(() => {
        if (typeof openExternal !== 'undefined' && typeof onToggleExternal !== 'undefined') {
            return openExternal
        }

        return openInternal
    }, [openExternal, openInternal, onToggleExternal])

    const onToggle = useMemo(() => {
        if (typeof openExternal !== 'undefined' && typeof onToggleExternal !== 'undefined') {
            return (event: SyntheticEvent) => onToggleExternal(openExternal, event)
        }

        return onToggleInternal
    }, [openExternal, onToggleInternal, onToggleExternal])

    if (!visible) {
        return null
    }

    return (
        <div
            ref={ref}
            className={classNames(`${prefixCls}-collapse`, className, {
                [`${prefixCls}-collapse_expanded`]: open,
                [`${prefixCls}-collapse_indented`]: contentIndented,
                [`${prefixCls}-collapse_arrow-right`]: arrowPosition === 'right',
            })}
            {...restProps}
        >
            <div
                role="presentation"
                className={`${prefixCls}-collapse__header`}
                onClick={onToggle}
            >
                <div className={`${prefixCls}-collapse__arrow`}>
                    {icon && <Icon icon={icon} />}
                </div>

                {header}
            </div>

            {(open || forceRender) && (
                <div
                    className={`${prefixCls}-collapse__panel`}
                    style={forceRender && !open ? { display: 'none' } : undefined}
                >
                    {children}
                </div>
            )}
        </div>
    )
})

Collapse.displayName = 'Collapse'
