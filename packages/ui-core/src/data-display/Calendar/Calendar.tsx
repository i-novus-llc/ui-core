import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react'
import ReactCalendar from 'react-calendar'
import classNames from 'classnames'

import { useConfigProvider } from '../../core'

import { Navigation } from './Navigation'
import { CalendarProps, CalendarView, EChangeType, OnActiveStartDateChange, TimePickerProps } from './types'
import { TimePicker } from './Navigation/TimePicker'

type TDateVale = Date | null | [Date | null, Date | null]

const getWeekDayShortLabels = (locale: string | undefined, date: Date) => {
    return new Intl
        .DateTimeFormat(locale || 'ru', { weekday: 'short' })
        .format(date)
}
const monthShortNames = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
]

const getMonthShortName = (locale: string | undefined, date: Date) => {
    const monthIndex = date.getMonth()

    return monthShortNames[monthIndex] || ''
}

const TODAY = new Date()
const BEGINNING_OF_CENTURY = new Date('1900').getFullYear()

const DEFAULT_VIEW: CalendarView = 'month'

const MIN_YEAR = BEGINNING_OF_CENTURY
const MAX_YEAR = TODAY.getFullYear() + 100

type Time = TimePickerProps['value']

const prepareDate = (value: Date, time: Time) => {
    const date = new Date(value)

    date.setHours(
        Number(time.hours),
        Number(time.minutes),
        Number(time.seconds),
    )

    return date
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
    const {
        className,
        prefix,
        locale = 'ru',
        activeStartDate,
        style,
        view = DEFAULT_VIEW,
        onSelect,
        onMouseEnter,
        onMouseLeave,
        minDate,
        maxDate,
        dateAccuracy,
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const calendarContainerRef = useRef<HTMLDivElement>(null)

    const [calendarInitialDate, setCalendarInitialDate] = useState<Date>(activeStartDate || TODAY)
    const [userSelectedDate, setUserSelectedDate] = useState<Date>(activeStartDate || TODAY)
    const [time, setTime] = useState<Time>({ hours: '0', minutes: '0', seconds: '0' })
    const showTimePicker = !!dateAccuracy && ['minute', 'full'].includes(dateAccuracy)

    // #region date select handlers

    const handleChangeTime = useCallback((value: Time) => {
        setTime(value)

        onSelect?.(prepareDate(userSelectedDate, value), { changedType: EChangeType.TIME })
    }, [onSelect, userSelectedDate])

    const handleCalendarDateSelect = useCallback((date: Date) => {
        setUserSelectedDate((selectedDate) => {
            if (date.toISOString() === selectedDate?.toISOString()) {
                return selectedDate
            }

            return date
        })
    }, [])

    const handleActiveStartDateChange: OnActiveStartDateChange = useCallback(({ action, activeStartDate }) => {
        if ((action.startsWith('next') || action.startsWith('prev')) && activeStartDate) {
            setCalendarInitialDate(activeStartDate)
        }
    }, [])

    const handleClickMonth = useCallback((value: Date) => {
        handleCalendarDateSelect(value)
        onSelect?.(prepareDate(value, time), { changedType: EChangeType.MONTH })
    }, [handleCalendarDateSelect, onSelect, time])

    const handleChange = useCallback((value: TDateVale) => {
        if (Array.isArray(value) || !value) { return }

        handleCalendarDateSelect(value)
        onSelect?.(prepareDate(value, time), { changedType: EChangeType.DATE })
    }, [handleCalendarDateSelect, onSelect, time])

    // #endregion

    useLayoutEffect(() => {
        if (!activeStartDate) { return }

        setTime({
            hours: activeStartDate.getHours().toString(),
            minutes: activeStartDate.getMinutes().toString(),
            seconds: activeStartDate.getSeconds().toString(),
        })
        setUserSelectedDate(activeStartDate)
        setCalendarInitialDate(activeStartDate)
    }, [activeStartDate])

    return (
        <div
            ref={calendarContainerRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={classNames(`${prefixCls}-calendar`, className)}
            style={style}
        >
            <Navigation
                prefix={prefixCls}
                view={view}
                initialDate={calendarInitialDate}
                minYear={minDate?.getFullYear() ?? MIN_YEAR}
                maxYear={maxDate?.getFullYear() ?? MAX_YEAR}
                onActiveStartDateChange={handleActiveStartDateChange}
            />
            <ReactCalendar
                inputRef={ref}
                showNeighboringMonth={false}
                showNavigation={false}
                formatShortWeekday={getWeekDayShortLabels}
                formatMonth={getMonthShortName}
                locale={locale}
                className={(
                    classNames(
                        `${prefixCls}-react-calendar`,
                        {
                            [`${prefixCls}-react-calendar--with-timepicker`]: showTimePicker,
                        },
                    )
                )}
                activeStartDate={calendarInitialDate}
                value={userSelectedDate}
                view={view}
                minDate={minDate}
                maxDate={maxDate}
                onChange={handleChange}
                onClickMonth={handleClickMonth}
                onActiveStartDateChange={handleActiveStartDateChange}
            />
            {showTimePicker && (
                <TimePicker
                    prefix={prefixCls}
                    value={time}
                    onChange={handleChangeTime}
                    dateAccuracy={dateAccuracy}
                />
            )}
        </div>
    )
})

Calendar.displayName = 'Calendar'
