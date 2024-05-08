import { ButtonHTMLAttributes, forwardRef, ReactNode, useMemo } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'
import { Icon } from '../data-display/Icon'
import { Spin } from '../feedback/Spin'

export type ButtonVariants = 'primary' | 'secondary' | 'delete' | 'link' | 'link-delete' | 'link-cancel' | 'success' | 'warning' | 'info' | 'dark'

export interface ButtonProps extends ComponentBaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
    disabled?: boolean,
    icon?: ReactNode,
    iconPosition?: 'left' | 'right',
    label?: string,
    loading?: boolean
    variant?: ButtonVariants
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        className,
        prefix,
        variant = 'primary',
        icon,
        iconPosition = 'left',
        loading = false,
        visible = true,
        children,
        label,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const buttonIcon = useMemo(() => {
        if (loading) {
            return <Spin delay={0} className={`${prefixCls}-btn__spin`} iconClassName={`${prefixCls}-btn__icon`} />
        }

        if (icon) {
            return <Icon icon={icon} className={`${prefixCls}-btn__icon`} />
        }

        return null
    }, [icon, loading, prefixCls])

    if (!visible) {
        return null
    }

    const buttonComponent = (
        <button
            ref={ref}
            type="button"
            className={classNames(
                `${prefixCls}-btn`,
                `${prefixCls}-btn-${variant}`,
                iconPosition === 'right' && `${prefixCls}-btn_icon_right`,
                className,
            )}
            {...restProps}
        >
            {buttonIcon}
            {children}
        </button>
    )

    if (label) {
        return (
            <div className={`${prefixCls}-btn__content-wrapper`}>
                <span className={`${prefixCls}-btn__label`}>{label}</span>

                {buttonComponent}
            </div>
        )
    }

    return buttonComponent
})

Button.displayName = 'Button'
