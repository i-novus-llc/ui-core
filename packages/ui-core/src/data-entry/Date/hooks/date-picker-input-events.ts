import { FocusEvent, useState, MutableRefObject, RefObject } from 'react'
import dayjs, { Dayjs } from 'dayjs'

import { INTERVAL_SEPARATOR } from '../../const'
import { useMemoFunction } from '../../../core'
import { getActiveElement } from '../../../utils/get-active-dom-node'

type CalendarInputEventsConfig = {
    onBlur?: Function,
    onEnterKeyDown?: Function,
    onFocus?: Function
}

type DateRangeOptions = {
    maxDate?: Dayjs | null,
    minDate?: Dayjs | null,
    fullFormat?: string,
    value?: Date | string | null,
    isInterval?: boolean,
}

export const useDatePickerInputEvents = (
    isCalendarOpen: MutableRefObject<boolean>,
    calendarElem: MutableRefObject<HTMLElement> | RefObject<HTMLElement>,
    { onFocus, onBlur, onEnterKeyDown }: CalendarInputEventsConfig,
    dateRangeOptions?: DateRangeOptions,
) => {
    const [isPreventFocusEvent, setIsPreventFocusEvent] = useState(false)

    const handleKeyDown = useMemoFunction((event: KeyboardEvent) => {
        const isInputFocus = calendarElem.current?.contains(getActiveElement())

        if ((event.key === 'Enter' || event.code === 'Space') && isInputFocus) {
            event.preventDefault()
            event.stopPropagation()

            onEnterKeyDown?.()
        }
    })

    const handleFocus = useMemoFunction(() => {
        if (isPreventFocusEvent) { return }

        setIsPreventFocusEvent(true)
        onFocus?.()

        window?.addEventListener('keydown', handleKeyDown)
    })

    const onBlurEvent = useMemoFunction((event?: FocusEvent<HTMLInputElement>) => {
        setIsPreventFocusEvent(false)
        onBlur?.(event)

        window?.removeEventListener('keydown', handleKeyDown)
    })

    const handleBlur = useMemoFunction((event: FocusEvent<HTMLInputElement>, setValue) => {
        const { maxDate, minDate, fullFormat, value, isInterval } = dateRangeOptions || {}
        const date = dayjs(event.target.value, fullFormat)

        if (isInterval) {
            const rawValue = event.target.value
            const parts = rawValue.split(INTERVAL_SEPARATOR)

            const [beginStr, endStr] = parts.map(p => p.trim())
            const beginDate = dayjs(beginStr, fullFormat)
            const endDate = dayjs(endStr, fullFormat)

            if (parts.length === 2 && beginDate.isValid() && endDate.isValid()) {
                setValue(dayjs(value || '').format(fullFormat))
            }
        } else if (date.isAfter(maxDate) || date.isBefore(minDate)) {
            setValue(dayjs(value).format(fullFormat))
        }

        setTimeout(() => {
            if (isCalendarOpen.current) { return }

            onBlurEvent(event)
        }, 150)
    })

    return ({
        handleFocus,
        handleBlur,
        onBlurEvent,
    })
}
