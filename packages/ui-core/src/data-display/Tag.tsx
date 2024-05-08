import { forwardRef, HTMLAttributes, ReactNode, useState, MouseEvent } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider, CloseIcon } from '../core'
import { Typography } from '../general/Typography'
import { Button } from '../general/Button'

import { Icon } from './Icon'

export interface TagProps extends ComponentBaseProps, Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    closeIcon?: ReactNode,
    disabled?: boolean,
    label: ReactNode,
    onClose?(evt: MouseEvent<HTMLElement>): void,
    onSelect?(selected: boolean): void,
    selected?: boolean
}

export const Tag = forwardRef<HTMLDivElement, TagProps>((props, ref) => {
    const {
        className,
        prefix,
        label,
        closeIcon = <CloseIcon />,
        selected,
        onSelect,
        onClose,
        children,
        visible = true,
        disabled = false,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [selectedInternal, setSelectedInternal] = useState(selected || false)
    const [visibleInternal, setVisibleInternal] = useState(visible)

    const onTagSelect = () => {
        setSelectedInternal((prevState) => {
            onSelect?.(!prevState)

            return !prevState
        })
    }

    const onTagClose = (evt: MouseEvent<HTMLElement>) => {
        setVisibleInternal((prevState) => {
            onClose?.(evt)

            return !prevState
        })
    }

    if (!visibleInternal) {
        return null
    }

    return (
        <div
            {...restProps}
            role="presentation"
            ref={ref}
            className={classNames(`${prefixCls}-tag`, {
                [`${prefixCls}-tag_selectable`]: Boolean(onSelect),
                [`${prefixCls}-tag_selected`]: selectedInternal,
            }, className)}
            {...(Boolean(onSelect) && { onClick: onTagSelect })}
        >
            <Typography.Text className={`${prefixCls}-tag__label`}>{label}</Typography.Text>

            {children}

            {Boolean(onClose) && (
                <div className={`${prefixCls}-tag_actions`}>
                    <Button
                        disabled={disabled}
                        onClick={onTagClose}
                        variant="link"
                        className="btn-xs"
                        icon={<Icon icon={closeIcon} className={classNames(`${prefixCls}-tag__close-icon`)} />}
                    />
                </div>
            )}
        </div>
    )
})
