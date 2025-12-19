import { FocusEvent, useEffect, useRef, useState, MutableRefObject, RefObject } from 'react'
import dayjs, { Dayjs } from 'dayjs'

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
}

export const useDatePickerInputEvents = (
    calendarOpen: boolean,
    calendarElem: MutableRefObject<HTMLElement> | RefObject<HTMLElement>,
    { onFocus, onBlur, onEnterKeyDown }: CalendarInputEventsConfig,
    dateRangeOptions?: DateRangeOptions,
) => {
    const [isPreventFocusEvent, setIsPreventFocusEvent] = useState(false)
    const isInit = useRef(false)

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
        const { maxDate, minDate, fullFormat, value } = dateRangeOptions || {}
        const date = dayjs(event.target.value, fullFormat)

        if (date.isAfter(maxDate) || date.isBefore(minDate)) {
            setValue(dayjs(value).format(fullFormat))
        }

        if (calendarOpen) { return }

        onBlurEvent(event)
    })

    useEffect(() => {
        if (!isInit.current) {
            isInit.current = true

            return
        }

        const isFireOnBlur = isInit.current && !calendarElem.current?.contains(getActiveElement())

        if (isFireOnBlur) {
            onBlurEvent()
        }
    }, [calendarOpen, onBlur, calendarElem, onBlurEvent])

    return ({
        handleFocus,
        handleBlur,
    })
}
