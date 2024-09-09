import { ChangeEvent, forwardRef, MouseEvent, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

import { useConfigProvider } from '../../core'

import { OptionList } from './components'
import { BaseDropdownProps, TOption } from './types'
import { defaultOptions, noOption, noOptions } from './constants'
import { DropdownInput } from './DropdownInput'
import { MultipleSelector } from './MultipleSelector'

// FIXME: Требуется отсмотреть компоненту. Собрать корнер кейсы и провести рефакторинг. Внутри слишком много внутренних состояний.
// eslint-disable-next-line sonarjs/cognitive-complexity
export const InputSelect = forwardRef<HTMLInputElement, BaseDropdownProps<unknown>>((props, ref) => {
    const {
        prefix,
        className,
        selectedInputValue = '',
        value,
        options = defaultOptions,
        onChange,
        onSearch,
        onOpen,
        onScroll,
        style,
        hasSearch = false,
        visible = true,
        multiple = false,
        disabled = false,
        emptyText,
        ...restProps
    } = props

    const [dropdownOptions, setDropdownOptions] = useState<Array<TOption<unknown>>>(defaultOptions)
    const [selectedOptions, setSelectedOptions] = useState<Array<TOption<unknown>>>(defaultOptions)
    const [inputValue, setInputValue] = useState(selectedInputValue)

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const onOptionClick = useCallback((newValue: Array<TOption<unknown>>, event: MouseEvent<HTMLElement>) => {
        setSelectedOptions(newValue)

        if (multiple) {
            // @ts-ignore
            onChange(newValue, event)
        } else {
            const [selectedOption] = newValue

            if (selectedOption) {
                // @ts-ignore
                onChange(selectedOption, event)
                setInputValue(selectedOption.label)
            }
        }
    }, [multiple, onChange])

    const onInputValueChange = useCallback((newValue: string, event?: ChangeEvent<HTMLInputElement>) => {
        setInputValue(newValue)

        if (!newValue && !multiple) {
            setSelectedOptions([])
            // @ts-ignore
            onChange?.(null, event)
        }

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
    }, [hasSearch, multiple, onChange, onSearch, options])

    const onCloseTag = useCallback((id: string, evt: MouseEvent<HTMLElement>) => {
        setSelectedOptions((prev) => {
            const newSelectedOptions = prev.filter(item => item.id !== id)

            // @ts-ignore
            onChange?.(newSelectedOptions, evt)

            return newSelectedOptions
        })
    }, [onChange])

    const onCloseDropdown = useCallback(() => {
        if (!inputValue) { return }

        if ((!multiple && !selectedOptions.length) || multiple) {
            setInputValue('')
        } else {
            const [selected] = selectedOptions

            setInputValue(selected?.label || '')
        }
    }, [multiple, inputValue, selectedOptions])

    const handleOpen = useCallback((event: Event | ChangeEvent<HTMLElement>) => {
        if (onOpen) {
            onOpen(event)
        }
        setDropdownOptions(options)
    }, [onOpen, options])

    const handleClearAllSelectedOptions = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()

        onInputValueChange('')
        setSelectedOptions(defaultOptions)
        // @ts-ignore
        onChange?.(defaultOptions, event)
    }, [onInputValueChange, onChange])

    useEffect(() => {
        if (Array.isArray(value)) {
            setSelectedOptions(value)
        } else if (value && typeof value === 'object' && 'label' in value) {
            setSelectedOptions([value as TOption<unknown>])
            setInputValue((value as TOption<unknown>).label)
        } else {
            setSelectedOptions([])
            setInputValue('')
        }
    }, [value])

    useEffect(() => {
        setDropdownOptions(options?.length ? options : [{
            ...noOption,
            label: emptyText || noOption.label,
        }])
    }, [emptyText, options])

    if (!visible) {
        return null
    }

    if (multiple) {
        return (
            <div className={classNames(className, `${prefixCls}-multiple-selector`)} style={style}>
                <MultipleSelector
                    {...restProps}
                    disabled={disabled}
                    ref={ref}
                    prefixCls={prefixCls}
                    value={inputValue}
                    onChange={onInputValueChange}
                    onOpen={handleOpen}
                    dropdownInnerComponent={OptionList}
                    onClose={onCloseDropdown}
                    dropdownInnerComponentProps={{
                        options: dropdownOptions,
                        selected: selectedOptions,
                        onOptionClick,
                        multiple,
                        onScroll,
                    }}
                    tagListProps={{
                        selectedOptions,
                        onCloseTag,
                        handleClearAllSelectedOptions,
                    }}
                />
            </div>
        )
    }

    return (
        <div className={classNames(className, `${prefixCls}-input-select`)} style={style}>
            <DropdownInput
                {...restProps}
                disabled={disabled}
                ref={ref}
                prefixCls={prefixCls}
                value={inputValue}
                onChange={onInputValueChange}
                onOpen={handleOpen}
                dropdownInnerComponent={OptionList}
                onClose={onCloseDropdown}
                dropdownInnerComponentProps={{
                    options: dropdownOptions,
                    selected: selectedOptions,
                    onOptionClick,
                    multiple,
                    onScroll,
                }}
            />
        </div>
    )
})

InputSelect.displayName = 'InputSelect'
