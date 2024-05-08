import { ChangeEvent, forwardRef, MouseEvent, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

import { useConfigProvider } from '../../core'

import { OptionList } from './components'
import { BaseDropdownProps, TOption } from './types'
import { defaultOptions, noOptions } from './constants'
import { DropdownInput } from './DropdownInput'

// eslint-disable-next-line sonarjs/cognitive-complexity
export const Autocomplete = forwardRef<HTMLInputElement, BaseDropdownProps<unknown>>((props, ref) => {
    const {
        prefix,
        className,
        value,
        options = defaultOptions,
        onChange,
        onSearch,
        onOpen,
        onScroll,
        hasSearch = false,
        visible = true,
        style,
        ...restProps
    } = props

    const [dropdownOptions, setDropdownOptions] = useState<Array<TOption<unknown>>>(defaultOptions)
    const [inputValue, setInputValue] = useState('')

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const onOptionClick = useCallback((newValue: Array<TOption<unknown>>, event: MouseEvent<HTMLElement>) => {
        const [option] = newValue

        if (option) {
            setInputValue(option.label)
            // @ts-ignore
            onChange(option.label, event)
        }
    }, [onChange])

    const onInputValueChange = useCallback((newValue: string, event?: ChangeEvent<HTMLInputElement>) => {
        setInputValue(newValue)

        // @ts-ignore
        onChange?.(newValue, event)

        if (hasSearch && onSearch) {
            // @ts-ignore
            onSearch(newValue, event)

            return
        }

        if (!newValue) {
            setDropdownOptions(options)
        } else {
            const filteredOptions = options
                .filter(option => option.label.toLowerCase().includes(newValue.toLowerCase()))

            setDropdownOptions(filteredOptions.length
                ? filteredOptions
                : noOptions)
        }
    }, [hasSearch, onChange, onSearch, options])

    const handleOpen = useCallback((event: Event | ChangeEvent<HTMLElement>) => {
        if (onOpen) {
            onOpen(event)
        }

        const filteredOptions = options
            .filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()))

        setDropdownOptions(() => (filteredOptions.length
            ? filteredOptions
            : noOptions))
    }, [onOpen, options, inputValue])

    useEffect(() => {
        if (value && typeof value === 'string') {
            setInputValue(value)
        } else {
            setInputValue('')
        }
    }, [value])

    useEffect(() => {
        setDropdownOptions(options)
    }, [options])

    if (!visible) {
        return null
    }

    return (
        <div className={classNames(className, `${prefixCls}-autocomplete`)} style={style}>
            <DropdownInput
                {...restProps}
                ref={ref}
                prefixCls={prefixCls}
                value={inputValue}
                onChange={onInputValueChange}
                onOpen={handleOpen}
                dropdownInnerComponent={OptionList}
                multiple={false}
                dropdownInnerComponentProps={{
                    options: dropdownOptions,
                    onOptionClick,
                    multiple: false,
                    onScroll,
                }}
            />
        </div>
    )
})

Autocomplete.displayName = 'Autocomplete'
