import { forwardRef } from 'react'

import { DatePicker, DatePickerProps } from './Date/date-picker'

export const MonthPicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
    return (
        <DatePicker
            {...props}
            ref={ref}
            calendarView="year"
            dateFormat="MM.YYYY"
        />
    )
})

MonthPicker.displayName = 'MonthPicker'
