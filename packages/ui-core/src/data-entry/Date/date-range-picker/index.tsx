import { FocusEvent, forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import classNames from 'classnames'

import { Calendar } from '../../../data-display/Calendar/Calendar'
import { Popover } from '../../../data-display/Popover'
import { PopoverPlacement } from '../../../data-display/Popover/types'
import { Paper } from '../../../layout/Paper'
import { CalendarIcon, ComponentBaseProps, useConfigProvider } from '../../../core'
import { InputProps } from '../../Input'
import { InputMask } from '../../InputMask'
import { dateRangePicker } from '../../config/mask'
import { getValidDayjs } from '../../dayjs-utils'
import { DATE_FORMAT, INTERVAL_SEPARATOR, TODAY } from '../../const'
import { EChangeType, OnSelectFunc } from '../../../data-display/Calendar/types'
import { useDatePickerInputEvents } from '../hooks/date-picker-input-events'
import { FocusTrap } from '../../../core/components/focus-trap'
import { useForwardedRef } from '../../../core/hooks'

import { useHandleInputCompleteHook } from './hooks/handle-input-complete'
import { useHandleSelectDate } from './hooks/handle-select-date'

dayjs.extend(customParseFormat)

export interface Range {
    begin: Date | string | null,
    end: Date | string | null,
}

export interface DateRangePickerProps extends ComponentBaseProps, Omit<InputProps, 'onChange' | 'value' | 'defaultValue' | 'onBlur'> {
    dateFormat?: string,
    getContainer?(): Element,
    maxDate?: Date | string,
    minDate?: Date | string,
    onBlur?(event?: InputEvent): void,
    onChange(date: Range | null, event?: InputEvent): void,
    outputFormat?: string,
    parentId?: string,
    placement?: PopoverPlacement,
    popupClassName?: string,
    timeFormat?: string
    value?: Range | null
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const DateRangePicker = forwardRef<HTMLInputElement, DateRangePickerProps>((props, ref) => {
    const {
        prefix,
        popupClassName,
        className,
        value = null,
        onChange,
        onBlur,
        onFocus,
        error = false,
        disabled = false,
        readOnly = false,
        placement = 'bottom',
        parentId = 'popover',
        minDate: min,
        maxDate: max,
        suffixIcon = <CalendarIcon />,
        dateFormat = DATE_FORMAT,
        timeFormat,
        style,
        visible = true,
        getContainer,
        ...restProps
    } = props
    const isCalendarOpen = useRef(false)

    const inputRef = useForwardedRef<HTMLInputElement>(ref)
    const containerRef = useRef<HTMLDivElement>(null)

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    // #region mask config

    const fullFormat = useMemo(() => [dateFormat, timeFormat].filter(Boolean).join(' '), [dateFormat, timeFormat])
    const maskConfig = useMemo(() => dateRangePicker(fullFormat, INTERVAL_SEPARATOR), [fullFormat])

    // #endregion

    // #region calendar data

    const { calendarValue, inputValue } = useMemo(() => {
        const begin = getValidDayjs(value?.begin)
        const end = getValidDayjs(value?.end)

        if (!begin || !end) {
            return ({
                calendarValue: {
                    begin: TODAY.toDate(),
                    end: TODAY.toDate(),
                },
                inputValue: null,
            })
        }

        return ({
            calendarValue: {
                begin: begin.toDate(),
                end: end.toDate(),
            },
            inputValue: `${begin.format(fullFormat)} ${INTERVAL_SEPARATOR} ${end.format(fullFormat)}`,
        })
    }, [fullFormat, value])
    const minDate = useMemo(() => getValidDayjs(min), [min])
    const maxDate = useMemo(() => getValidDayjs(max), [max])
    const beginCalendarProps = useMemo(() => ({ minDate: minDate?.toDate() }), [minDate])
    const endCalendarProps = useMemo(() => ({ maxDate: maxDate?.toDate() }), [maxDate])

    const [canBeClosed, setCanBeClosed] = useState({ begin: false, end: false })
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [beginMaxDate, setBeginMaxDate] = useState(calendarValue.end || maxDate?.toDate())
    const [endMinDate, setEndMinDate] = useState(calendarValue.begin || minDate?.toDate())

    const onOpenCalendar = useCallback(() => {
        setCalendarOpen(true)
    }, [])

    const onCloseCalendar = useCallback(() => {
        setCalendarOpen(false)
    }, [])

    useLayoutEffect(() => {
        setBeginMaxDate(calendarValue.end || maxDate?.toDate())
    }, [calendarValue.end, maxDate])

    useLayoutEffect(() => {
        setEndMinDate(calendarValue.begin || minDate?.toDate())
    }, [calendarValue.begin, minDate])

    useLayoutEffect(() => {
        if (canBeClosed.begin && canBeClosed.end) {
            onCloseCalendar()
        }
    }, [canBeClosed, onCloseCalendar])

    useLayoutEffect(() => {
        isCalendarOpen.current = calendarOpen

        if (!calendarOpen) {
            setCanBeClosed({ begin: false, end: false })
        }
    }, [calendarOpen])

    // #endregion

    // #region calendar handlers

    const { handleSelectBegin: onSelectBegin, handleSelectEnd: onSelectEnd } = useHandleSelectDate(onChange, value)

    const handleSelectBegin = useCallback<OnSelectFunc>((value, meta) => {
        if (meta.changedType !== EChangeType.TIME) {
            setCanBeClosed(state => ({
                ...state,
                begin: true,
            }))
        }

        if (value) {
            setEndMinDate(value)
        }
        onSelectBegin(value)
    }, [onSelectBegin])

    const handleSelectEnd = useCallback<OnSelectFunc>((value, meta) => {
        if (meta.changedType !== EChangeType.TIME) {
            setCanBeClosed(state => ({
                ...state,
                end: true,
            }))
        }

        if (value) {
            setBeginMaxDate(value)
        }
        onSelectEnd(value)
    }, [onSelectEnd])

    // #endregion

    // #region input handlers

    const handleComplete = useHandleInputCompleteHook(onChange, { min: minDate, max: maxDate, format: fullFormat })

    const onFocusCallback = useCallback((event: FocusEvent<HTMLInputElement, Element>) => {
        onOpenCalendar()
        onFocus?.(event)
    }, [onOpenCalendar, onFocus])

    const {
        handleFocus,
        handleBlur,
    } = useDatePickerInputEvents(
        calendarOpen,
        inputRef,
        {
            onFocus: onFocusCallback,
            onEnterKeyDown: onOpenCalendar,
            onBlur,
        },
    )

    // #endregion

    useEffect(() => {
        const parentElement = document.getElementById(parentId)

        parentElement?.addEventListener('scroll', onOpenCalendar)

        return () => {
            parentElement?.removeEventListener('scroll', onOpenCalendar)
        }
    }, [parentId, onOpenCalendar])

    return (
        visible ? (
            <div
                ref={containerRef}
                className={(
                    classNames(
                        `${prefixCls}-date-range-picker`,
                        { [`${prefixCls}-date-range-picker_opened`]: calendarOpen },
                        className,
                    )
                )}
                style={style}
            >
                <Popover
                    closeOnEsc
                    returnFocusRef={inputRef}
                    disabled={disabled}
                    readOnly={readOnly}
                    open={calendarOpen}
                    onOpenChange={setCalendarOpen}
                    placement={placement}
                    className={classNames(popupClassName, `${prefixCls}-date-range-picker-popover`)}
                    getContainer={getContainer}
                    components={{
                        Content: (
                            <FocusTrap>
                                <Paper
                                    display="flex"
                                    direction="horizontal"
                                >
                                    <Calendar
                                        key="begin"
                                        className="calendar_unbordered"
                                        onSelect={handleSelectBegin}
                                        activeStartDate={calendarValue.begin}
                                        maxDate={beginMaxDate}
                                        showTimePicker={Boolean(timeFormat)}
                                        {...beginCalendarProps}
                                    />
                                    <Calendar
                                        key="end"
                                        className="calendar_unbordered"
                                        onSelect={handleSelectEnd}
                                        activeStartDate={calendarValue.end}
                                        minDate={endMinDate}
                                        showTimePicker={Boolean(timeFormat)}
                                        {...endCalendarProps}
                                    />
                                </Paper>
                            </FocusTrap>
                        ),
                    }}
                >
                    <InputMask
                        {...restProps}
                        ref={inputRef}
                        className={classNames('date-range-picker__input')}
                        value={inputValue}
                        prefix={prefixCls}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onComplete={handleComplete}
                        suffixIcon={(
                            <div className={`${prefixCls}-datepicker__suffix-icon-button`}>
                                {suffixIcon}
                            </div>
                        )}
                        disabled={disabled || readOnly}
                        readOnly={readOnly}
                        error={error}
                        maskConfig={maskConfig}
                    />
                </Popover>
            </div>
        ) : null
    )
})

DateRangePicker.displayName = 'DateInterval'
