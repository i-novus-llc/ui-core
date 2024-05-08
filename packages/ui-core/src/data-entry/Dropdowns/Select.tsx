import { ChangeEvent, forwardRef, MouseEvent, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

import { useConfigProvider } from '../../core'

import { OptionList, TagList } from './components'
import { BaseDropdownProps, TOption } from './types'
import { defaultOptions, noOption } from './constants'
import { DropdownInput } from './DropdownInput'

// eslint-disable-next-line sonarjs/cognitive-complexity
export const Select = forwardRef<HTMLInputElement, BaseDropdownProps<unknown>>((props, ref) => {
    const {
        prefix,
        className,
        value,
        options = defaultOptions,
        onChange,
        onSearch,
        onScroll,
        onOpen,
        style,
        visible = true,
        multiple = false,
        disabled = false,
        type,
        emptyText,
        loading,
        ...restProps
    } = props

    const [dropdownOptions, setDropdownOptions] = useState<Array<TOption<unknown>>>(defaultOptions)
    const [selectedOptions, setSelectedOptions] = useState<Array<TOption<unknown>>>(defaultOptions)
    const [inputValue, setInputValue] = useState('')

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
        if (!multiple) {
            setInputValue('')
            setSelectedOptions([])
        }

        // @ts-ignore
        onChange?.(null, event)
    }, [multiple, onChange])

    const onCloseTag = useCallback((id: string, evt: MouseEvent<HTMLElement>) => {
        setSelectedOptions((prev) => {
            const newSelectedOptions = prev.filter(item => item.id !== id)

            // @ts-ignore
            onChange?.(newSelectedOptions, evt)

            return newSelectedOptions
        })
    }, [onChange])

    const handleOpen = useCallback((event: Event | ChangeEvent<HTMLElement>) => {
        if (onOpen) { onOpen(event) }

        setDropdownOptions(() => {
            if (loading) { return [] }

            if (options.length) { return options }

            return [{ ...noOption, label: emptyText || noOption.label }]
        })
    }, [emptyText, options, onOpen, loading])

    useEffect(() => {
        if (Array.isArray(value)) {
            setSelectedOptions(value)
        } else if (value && typeof value === 'object' && 'label' in value) {
            setSelectedOptions([value as TOption<unknown>])
            setInputValue(value.label as string)
        } else {
            setSelectedOptions([])
            setInputValue('')
        }
    }, [value])

    useEffect(() => { setDropdownOptions(options) }, [options, loading])

    if (!visible) { return null }

    return (
        <div className={classNames(className, `${prefixCls}-select`)} style={style}>
            <DropdownInput
                {...restProps}
                disableInput
                loading={loading}
                ref={ref}
                prefixCls={prefixCls}
                value={inputValue}
                onChange={onInputValueChange}
                dropdownInnerComponent={OptionList}
                disabled={disabled}
                type={type}
                onOpen={handleOpen}
                dropdownInnerComponentProps={{
                    options: dropdownOptions,
                    selected: selectedOptions,
                    onOptionClick,
                    multiple,
                    onScroll,
                }}
            />
            {multiple && Boolean(selectedOptions.length)
                ? (
                    <TagList
                        className={classNames({ disabled })}
                        prefix={prefixCls}
                        selectedOptions={selectedOptions}
                        onCloseTag={onCloseTag}
                        disabled={disabled}
                    />
                )
                : null}
        </div>
    )
})

Select.displayName = 'Select'
