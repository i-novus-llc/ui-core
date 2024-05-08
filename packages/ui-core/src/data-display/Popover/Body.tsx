import {
    cloneElement,
    forwardRef,
    PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import classNames from 'classnames'

import { useConfigProvider } from '../../core'
import { Tooltip } from '../Tooltip'
import { getActiveElement } from '../../utils/get-active-dom-node'

import { PopoverProps } from './types'

const DEFAULT_GET_CONTAINER = () => document?.body

export const Body = forwardRef<HTMLDivElement, PropsWithChildren<PopoverProps>>((props, ref) => {
    const {
        components,
        open: openExternal = false,
        visible = true,
        onOpenChange: setIsOpenExternal,
        onClose: onCloseExternal,
        prefix,
        children,
        className,
        childrenWrapperClassName,
        trigger = 'click',
        size = 'sm',
        getContainer = DEFAULT_GET_CONTAINER,
        disabled = false,
        readOnly = false,
        afterShow,
        afterHide,
        returnFocusRef,
        onCaptureSetFocusAfterTabKeyDown,
        ...restProps
    } = props

    const { Header, Content, Footer } = components

    const trapContainerRef = useRef<HTMLDivElement>(null)

    const { getPrefix, root } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [openInternal, setOpenInternal] = useState(openExternal)
    const hasExternalOpenProp = 'open' in props

    const onOpenChangeInternal = useCallback((open: boolean) => {
        if (disabled || readOnly) {
            return
        }

        if (!hasExternalOpenProp) {
            setOpenInternal(open)
        }

        setIsOpenExternal?.(open)
    }, [disabled, hasExternalOpenProp, readOnly, setIsOpenExternal])

    const onCloseInternal = useCallback(() => {
        onOpenChangeInternal(false)
        onCloseExternal?.()
    }, [onCloseExternal, onOpenChangeInternal])

    useEffect(() => {
        setOpenInternal(openExternal)

        if (!openExternal && trapContainerRef.current?.contains(getActiveElement())) {
            returnFocusRef?.current?.focus()
        }
    }, [openExternal, returnFocusRef])

    return (
        <Tooltip
            {...restProps}
            ref={ref}
            afterShow={afterShow}
            afterHide={afterHide}
            visible={visible}
            className={classNames(root, `${prefixCls}-popover-default`, `${prefixCls}-popover_${size}`, className)}
            childrenWrapperClassName={childrenWrapperClassName}
            content={(
                <div ref={trapContainerRef} tabIndex={-1}>
                    {Header && cloneElement(Header, { onClose: onCloseInternal })}
                    {Content}
                    {Footer}
                </div>
            )}
            isOpen={openInternal}
            setIsOpen={onOpenChangeInternal}
            getContainer={getContainer}
            openOnClick={trigger === 'click'}
            clickable
            noArrow
        >
            {children}
        </Tooltip>
    )
})
