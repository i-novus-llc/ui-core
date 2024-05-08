import { forwardRef } from 'react'
import RcSwitch, { SwitchChangeEventHandler } from 'rc-switch'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'

export interface SwitchProps extends ComponentBaseProps {
    checked?: boolean
    defaultChecked?: boolean
    onChange?: SwitchChangeEventHandler
    visible?: boolean
}

export const Switch = forwardRef<HTMLDivElement, SwitchProps>((props, ref) => {
    const {
        className,
        checked,
        defaultChecked,
        onChange,
        children,
        visible = true,
        prefix,
        disabled = false,
        style,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    if (!visible) {
        return null
    }

    return (
        <div className={classNames(`${prefixCls}-switch-wrapper`, className)} style={style}>
            <RcSwitch
                {...restProps}
                prefix={prefixCls}
                prefixCls={`${prefixCls}-switch`}
                ref={ref as any}
                checked={checked}
                defaultChecked={defaultChecked}
                disabled={disabled}
                onChange={onChange}
            />

            {children && (
                <span className={classNames(`${prefixCls}-switch-label`)}>
                    {children}
                </span>
            )}
        </div>
    )
})

Switch.displayName = 'Switch'
