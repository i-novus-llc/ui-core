import { ChangeEvent, forwardRef, useMemo, useState } from 'react'
import classNames from 'classnames'

import { useConfigProvider } from '../../core'

import { RadioProps } from './index.types'
import { useRadioGroupContext } from './RadioGroup'
import { createUniqueId } from './helpers'

export const RadioButton = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
    const {
        children,
        prefix,
        id: optionId,
        className,
        onChange,
        style,
        visible = true,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [inputId] = useState(createUniqueId('input-'))
    const radioButtonPrefix = useMemo(() => `${prefixCls}-radio-button`, [prefixCls])

    const groupContext = useRadioGroupContext()

    const radioProps: Partial<RadioProps> = {
        ...restProps,
        name: groupContext.name || restProps.name,
        disabled: restProps.disabled || groupContext.disabled,
        checked: optionId === (groupContext.value || groupContext.defaultValue),
        readOnly: restProps.readOnly || groupContext.readOnly,
    }

    const onRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(optionId, event)
        groupContext?.onChange?.(optionId, event)
    }

    const labelClassName = useMemo(() => classNames(className, radioButtonPrefix, {
        [`${radioButtonPrefix}_unchecked`]: !radioProps.checked,
        [`${radioButtonPrefix}_checked`]: radioProps.checked,
        [`${radioButtonPrefix}_disabled`]: radioProps.disabled,
        [`${radioButtonPrefix}_readonly`]: radioProps.readOnly,
    }), [className, radioButtonPrefix, radioProps.checked, radioProps.disabled, radioProps.readOnly])

    if (!visible) { return null }

    return (
        <label
            className={labelClassName}
            htmlFor={inputId}
            style={style}
        >
            <div className={`${radioButtonPrefix}__input-wrapper`}>
                <input
                    {...radioProps}
                    ref={ref}
                    id={inputId}
                    type="radio"
                    onChange={onRadioButtonChange}
                    className={`${radioButtonPrefix}__input`}
                    disabled={restProps.disabled || restProps.readOnly || false}
                />

                <div className={`${radioButtonPrefix}__focus-element`} />
            </div>

            <div className={`${radioButtonPrefix}__content`}>
                {children}
            </div>
        </label>
    )
})

RadioButton.displayName = 'RadioButton'
