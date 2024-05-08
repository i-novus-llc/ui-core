import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { CalendarProps as BaseCalendarProps } from 'react-calendar'

import { Button } from '../../../general/Button'
import { ExpandLeftIcon, ExpandRightIcon } from '../../../core'
import { CalendarSelectOptions, MonthViewNavigationProps } from '../types'

import { MonthSelect } from './components/MonthSelect'
import { YearSelect } from './components/YearSelect'

type OnArgs = Parameters<NonNullable<BaseCalendarProps['onActiveStartDateChange']>>[0]

const MONTH_SELECT_OPTIONS: CalendarSelectOptions = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
]

const getMonthSelectOptions = () => MONTH_SELECT_OPTIONS

const getYearSelectOptions = (minYear: number, maxYear: number) => {
    const yearsList: CalendarSelectOptions = []

    for (let year = minYear; year <= maxYear;) {
        yearsList.push(String(year))
        year += 1
    }

    return yearsList
}

export const MonthViewNavigation = ({
    prefix,
    initialDate,
    onActiveStartDateChange,
    minYear,
    maxYear,
}: MonthViewNavigationProps) => {
    const onClickPrevious = useCallback(() => {
        const nextActiveStartDate = dayjs(initialDate).subtract(1, 'month').toDate()

        onActiveStartDateChange({
            action: 'prev',
            activeStartDate: nextActiveStartDate,
        } as OnArgs)
    }, [initialDate, onActiveStartDateChange])

    const onClickNext = useCallback(() => {
        const nextActiveStartDate = dayjs(initialDate).add(1, 'month').toDate()

        onActiveStartDateChange({
            action: 'next',
            activeStartDate: nextActiveStartDate,
        } as OnArgs)
    }, [initialDate, onActiveStartDateChange])

    const onSelectMonth = useCallback((monthIdx: number) => {
        const nextActiveStartDate = dayjs(initialDate).month(monthIdx).toDate()

        onActiveStartDateChange({
            action: 'next',
            activeStartDate: nextActiveStartDate,
        } as OnArgs)
    }, [initialDate, onActiveStartDateChange])

    const onSelectYear = useCallback((year: number) => {
        const nextActiveStartDate = dayjs(initialDate).year(year).toDate()

        onActiveStartDateChange({
            action: 'next',
            activeStartDate: nextActiveStartDate,
        } as OnArgs)
    }, [initialDate, onActiveStartDateChange])

    const initialMonth = useMemo(() => {
        const monthIndex = dayjs(initialDate).get('month')

        return MONTH_SELECT_OPTIONS[monthIndex] || ''
    }, [initialDate])

    const initialYear = useMemo(() => {
        return dayjs(initialDate).format('YYYY')
    }, [initialDate])

    return (
        <div className={`${prefix}-calendar__navigation`}>
            <div className={`${prefix}-calendar__date-parts-selection`}>
                <MonthSelect
                    prefix={prefix}
                    initialValue={initialMonth}
                    options={getMonthSelectOptions()}
                    onSelectMonth={onSelectMonth}
                />

                <YearSelect
                    prefix={prefix}
                    initialValue={initialYear}
                    options={getYearSelectOptions(minYear, maxYear)}
                    onSelectYear={onSelectYear}
                />
            </div>
            <div className={`${prefix}-calendar__navigation-buttons`}>
                <Button className={`${prefix}-calendar__navigation-button`} variant="link" onClick={onClickPrevious}><ExpandLeftIcon /></Button>
                <Button className={`${prefix}-calendar__navigation-button`} variant="link" onClick={onClickNext}><ExpandRightIcon /></Button>
            </div>
        </div>
    )
}

MonthViewNavigation.displayName = 'MonthViewNavigation'
