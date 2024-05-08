import { FC, ReactElement, cloneElement, isValidElement, Children, ReactNode, CSSProperties } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'

export interface FieldProps extends Omit<ComponentBaseProps, 'children'> {
    children?: ReactElement,
    error?: string,
    errorStyle?: CSSProperties,
    inputStyle?: CSSProperties,
    label?: ReactNode,
    labelClassName?: string,
    labelPosition?: 'left' | 'top-left',
    labelStyle?: CSSProperties,
    required?: boolean
}

export const Field: FC<FieldProps> = ({
    prefix,
    className,
    style,
    label,
    required = false,
    children,
    error,
    labelStyle,
    labelPosition = 'top-left',
    labelClassName,
    errorStyle,
    inputStyle,
    visible = true,
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    if (!isValidElement(children) || !visible) {
        return null
    }

    return (
        <div
            style={style}
            className={classNames(
                `${prefixCls}-field`,
                {
                    [`${prefixCls}-field_required`]: required,
                    [`${prefixCls}-field_label_${labelPosition}`]: Boolean(label),
                    [`${prefixCls}-field_error`]: Boolean(error),
                },
                className,
            )}
        >

            {label && (
                <span className={classNames(`${prefixCls}-field__label`, labelClassName)} style={labelStyle}>{label}</span>
            )}

            {error && (
                <span className={`${prefixCls}-field__error`} style={errorStyle}>{error}</span>
            )}

            {Children.map(children, (child) => {
                if (child && typeof child === 'object' && Object.hasOwn(child, 'props')) {
                    const childInput = (child as ReactElement)

                    return cloneElement(childInput, {
                        ...childInput.props,
                        error,
                        required,
                        className: classNames(`${prefixCls}-field__control`, childInput.props?.className),
                        style: { ...childInput.props?.style, ...inputStyle },
                    })
                }

                return null
            })}
        </div>
    )
}

Field.displayName = 'Field'
