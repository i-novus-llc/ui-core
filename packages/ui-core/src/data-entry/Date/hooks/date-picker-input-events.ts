import { FocusEvent, useEffect, useRef, useState, MutableRefObject, RefObject } from 'react'

import { useMemoFunction } from '../../../core'
import { getActiveElement } from '../../../utils/get-active-dom-node'

type CalendarInputEventsConfig = {
    onBlur?: Function,
    onEnterKeyDown?: Function,
    onFocus?: Function
}

export const useDatePickerInputEvents = (
    calendarOpen: boolean,
    calendarElem: MutableRefObject<HTMLElement> | RefObject<HTMLElement>,
    { onFocus, onBlur, onEnterKeyDown }: CalendarInputEventsConfig,
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

    const handleBlur = useMemoFunction((event: FocusEvent<HTMLInputElement>) => {
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
