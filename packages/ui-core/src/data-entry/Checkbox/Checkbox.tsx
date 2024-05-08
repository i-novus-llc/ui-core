import { ChangeEvent, forwardRef, useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'

import { useConfigProvider } from '../../core'

import { CheckboxProps } from './index.types'
import { useCheckboxGroupContext } from './CheckboxGroup'

// eslint-disable-next-line sonarjs/cognitive-complexity
export const CheckboxBody = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const {
        className,
        prefix,
        indeterminate = false,
        title,
        visible = true,
        children,
        id: optionId,
        style,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const checkboxPrefix = `${prefixCls}-checkbox`

    const groupContext = useCheckboxGroupContext()
    const [inputId] = useState(`checkbox-${Math.round(Math.random() * 10e6)}`)

    const checkboxProps: Partial<CheckboxProps> = useMemo(() => ({ ...restProps }), [restProps])

    if (groupContext) {
        checkboxProps.checked = groupContext.value.includes(optionId) || null
        checkboxProps.disabled = groupContext.disabled || checkboxProps.disabled
        checkboxProps.readOnly = groupContext.readOnly || checkboxProps.readOnly
        checkboxProps.onBlur = groupContext.onBlur || checkboxProps.onBlur
    }

    /**
     * тут имеем значение checkboxProps.checked с учетом возможного наличия контекста группы
     */
    const [internalChecked, setInternalChecked] = useState(!!checkboxProps.checked || !!checkboxProps.defaultChecked)

    const hasExternalControl = useMemo(
        () => Boolean(checkboxProps.onChange || groupContext?.onChange),
        [groupContext?.onChange, checkboxProps.onChange],
    )
    const hasCheckedProp = useMemo(() => (Object.hasOwn(props, 'checked')), [props])

    const checkedResultValue = useMemo(() => {
        if (!hasExternalControl && !hasCheckedProp) {
            return internalChecked
        }

        return !!checkboxProps.checked
    }, [hasCheckedProp, hasExternalControl, internalChecked, checkboxProps.checked])

    const labelClassName = useMemo(() => {
        return classNames(checkboxPrefix, `${checkboxPrefix}-label`, {
            [`${checkboxPrefix}_readonly`]: checkboxProps.readOnly,
            [`${checkboxPrefix}_checked`]: checkedResultValue,
            [`${checkboxPrefix}_unchecked`]: !checkedResultValue,
            [`${checkboxPrefix}_disabled`]: checkboxProps.disabled,
            [`${checkboxPrefix}_indeterminate`]: indeterminate,
        }, className)
    }, [checkboxPrefix, checkboxProps.readOnly, checkboxProps.disabled,
        checkedResultValue, indeterminate, className])

    const ariaChecked = useMemo(() => {
        return indeterminate ? 'mixed' : !!checkboxProps.checked
    }, [checkboxProps.checked, indeterminate])

    const onCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        checkboxProps.onChange?.(event.target.checked, event)
        groupContext?.onChange?.(optionId, event)
        // @ts-ignore
        checkboxProps.onBlur?.(event)

        /**
         * изменяем внутренний стейт если чекбокс не управляется извне и не имеет пропа checked
         * (может иметь checked для принудительной блокировки включенного состояния)
         */
        if (!hasExternalControl && !hasCheckedProp) {
            setInternalChecked(prevState => !prevState)
        }
    }, [groupContext, hasCheckedProp, hasExternalControl, optionId, checkboxProps])

    if (!visible) {
        return null
    }

    return (
        <label
            htmlFor={inputId}
            className={labelClassName}
            title={title}
            style={style}
        >
            <div className={`${checkboxPrefix}__input-wrapper`}>
                <input
                    {...checkboxProps}
                    id={inputId}
                    ref={ref}
                    aria-checked={ariaChecked}
                    onChange={onCheckboxChange}
                    disabled={checkboxProps.disabled || checkboxProps.readOnly}
                    checked={checkedResultValue}
                    type="checkbox"
                    className={`${checkboxPrefix}__input`}
                />
                <span className={`${checkboxPrefix}__pseudo-input`} />
            </div>

            {!!children && <span className={`${checkboxPrefix}-label__text`}>{children}</span>}
        </label>
    )
})

CheckboxBody.displayName = 'Checkbox'
