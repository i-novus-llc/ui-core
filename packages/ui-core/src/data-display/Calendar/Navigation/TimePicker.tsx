import { FC, useCallback } from 'react'
import classNames from 'classnames'

import { TimePickerProps } from '../types'

import { CalendarSelect } from './components/CalendarSelect'

const HOURS = Array.from({ length: 24 }, (_, i) => (i < 10 ? `0${i}` : `${i}`))
const MINUTES_SECONDS = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`))

export const TimePicker: FC<TimePickerProps> = ({
    prefix,
    onChange,
    value,
    dateAccuracy,
}) => {
    const handleSelectHours = useCallback((data: string) => {
        onChange({ ...value, hours: data })
    }, [onChange, value])

    const handleSelectMinutes = useCallback((data: string) => {
        onChange({ ...value, minutes: data })
    }, [onChange, value])

    const handleSelectSeconds = useCallback((data: string) => {
        onChange({ ...value, seconds: data })
    }, [onChange, value])

    return (
        <div className={classNames(`${prefix}-calendar__navigation`, `${prefix}-calendar__navigation-time`)}>
            <div className={`${prefix}-calendar__date-time`}>
                <CalendarSelect
                    className="timepicker"
                    prefix={prefix}
                    initialValue={value.hours?.padStart(2, '0')}
                    options={HOURS}
                    onSelectOption={handleSelectHours}
                    expandIconVisibility={false}
                />

                <CalendarSelect
                    className="timepicker"
                    prefix={prefix}
                    initialValue={value.minutes?.padStart(2, '0')}
                    options={MINUTES_SECONDS}
                    onSelectOption={handleSelectMinutes}
                    expandIconVisibility={false}
                />

                {dateAccuracy === 'full' && (
                    <CalendarSelect
                        className="timepicker"
                        prefix={prefix}
                        initialValue={value.seconds?.padStart(2, '0')}
                        options={MINUTES_SECONDS}
                        onSelectOption={handleSelectSeconds}
                        expandIconVisibility={false}
                    />
                )}
            </div>
        </div>
    )
}

TimePicker.displayName = 'TimePicker'
