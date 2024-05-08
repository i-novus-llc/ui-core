import { useCallback, useEffect, useState, MouseEvent } from 'react'
import dayjs from 'dayjs'
import { CalendarProps as BaseCalendarProps } from 'react-calendar'
import classNames from 'classnames'

import { Button } from '../../../general/Button'
import { ExpandLeftIcon, ExpandRightIcon } from '../../../core'
import { YearViewNavigationProps } from '../types'

import { useYearNavigation } from './hooks/useYearNavigation'

type OnArgs = Parameters<NonNullable<BaseCalendarProps['onActiveStartDateChange']>>[0]

export const YearViewNavigation = ({
    prefix,
    initialDate,
    onActiveStartDateChange,
    minYear,
    maxYear,
}: YearViewNavigationProps) => {
    const [currentYear, setCurrentYear] = useState<string>(dayjs(initialDate).format('YYYY'))

    const onClickPreviousYear = useCallback(() => {
        const nextActiveStartDate = dayjs(initialDate).subtract(1, 'year').toDate()

        onActiveStartDateChange({
            action: 'prev',
            activeStartDate: nextActiveStartDate,
        } as OnArgs)
    }, [initialDate, onActiveStartDateChange])

    const onClickNextYear = useCallback(() => {
        const nextActiveStartDate = dayjs(initialDate).add(1, 'year').toDate()

        onActiveStartDateChange({
            action: 'next',
            activeStartDate: nextActiveStartDate,
        } as OnArgs)
    }, [initialDate, onActiveStartDateChange])

    const onClickYear = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        // @ts-ignore
        const selectedYear = event.target.id

        if (selectedYear === currentYear) {
            return
        }

        const nextActiveStartDate = dayjs(initialDate).set('year', selectedYear).toDate()

        onActiveStartDateChange({
            action: 'next',
            activeStartDate: nextActiveStartDate,
        } as OnArgs)
    }, [currentYear, initialDate, onActiveStartDateChange])

    const {
        isPrevButtonDisabled,
        isNextButtonDisabled,
        slideOffset,
        years,
    } = useYearNavigation(minYear, maxYear, Number(currentYear))

    const calendarPrefix = `${prefix}-calendar`

    useEffect(() => {
        setCurrentYear(dayjs(initialDate).format('YYYY'))
    }, [initialDate])

    return (
        <div className={classNames(`${calendarPrefix}__navigation`, `${calendarPrefix}__navigation_year-view`)}>
            <Button
                className={`${calendarPrefix}__navigation-button`}
                variant="link"
                onClick={onClickPreviousYear}
                disabled={isPrevButtonDisabled}
                style={{ opacity: `${isPrevButtonDisabled ? 0.5 : 1}` }}
            >
                <ExpandLeftIcon />
            </Button>
            <div className={`${calendarPrefix}__year-buttons-wrapper`}>
                <div
                    className={`${calendarPrefix}__year-buttons`}
                    style={{ transform: `translateX(${slideOffset})` }}
                >
                    {years.map(year => (
                        <Button
                            tabIndex={-1}
                            key={String(year)}
                            id={String(year)}
                            className={classNames(`${calendarPrefix}__year-button`, { [`${calendarPrefix}__year-button_active`]: year === Number(currentYear) })}
                            variant={year === Number(currentYear) ? 'primary' : 'link-cancel'}
                            onClick={onClickYear}
                            disabled={(year < minYear) || (year > maxYear)}
                        >
                            {year}
                        </Button>
                    ))}
                </div>
            </div>

            <Button
                className={`${prefix}-calendar__navigation-button`}
                variant="link"
                onClick={onClickNextYear}
                disabled={isNextButtonDisabled}
                style={{ opacity: `${isNextButtonDisabled ? 0.5 : 1}` }}
            >
                <ExpandRightIcon />
            </Button>
        </div>
    )
}

YearViewNavigation.displayName = 'YearViewNavigation'
