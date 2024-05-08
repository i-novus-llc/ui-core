import { useCallback } from 'react'

import { CalendarSelectOptionType, YearSelectProps } from '../../types'

import { CalendarSelect } from './CalendarSelect'

export const YearSelect = ({ onSelectYear, ...rest }: YearSelectProps) => {
    const handleSelectYear = useCallback((year: CalendarSelectOptionType) => {
        onSelectYear(Number(year))
    }, [onSelectYear])

    return (
        <CalendarSelect
            {...rest}
            onSelectOption={handleSelectYear}
        />
    )
}
