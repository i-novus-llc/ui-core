import {
    forwardRef,
    useCallback,
    useRef,
    ChangeEvent,
    MouseEvent,
    HTMLProps,
    ReactNode,
    FocusEvent,
    useMemo,
    useState,
    useEffect,
    Dispatch,
} from 'react'
import classNames from 'classnames'
import { v4 as generateId } from 'uuid'

import { ComponentBaseProps, useConfigProvider } from '../core'
import { useComposeRef } from '../core/hooks/useComposeRef'
import { Icon } from '../data-display/Icon'

export interface AbstractInputProps<Value = unknown, InputType = HTMLInputElement> {
    autoComplete?: string,
    id?: string,
    name?: string

    onBlur?(event: FocusEvent<InputType>, setValue?: Dispatch<string>): void,
    onChange?(value: Value, event?: ChangeEvent<InputType>): void,
    onFocus?(event: FocusEvent<InputType>): void,

    placeholder?: string,
    readonly?: boolean,
    value?: Value
}

export interface InputProps extends ComponentBaseProps, Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'onReset'>,
    AbstractInputProps<any> {
    clearIcon?: boolean | { icon: ReactNode },
    error?: boolean,
    length?: HTMLInputElement['maxLength']

    onReset?(event: MouseEvent<HTMLButtonElement>): void,
    prefixIcon?: ReactNode,
    required?: boolean,
    suffixIcon?: ReactNode
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
        className,
        disabled = false,
        error,
        prefix,
        prefixIcon,
        suffixIcon,
        required,
        readOnly = false,
        clearIcon,
        onChange,
        onReset,
        style,
        id,
        visible = true,
        type,
        autoComplete,
        length,
        onFocus,
        onBlur,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    const inputContainerRef = useRef<HTMLLabelElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const composedRef = useComposeRef(inputRef, ref)
    const isControlled = useRef(Object.hasOwn(props, 'value'))

    const [clearIconVisible, setClearIconVisible] = useState(false)

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value, event)

        if (inputRef.current && !isControlled.current) {
            setClearIconVisible(Boolean(event.target.value))
        }
    }, [onChange])

    const onInputReset = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        event.preventDefault()

        onReset?.(event)

        if (inputRef.current && !isControlled.current) {
            inputRef.current.value = ''
            setClearIconVisible(false)
        }
    }, [onReset])

    const targetId = useMemo(() => generateId(), [])

    useEffect(() => {
        if (isControlled.current) {
            setClearIconVisible(Boolean(props.value))
        } else {
            setClearIconVisible(Boolean(inputRef.current?.value))
        }
    }, [props.value])

    const ClearIcon = useMemo(() => {
        const hasReset = isControlled.current ? Boolean(onReset) : true

        if (disabled || readOnly || !clearIconVisible || !clearIcon || !hasReset) {
            return null
        }

        const icon = typeof clearIcon === 'boolean' ? <Icon icon="common-close" /> : clearIcon?.icon

        return icon ? (
            <button
                type="button"
                onClick={onInputReset}
                onMouseDown={e => e.preventDefault()}
                className={`${prefixCls}-input-clear-icon`}
                tabIndex={0}
            >
                {icon}
            </button>
        ) : null
    }, [clearIcon, clearIconVisible, disabled, onInputReset, prefixCls, readOnly, onReset])

    return (
        visible ? (
            <label
                htmlFor={`${targetId}`}
                ref={inputContainerRef}
                className={classNames(`${prefixCls}-input-container`, {
                    [`${prefixCls}-input-container_disabled`]: disabled,
                    [`${prefixCls}-input-container_error`]: error,
                    [`${prefixCls}-input-container_required`]: required,
                    [`${prefixCls}-input-container_readonly`]: readOnly,
                }, className)}
                style={style}
            >
                {prefixIcon && (
                    <span className={`${prefixCls}-input-prefix`}>
                        {prefixIcon}
                    </span>
                )}

                <input
                    {...restProps}
                    id={`${targetId}`}
                    autoComplete={autoComplete || 'off'}
                    ref={composedRef}
                    className={`${prefixCls}-input`}
                    readOnly={readOnly}
                    disabled={disabled || readOnly}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onChange={handleChange}
                    maxLength={length}
                    type={type}
                />

                {ClearIcon}

                {suffixIcon && (
                    <span className={classNames(`${prefixCls}-input-suffix`)}>
                        {suffixIcon}
                    </span>
                )}
            </label>
        ) : null
    )
})

Input.displayName = 'Input'
