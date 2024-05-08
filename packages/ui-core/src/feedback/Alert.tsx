import { FC, ReactNode } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'

interface AlertProps extends ComponentBaseProps {
    closeButton?: ReactNode,
    onClick?(): void,
    prefixIcon?: ReactNode,
    text?: ReactNode,
    title?: ReactNode
}

export const Alert: FC<AlertProps> = ({
    title,
    text,
    className,
    style,
    prefixIcon,
    prefix,
    children,
    closeButton,
    onClick,
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div role="presentation" className={classNames(`${prefixCls}-alert`, className)} style={style} onClick={onClick}>
            {prefixIcon}

            {(text || title) && (
                <div className={`${prefixCls}-alert__content`}>
                    {title && (
                        <span className={classNames(`${prefixCls}-alert__title`)}>
                            {title}
                        </span>
                    )}

                    {text && (
                        <span className={classNames(`${prefixCls}-alert__text`)}>{text}</span>
                    )}
                </div>
            )}

            {children}

            {closeButton && (
                <div className={`${prefixCls}-alert__close`}>
                    {closeButton}
                </div>
            )}
        </div>
    )
}
