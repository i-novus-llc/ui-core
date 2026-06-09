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

    const checkIsInvalid = (
        rawValue: string,
        fullFormat: string,
        minDate?: Dayjs | null,
        maxDate?: Dayjs | null,
        isInterval?: boolean,
    ) => {
        if (isInterval) {
            const parts = rawValue.split(INTERVAL_SEPARATOR).map(p => p.trim())

            if (parts.length !== 2) { return false }

            const [begin, end] = parts.map(p => dayjs(p, fullFormat))

            return begin?.isValid() && end?.isValid() &&
                ((minDate && begin.isBefore(minDate)) || (maxDate && end.isAfter(maxDate)))
        }
        const date = dayjs(rawValue, fullFormat)

        return date.isValid() && (date.isAfter(maxDate) || date.isBefore(minDate))
    }

    const handleBlur = useMemoFunction((event: FocusEvent<HTMLInputElement>, setValue) => {
        const { maxDate, minDate, fullFormat, value, isInterval } = dateRangeOptions || {}
        const rawValue = event.target.value

        if (checkIsInvalid(rawValue, fullFormat as string, minDate, maxDate, isInterval)) {
            if (isInterval) {
                // сброс до валидного значения
                setValue(value)
            } else {
                setValue(dayjs(value).format(fullFormat))
            }
        }

        setTimeout(() => {
            if (!isCalendarOpen.current) { onBlurEvent(event) }
        }, 150)
    })

    return ({
        handleFocus,
        handleBlur,
        onBlurEvent,
    })
}
