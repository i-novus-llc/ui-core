import {
    PropsWithChildren,
    useEffect,
    forwardRef,
    useRef,
} from 'react'

import { getActiveElement } from '../../../utils/get-active-dom-node'
import { useForwardedRef } from '../../hooks'

type FocusTrapProps = {
    initialFocusableSelector?: string
}

const ALL_TABBABLE_SELECTORS = [
    'a[href]',
    'button',
    'input',
    'textarea',
    'select',
    'details',
    '[tabindex]:not([tabindex="-1"])',
].toString()

export const FocusTrap = forwardRef<HTMLDivElement, PropsWithChildren<FocusTrapProps>>(({
    children,
    initialFocusableSelector,
}, ref) => {
    const firstItemRef = useRef<HTMLElement>()
    const lastItemRef = useRef<HTMLElement>()
    const trapRef = useForwardedRef<HTMLDivElement>(ref)

    // eslint-disable-next-line sonarjs/cognitive-complexity
    useEffect(() => {
        const element = trapRef.current

        if (!element) {
            return undefined
        }

        const findFocusableElements = () => {
            const allFocusableElements = [...element.querySelectorAll<HTMLElement>(ALL_TABBABLE_SELECTORS)].filter(
                el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
            )

            lastItemRef.current = allFocusableElements[allFocusableElements.length - 1]
            // eslint-disable-next-line prefer-destructuring
            firstItemRef.current = allFocusableElements[0]
        }
        const observer = new MutationObserver(findFocusableElements)

        observer.observe(element, {
            childList: true,
            subtree: true,
        })

        findFocusableElements()

        const firstEnter = (event: KeyboardEvent) => {
            const focusableElement = initialFocusableSelector
                ? element.querySelector<HTMLElement>(initialFocusableSelector)
                : firstItemRef.current

            if (event.shiftKey) {
                lastItemRef.current?.focus()
                event.preventDefault()
            } else {
                focusableElement?.focus()
                event.preventDefault()
            }
        }

        const loop = (event: KeyboardEvent) => {
            const activeElement = getActiveElement()

            if (event.shiftKey) {
                if (activeElement === firstItemRef.current) {
                    lastItemRef.current?.focus()
                    event.preventDefault()
                }
            } else if (activeElement === lastItemRef.current) {
                firstItemRef.current?.focus()
                event.preventDefault()
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            const isTabPressed = (event.code === 'Tab')

            if (!isTabPressed) {
                return
            }

            const activeElement = getActiveElement()
            const isContainerActiveElement = element.contains(activeElement)

            if (isContainerActiveElement) {
                loop(event)
            } else {
                firstEnter(event)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            observer.disconnect()
        }
    }, [initialFocusableSelector, trapRef])

    return (
        <div ref={trapRef}>
            {children}
        </div>
    )
})
