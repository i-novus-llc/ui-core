import { MouseEvent, useRef } from 'react'
import classNames from 'classnames'

import { OptionListProps, TOption } from '../types'
import { defaultOptions } from '../constants'
import { useScroll } from '../hooks/useScroll'

export const OptionList = ({
    options = defaultOptions,
    selected = defaultOptions,
    onOptionClick,
    onScroll,
    close,
    multiple,
    prefix,
    onMouseLeave,
    onMouseEnter,
    value,
}: OptionListProps<unknown>) => {
    const listContainerRef = useRef<HTMLUListElement>(null)

    useScroll(listContainerRef, onScroll, value)

    const handleOptionClick = (option: TOption<unknown>, event: MouseEvent<HTMLElement>) => {
        if (multiple) {
            const isOptionSelected = selected.some(item => item.id === option.id)

            const newSelectedOptions = isOptionSelected
                ? selected.filter(item => item.id !== option.id)
                : [...selected, option]

            onOptionClick(newSelectedOptions, event)
        } else {
            onOptionClick([option], event)
            close?.()
        }
    }

    return (
        <ul className={`${prefix}-options`} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} ref={listContainerRef}>
            {options.map((option) => {
                const { id, label, disabled = false } = option
                const isSelected = selected.some(selectedOption => selectedOption.id === id)

                return (
                    <li
                        key={id}
                        className={classNames(`${prefix}-options__item`)}
                    >
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={event => handleOptionClick(option, event)}
                            className={classNames(`${prefix}-option`, {
                                [`${prefix}-option_disabled`]: disabled,
                                [`${prefix}-option_selected`]: isSelected,
                            })}
                        >
                            <span className={`${prefix}-option__label`}>{label}</span>
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}
