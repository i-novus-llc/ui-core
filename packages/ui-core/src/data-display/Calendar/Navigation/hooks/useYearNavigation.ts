import { useMemo } from 'react'

const getYears = (min: number, max: number) => {
    const years = []

    for (let i = min - 1; i <= max + 1;) {
        years.push(i)
        i += 1
    }

    return years
}

type ComputeSlideOffsetFnArgs = {
    max: number,
    min: number,
    slideStep?: number,
    target: number
}

const YEAR_BUTTON_WIDTH = 70
const YEAR_BUTTONS_GAP = 4
const DEFAULT_SLIDE_STEP = YEAR_BUTTON_WIDTH + YEAR_BUTTONS_GAP

const computeSlideOffset = ({ min, max, target, slideStep = DEFAULT_SLIDE_STEP }: ComputeSlideOffsetFnArgs): string => {
    if (target < min) {
        return '0'
    }

    if (target > max) {
        return `${(min - max) * slideStep}px`
    }

    return `${(min - target) * slideStep}px`
}

export const useYearNavigation = (minYear: number, maxYear: number, currentYear: number) => {
    const isPrevButtonDisabled = useMemo(() => (currentYear <= minYear), [currentYear, minYear])
    const isNextButtonDisabled = useMemo(() => (currentYear >= maxYear), [currentYear, maxYear])

    const computedMinYear = useMemo(() => (currentYear < minYear ? currentYear : minYear), [currentYear, minYear])
    const computedMaxYear = useMemo(() => (currentYear > maxYear ? currentYear : maxYear), [currentYear, maxYear])

    const slideOffset = useMemo(
        () => computeSlideOffset({ min: computedMinYear, max: computedMaxYear, target: Number(currentYear) }),
        [currentYear, computedMaxYear, computedMinYear],
    )

    const years = useMemo(() => getYears(computedMinYear, computedMaxYear), [computedMaxYear, computedMinYear])

    return {
        isPrevButtonDisabled,
        isNextButtonDisabled,
        slideOffset,
        years,
    }
}
