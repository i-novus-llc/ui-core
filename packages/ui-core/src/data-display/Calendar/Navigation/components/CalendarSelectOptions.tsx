import { useRef } from 'react'
import classNames from 'classnames'

import { CalendarSelectOptionsProps } from '../../types'

import { Option } from './Option'
import { ID_PREFIX, SELECTED_OPTION_ID } from './constants'

export const CalendarSelectOptions = ({ options, prefix, initialValue, onClickOption }: CalendarSelectOptionsProps) => {
    const optionsContainerRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={optionsContainerRef} className={`${prefix}-calendar__select-content`}>
            {options.map((option) => {
                const isSelected = option === initialValue

                return (
                    <Option
                        id={isSelected ? SELECTED_OPTION_ID : `${ID_PREFIX}${option}`}
                        name={option}
                        key={option}
                        parentContainerRef={optionsContainerRef}
                        prefix={prefix}
                        isSelected={isSelected}
                        onClick={onClickOption}
                        className={classNames(`${prefix}-calendar__select-option`, {
                            [`${prefix}-calendar__select-option_selected`]: isSelected,
                        })}
                    >
                        {option}
                    </Option>
                )
            })}
        </div>
    )
}
