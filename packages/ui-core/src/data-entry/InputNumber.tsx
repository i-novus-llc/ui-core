import {
    FocusEvent,
    useCallback,
    useState,
    SyntheticEvent,
    KeyboardEvent,
    forwardRef,
    useEffect,
} from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'
import { Icon } from '../data-display/Icon'

import { Input, InputProps } from './Input'

export interface InputNumberProps extends ComponentBaseProps, Omit<InputProps, 'onChange'> {
    max?: number
    min?: number
    onChange?(value: number | null, event?: SyntheticEvent): void,
    onKeyDown?(event: KeyboardEvent<HTMLInputElement>): void,
    precision?: number,
    showButtons?: boolean,
    step?: string | number
}

const getValueInRange = (value?: number | null | string, min?: number, max?: number) => {
    // Заменяем пустую строку и '-' на null
    if ((!value && value !== 0) || value === '-') {
        return null
    }

    // Убираем точку в конце, если дробное число ввели не до конца
    const stringValue = String(value).replace(/\.$/, '')
    const numberValue = Number(stringValue)

    if ((min || min === 0) && numberValue < min) {
        return min
    }

    if (max && numberValue > max) {
        return max
    }

    return numberValue
}

const getFixedNumber = (value: number | null, precision: number | undefined) => {
    if (value === null) {
        return value
    }

    if (typeof precision === 'undefined') {
        return Math.trunc(value)
    }

    // так сделано, чтобы убрать округление у toFixed()
    const fixedString = value.toFixed(precision + 1).replace(/.$/, '')

    return Number(fixedString)
}

const validate = (value: unknown) => {
    const regExp = /^-?(\d*|\d+(\.\d*))$/

    return !!String(value).match(regExp)
}

const validateNumber = (value: unknown) => {
    const regExp = /^(-|-?\d+\.)$/

    return !String(value).match(regExp)
}

const isIntegerInputValid = (inputValue: InputNumberProps['value']) => {
    return /^-?\d*$/.test(String(inputValue))
}

const isValidValue = (value: InputNumberProps['value']) => value !== null && !Number.isNaN(Number(value)) && value !== ''

const isDecimalPrecisionExceeded = (inputValue: InputNumberProps['value'], precision: number | undefined) => {
    const inputString = String(inputValue)
    const decimalPointIndex = inputString.indexOf('.')

    if (decimalPointIndex !== -1 && precision !== undefined) {
        const decimalPartLength = (inputString.length - 1) - decimalPointIndex

        return decimalPartLength > precision
    }

    return false
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>((props, ref) => {
    const {
        onChange: onChangeExternal,
        onBlur: onBlurExternal,
        onKeyDown: onKeyDownExternal,
        max = Number.MAX_SAFE_INTEGER,
        min = Number.MIN_SAFE_INTEGER,
        value = null,
        visible = true,
        showButtons = true,
        step = 1,
        precision,
        className,
        prefix,
        disabled = false,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [localValue, setLocalValue] = useState<number | null | string>(value)

    const onChangeWrapper = useCallback((newValue: number | null, event?: SyntheticEvent) => {
        if (value === newValue) {
            return
        }

        onChangeExternal?.(newValue, event)
    }, [onChangeExternal, value])

    const onChangeInternal = useCallback((newValue: unknown, event?: SyntheticEvent) => {
        // Заменяем все пустые строки, Undefined и т.д. на Null
        if (!newValue && newValue !== 0) {
            onChangeWrapper?.(null, event)
            setLocalValue(null)

            return
        }

        if (isDecimalPrecisionExceeded(newValue, precision)) {
            return
        }

        if (!precision && !isIntegerInputValid(newValue)) {
            return
        }

        // Проверяем, устраивает ли нас введённое значение
        const isValid = validate(newValue)

        if (!isValid) {
            return
        }

        // Проверяем, является ли введённое значение числом (т.к. "-" и "1." тоже можно ввести, но это не число)
        const isNumber = validateNumber(newValue)

        if (isNumber) {
            // так сделано, чтобы убрать округление у toFixed()
            const fixedNumber = getFixedNumber(Number(newValue), precision)

            onChangeWrapper?.(fixedNumber, event)
            setLocalValue(newValue as string)

            return
        }

        setLocalValue(newValue as string)
    }, [onChangeWrapper, precision])

    const onBlurInternal = useCallback((event: FocusEvent<HTMLInputElement>) => {
        // при onBlur обрезаются лишние цифры после точки и значение подменяется на min/max, если не попадает в диапазон
        const valueInRange = getValueInRange(localValue, min, max)
        const fixedValue = getFixedNumber(valueInRange, precision)

        onChangeInternal(fixedValue, event)
        setLocalValue(fixedValue)

        onBlurExternal?.(event)
    }, [localValue, max, min, onBlurExternal, onChangeInternal, precision])

    const onIncrementValue = useCallback((event: SyntheticEvent) => {
        const nextValue = Number(value) + Number(step)
        const newValue = typeof max !== 'undefined' && nextValue > max ? max : nextValue

        const fixedValue = getFixedNumber(newValue, precision)

        onChangeInternal(fixedValue, event)
    }, [max, onChangeInternal, precision, step, value])

    const onDecrementValue = useCallback((event: SyntheticEvent) => {
        const nextValue = Number(value) - Number(step)
        const newValue = typeof min !== 'undefined' && nextValue < min ? min : nextValue

        const fixedValue = getFixedNumber(newValue, precision)

        onChangeInternal(fixedValue, event)
    }, [min, onChangeInternal, precision, step, value])

    const onKeyDownInternal = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDownExternal?.(event)

        if (event.key === 'ArrowUp') {
            event.preventDefault()

            onIncrementValue(event)

            return
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()

            onDecrementValue(event)
        }
    }, [onDecrementValue, onIncrementValue, onKeyDownExternal])

    useEffect(() => {
        setLocalValue(getFixedNumber((isValidValue(value) ? Number(value) : null), precision))
    }, [value, precision])

    if (!visible) {
        return null
    }

    return (
        <Input
            {...restProps}
            ref={ref}
            prefix={prefix}
            className={classNames(`${prefixCls}-input-number`, className)}
            value={localValue ?? ''}
            disabled={disabled}
            onChange={onChangeInternal}
            onKeyDown={onKeyDownInternal}
            onBlur={onBlurInternal}
            suffixIcon={showButtons && (
                <div className={`${prefixCls}-input-number__actions`}>
                    <button
                        className={`${prefixCls}-input-number__button ${prefixCls}-input-number__button_inc`}
                        onClick={onIncrementValue}
                        disabled={disabled || Number(localValue) >= Number(max)}
                        type='button'
                    >
                        <Icon className={`${prefixCls}-input-number__icon`} icon="common-expand-less" />
                    </button>

                    <button
                        className={`${prefixCls}-input-number__button ${prefixCls}-input-number__button_desc`}
                        onClick={onDecrementValue}
                        disabled={disabled || Number(localValue) <= Number(min)}
                        type='button'
                    >
                        <Icon className={`${prefixCls}-input-number__icon`} icon="common-expand-more" />
                    </button>
                </div>
            )}
        />
    )
})

InputNumber.displayName = 'InputNumber'
