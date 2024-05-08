import { FocusEvent, useCallback, useEffect, useRef, useState, MutableRefObject, RefObject } from 'react'

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

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const isInputFocus = calendarElem.current?.contains(getActiveElement())

        if ((event.key === 'Enter' || event.code === 'Space') && isInputFocus) {
            event.preventDefault()
            event.stopPropagation()

            onEnterKeyDown?.()
        }
    }, [calendarElem, onEnterKeyDown])

    const handleFocus = useCallback(() => {
        if (isPreventFocusEvent) { return }

        setIsPreventFocusEvent(true)
        onFocus?.()

        window?.addEventListener('keydown', handleKeyDown)
    }, [handleKeyDown, onFocus, isPreventFocusEvent])

    const onBlurEvent = useCallback((event?: FocusEvent<HTMLInputElement>) => {
        setIsPreventFocusEvent(false)
        onBlur?.(event)

        window?.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown, onBlur])

    const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
        if (calendarOpen) { return }

        onBlurEvent(event)
    }, [calendarOpen, onBlurEvent])

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
