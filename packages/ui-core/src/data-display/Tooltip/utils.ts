import { useLayoutEffect, useEffect } from 'react'
import { computePosition, offset, shift, arrow, flip } from '@floating-ui/dom'

import type { ComputeTooltipPositions } from './types'

const isScrollable = (node: Element) => {
    if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return false
    }
    const style = getComputedStyle(node)

    return ['overflow', 'overflow-x', 'overflow-y'].some((propertyName) => {
        const value = style.getPropertyValue(propertyName)

        return value === 'auto' || value === 'scroll'
    })
}

export const getScrollParent = (node: Element | null) => {
    if (!node) {
        return null
    }
    let currentParent = node.parentElement

    while (currentParent) {
        if (isScrollable(currentParent)) {
            return currentParent
        }
        currentParent = currentParent.parentElement
    }

    return document.scrollingElement || document.documentElement
}

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const debounce = (func: (...args: any[]) => void, wait?: number, immediate?: boolean) => {
    let timeout: NodeJS.Timeout | null = null

    return function debounced(this: typeof func, ...args: any[]) {
        const later = () => {
            timeout = null
            if (!immediate) {
                func.apply(this, args)
            }
        }

        if (immediate && !timeout) {
            /**
             * there's no need to clear the timeout
             * since we expect it to resolve and set `timeout = null`
             */
            func.apply(this, args)
            timeout = setTimeout(later, wait)
        }

        if (!immediate) {
            if (timeout) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(later, wait)
        }
    }
}

const getBorderWidth = (border?: string | number) => {
    let borderWidth = 0

    if (border) {
        const match = `${border}`.match(/(\d+)px/)

        if (match?.[1]) {
            borderWidth = Number(match[1])
        } else {
            borderWidth = 1
        }
    }

    return borderWidth
}

export const computeTooltipPosition = async ({
    elementReference = null,
    tooltipReference = null,
    tooltipArrowReference = null,
    place = 'top',
    offset: offsetValue = 10,
    strategy = 'absolute',
    middlewares = [
        offset(
            Array.isArray(offsetValue)
                ? { mainAxis: offsetValue[0], crossAxis: offsetValue[1] }
                : Number(offsetValue),
        ),
        flip(),
        shift({ padding: 5 }),
    ],
    border,
}: ComputeTooltipPositions) => {
    if (!elementReference) {
        return { tooltipStyles: {}, tooltipArrowStyles: {}, place }
    }

    if (tooltipReference === null) {
        return { tooltipStyles: {}, tooltipArrowStyles: {}, place }
    }

    const middleware = middlewares

    if (tooltipArrowReference) {
        middleware.push(arrow({ element: tooltipArrowReference as HTMLElement, padding: 5 }))

        return computePosition(elementReference as HTMLElement, tooltipReference as HTMLElement, {
            placement: place,
            strategy,
            middleware,
        }).then(({ x, y, placement, middlewareData }) => {
            const styles = { left: `${x}px`, top: `${y}px`, border }

            const { x: arrowX, y: arrowY } = middlewareData.arrow ?? { x: 0, y: 0 }

            const staticSide = {
                top: 'bottom',
                right: 'left',
                bottom: 'top',
                left: 'right',
                // @ts-ignore
            }[placement.split('-')[0]] ?? 'bottom'

            const borderSide = border && {
                borderBottom: border,
                borderRight: border,
            }

            const borderWidth = getBorderWidth(border)

            const arrowStyle = {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                bottom: '',
                ...borderSide,
                [staticSide]: `-${4 + borderWidth}px`,
            }

            return { tooltipStyles: styles, tooltipArrowStyles: arrowStyle, place: placement }
        })
    }

    return computePosition(elementReference as HTMLElement, tooltipReference as HTMLElement, {
        placement: 'bottom',
        strategy,
        middleware,
    }).then(({ x, y, placement }) => {
        const styles = { left: `${x}px`, top: `${y}px` }

        return { tooltipStyles: styles, tooltipArrowStyles: {}, place: placement }
    })
}
