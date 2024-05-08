import { FC, ReactNode, useCallback, useState } from 'react'
import classNames from 'classnames'

import { CloseIcon, ComponentBaseProps, useConfigProvider } from '../core'
import { Popover } from '../data-display/Popover'
import { PopoverPlacement, PopoverProps } from '../data-display/Popover/types'
import { Icon } from '../data-display/Icon'

import { Button, ButtonProps, ButtonVariants } from './Button'

const DEFAULT_OFFSET = 7

export interface DropdownButtonProps extends ComponentBaseProps, Omit<ButtonProps, 'content'>, Pick<PopoverProps, 'placement'> {
    content?: ReactNode,
    popoverDescription?: ReactNode,
    popoverProps?: Partial<PopoverProps>,
    popoverTitle?: ReactNode,
    showToggleIcon?: boolean
    titleRowClassName?: string
}

interface TitleRowProps {
    close(): void,
    description?: ReactNode,
    rowClassName?: string,
    title: ReactNode
}

const TitleRow: FC<TitleRowProps> = ({ title, description, close, rowClassName }) => {
    if (!title && !description) { return null }

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div className={rowClassName} onClick={(e) => { e.stopPropagation() }}>
            <section className="content">
                {title && <span className="title">{title}</span>}
                {description && <span className="description">{description}</span>}
            </section>
            <button type='button' aria-label='close' onClick={close}><CloseIcon /></button>
        </div>
    )
}

export const DropdownButton: FC<DropdownButtonProps> = ({
    visible = true,
    placement = 'bottom-start' as PopoverPlacement,
    showToggleIcon = true,
    prefix,
    children,
    content,
    className,
    style,
    popoverTitle,
    popoverDescription,
    titleRowClassName,
    variant = 'link' as ButtonVariants,
    popoverProps,
    onBlur,
    ...rest
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [open, setOpen] = useState(false)

    const close = useCallback(() => { setOpen(false) }, [])

    if (!visible) { return null }

    return (
        <Popover
            offset={DEFAULT_OFFSET}
            closeOnEsc
            {...popoverProps}
            open={open}
            onOpenChange={setOpen}
            placement={placement}
            prefix={prefix}
            components={{
                Content: (
                    <Popover.Content
                        onClick={close}
                        className={`${prefixCls}-dropdown-button__popover`}
                        style={style}
                    >
                        <TitleRow
                            title={popoverTitle}
                            description={popoverDescription}
                            close={close}
                            rowClassName={titleRowClassName}
                        />
                        {content}
                    </Popover.Content>
                ),
            }}
        >
            <Button
                iconPosition='right'
                {...rest}
                prefix={prefix}
                variant={variant}
                className={classNames(`${prefixCls}-dropdown-button`, `${prefixCls}-dropdown-button_${variant}`, className)}
                icon={(
                    <Icon
                        className={classNames(
                            `${prefixCls}-dropdown-button__icon`,
                            open && `${prefixCls}-dropdown-button__icon_open`,
                        )}
                        icon="common-expand-more"
                        visible={showToggleIcon}
                    />
                )}
            >
                {children}
            </Button>
        </Popover>
    )
}
