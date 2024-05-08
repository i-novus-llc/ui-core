import { ChangeEvent, forwardRef, useMemo, useState } from 'react'
import classNames from 'classnames'

import { useConfigProvider } from '../../core'

import { RadioProps } from './index.types'
import { useRadioGroupContext } from './RadioGroup'
import { createUniqueId } from './helpers'

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
    const {
        children,
        prefix,
        id: optionId,
        className,
        onChange,
        visible = true,
        style,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [inputId] = useState(createUniqueId('input-'))
    const radioPrefix = useMemo(() => `${prefixCls}-radio`, [prefixCls])

    const groupContext = useRadioGroupContext()

    const radioProps: Partial<RadioProps> = {
        ...restProps,
        name: groupContext.name || restProps.name,
        disabled: restProps.disabled || groupContext.disabled,
        checked: optionId === (groupContext.value || groupContext.defaultValue),
        readOnly: restProps.readOnly || groupContext.readOnly,
    }

    const onRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(optionId, event)
        groupContext?.onChange?.(optionId, event)
    }

    const labelClassName = useMemo(() => {
        return classNames(radioPrefix, `${radioPrefix}-label`, {
            [`${radioPrefix}_readonly`]: radioProps.readOnly,
            [`${radioPrefix}_disabled`]: radioProps.disabled,
            [`${radioPrefix}_checked`]: radioProps.checked,
            [`${radioPrefix}_unchecked`]: !radioProps.checked,
        }, className)
    }, [radioProps.checked, className, radioProps.disabled, radioPrefix, radioProps.readOnly])

    if (!visible) { return null }

    return (
        <label
            className={labelClassName}
            htmlFor={inputId}
            style={style}
        >
            <div className={`${radioPrefix}__input-wrapper`}>
                <input
                    {...radioProps}
                    id={inputId}
                    type="radio"
                    ref={ref}
                    className={`${radioPrefix}__input`}
                    disabled={(radioProps.disabled || radioProps.readOnly) ?? false}
                    onChange={onRadioChange}
                />
                <div className={`${radioPrefix}__pseudo-input`} />
            </div>

            <span className={`${radioPrefix}-label__text`}>{children}</span>
        </label>
    )
})

Radio.displayName = 'Radio'
