import { FC, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'
import { Button, ButtonVariants } from '../../general/Button'

export interface FooterProps extends ComponentBaseProps, HTMLAttributes<HTMLDivElement> {
    cancelText?: string,
    cancelVariant?: ButtonVariants,
    disabled?: boolean,
    okText?: string,
    okVariant?: ButtonVariants
    onCancel?(): void,
    onOk?(): void
}

export const Footer: FC<FooterProps> = ({
    prefix,
    className,
    children,
    onCancel,
    onOk,
    okVariant = 'link' as ButtonVariants,
    cancelVariant = 'link' as ButtonVariants,
    okText = 'Применить',
    cancelText = 'Отменить',
    disabled = false,
    ...rest
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div className={classNames(`${prefixCls}-popover-footer`, className)} {...rest}>
            {children}

            {(onCancel || onOk) && (
                <div className={`${prefixCls}-popover-actions`}>
                    {onCancel && (
                        <Button
                            variant={cancelVariant}
                            onClick={onCancel}
                            disabled={disabled}
                        >
                            {cancelText}
                        </Button>
                    )}

                    {onOk && (
                        <Button
                            variant={okVariant}
                            disabled={disabled}
                            onClick={onOk}
                        >
                            {okText}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

Footer.displayName = 'PopoverFooter'
