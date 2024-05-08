import {
    ChangeEvent,
    Children,
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

import { RadioGroupContextProps, RadioGroupProps } from './index.types'

export const RadioGroupContext = createContext<RadioGroupContextProps | null>(null)

export const useRadioGroupContext = () => {
    const radioGroupContext = useContext(RadioGroupContext)

    if (!radioGroupContext) {
        throw new Error('useRadioGroupContext должен быть использован в рамках <RadioGroupContext.Provider>')
    }

    return radioGroupContext
}

const initialGroupValue = ''

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
    const {
        children,
        defaultValue,
        value,
        onChange,
        onBlur,
        prefix,
        className,
        disabled,
        readOnly,
        name,
        visible = true,
        direction = 'horizontal',
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [groupValue, setGroupValue] = useState<string>(value || defaultValue || initialGroupValue)

    useEffect(() => {
        if (value) {
            setGroupValue(value)
        }
    }, [value])

    const onRadioChange = useCallback((optionId: string, event: ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(optionId, event)
        } else {
            setGroupValue(optionId)
        }
        // @ts-ignore
        onBlur?.(event)
    }, [onBlur, onChange])

    const isRadioButtonGroup = useMemo(() => {
        const displayNames = Children.map(children, (child: any) => child?.type?.displayName) as string[]
        const radioButtons = displayNames?.filter(displayName => displayName === 'RadioButton')

        return !!radioButtons?.length
    }, [children])

    const radioGroupClassName = useMemo(() => classNames(
        `${prefixCls}-radio-group`,
        `${prefixCls}-radio-group_${direction}`,
        isRadioButtonGroup && `${prefixCls}-radio-group_buttons`,
        className,
    ), [prefixCls, direction, isRadioButtonGroup, className])

    const radioGroupContextValue = useMemo<RadioGroupContextProps>(() => ({
        onChange: onRadioChange,
        value: groupValue,
        defaultValue,
        disabled,
        readOnly,
        name,
    }), [defaultValue, disabled, groupValue, name, onRadioChange, readOnly])

    if (!visible) { return null }

    return (
        <div
            {...omit(restProps, 'title')}
            className={radioGroupClassName}
            ref={ref}
        >
            <RadioGroupContext.Provider value={radioGroupContextValue}>
                {children}
            </RadioGroupContext.Provider>
        </div>
    )
})

RadioGroup.displayName = 'RadioGroup'
