import { useCallback } from 'react'

import { CalendarSelectOptionType, MonthSelectProps } from '../../types'

import { CalendarSelect } from './CalendarSelect'

export const MonthSelect = ({ onSelectMonth, options, ...rest }: MonthSelectProps) => {
    const handleSelectMonth = useCallback((monthName: CalendarSelectOptionType) => {
        const monthIndex = options.indexOf(monthName)

        onSelectMonth(monthIndex)
    }, [onSelectMonth, options])

    return (
        <CalendarSelect
            {...rest}
            options={options}
            onSelectOption={handleSelectMonth}
        />
    )
}
