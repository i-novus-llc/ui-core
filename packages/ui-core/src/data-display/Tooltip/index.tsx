import { forwardRef, ReactNode, useMemo } from 'react'
import classNames from 'classnames'
import { createPortal } from 'react-dom'
import { v4 as generateId } from 'uuid'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { TooltipController } from './TooltipController'
import { TooltipPlacement, ITooltipProps } from './types'

export interface TooltipProps extends ComponentBaseProps, Omit<ITooltipProps, 'overlay' | 'id' | 'wrapper' | 'activeAnchor' | 'setActiveAnchor'> {
    childrenWrapperClassName?: string,
    content?: ReactNode
    getContainer?(): Element
    placement?: TooltipPlacement
}

const DEFAULT_GET_CONTAINER = () => document?.body

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
    const {
        prefix,
        visible = true,
        placement = 'top',
        children,
        content,
        className,
        childrenWrapperClassName,
        getContainer = DEFAULT_GET_CONTAINER,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    const id = useMemo(() => generateId(), [])

    if (!visible) {
        return null
    }

    return (
        <>
            {!!children && (
                <span
                    data-tooltip-id={id}
                    className={classNames(`${prefixCls}-tooltip__children-wrapper`, childrenWrapperClassName)}
                >
                    {children}
                </span>
            )}

            {createPortal(
                <TooltipController
                    {...restProps}
                    ref={ref}
                    id={id}
                    className={classNames(`${prefixCls}-tooltip`, className)}
                    place={placement}
                >
                    {content}
                </TooltipController>,
                getContainer() || document.body,
            )}
        </>
    )
})

Tooltip.displayName = 'Tooltip'
