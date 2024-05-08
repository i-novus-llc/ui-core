import {
    ChangeEvent,
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import classNames from 'classnames'
import omit from 'lodash/omit'

import { useConfigProvider } from '../../core'

import { CheckboxGroupContextProps, CheckboxGroupProps, CheckboxValueType } from './index.types'

export const CheckboxGroupContext = createContext<CheckboxGroupContextProps | null>(null)

export const useCheckboxGroupContext = () => {
    const checkboxGroupContext = useContext(CheckboxGroupContext)

    if (checkboxGroupContext === undefined) {
        throw new Error('useCheckboxGroupContext должен быть использован в рамках <CheckboxGroupContext.Provider>')
    }

    return checkboxGroupContext
}

const initialStateValue: CheckboxValueType[] = []

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>((props, ref) => {
    const {
        className,
        prefix,
        defaultValue,
        value: valueFromProps,
        disabled,
        readOnly,
        visible = true,
        onChange,
        onBlur,
        onFocus,
        direction = 'horizontal',
        children,
        style,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const checkboxGroupPrefix = `${prefixCls}-checkbox-group`

    const [groupValue, setGroupValue] = useState<string[]>(
        valueFromProps || defaultValue || initialStateValue,
    )

    const hasExternalControl = useMemo(() => Object.hasOwn(props, 'value') && Object.hasOwn(props, 'onChange'), [props])

    const groupClassName = useMemo(
        () => classNames(className, checkboxGroupPrefix, `${checkboxGroupPrefix}_${direction}`),
        [checkboxGroupPrefix, className, direction],
    )

    useEffect(() => {
        if (hasExternalControl) {
            setGroupValue(valueFromProps || [])
        }
    }, [hasExternalControl, valueFromProps])

    const onGroupValueChange = useCallback((checkboxId: string, event?: ChangeEvent<HTMLInputElement>) => {
        let newGroupValue = [...groupValue]

        if (newGroupValue.includes(checkboxId)) {
            newGroupValue = newGroupValue.filter(id => id !== checkboxId)
        } else {
            newGroupValue.push(checkboxId)
        }

        if (!hasExternalControl) {
            setGroupValue(newGroupValue)
        }

        if (onChange) {
            onChange(newGroupValue, event)
        }
    }, [groupValue, onChange, hasExternalControl])

    const checkboxGroupContextValue: CheckboxGroupContextProps = useMemo(() => {
        return {
            onChange: onGroupValueChange,
            value: groupValue,
            disabled,
            readOnly,
            onBlur,
            onFocus,
        }
    }, [onGroupValueChange, groupValue, disabled, readOnly, onBlur, onFocus])

    if (!visible) {
        return null
    }

    return (
        <div
            {...omit(restProps, 'title')}
            ref={ref}
            className={groupClassName}
            style={style}
        >
            <CheckboxGroupContext.Provider value={checkboxGroupContextValue}>
                {children}
            </CheckboxGroupContext.Provider>
        </div>
    )
})

CheckboxGroup.displayName = 'CheckboxGroup'
