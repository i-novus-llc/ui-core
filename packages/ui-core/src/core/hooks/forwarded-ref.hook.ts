/* eslint-disable no-param-reassign */
import { useEffect, useRef, ForwardedRef } from 'react'

export const useForwardedRef = <T extends HTMLElement | SVGElement>(ref: ForwardedRef<T>) => {
    const internalRef = useRef<T>(null)

    useEffect(() => {
        if (!ref) { return }

        if (typeof ref === 'function') {
            ref(internalRef.current)
        } else {
            ref.current = internalRef.current
        }
    }, [ref, internalRef])

    return internalRef
}
