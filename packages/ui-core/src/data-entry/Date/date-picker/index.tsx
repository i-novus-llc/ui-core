import { FocusEvent, forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import classNames from 'classnames'
import { ReactMaskOpts } from 'react-imask/mixin'

import { CalendarIcon, ComponentBaseProps, useConfigProvider, useForwardedRef, useMemoFunction } from '../../../core'
import { Calendar } from '../../../data-display/Calendar/Calendar'
import { InputProps } from '../../Input'
import { Popover } from '../../../data-display/Popover'
import { PopoverPlacement } from '../../../data-display/Popover/types'
import { InputMask } from '../../InputMask'
import { CalendarView, EChangeType, type OnSelectFunc as HandleSelectDate } from '../../../data-display/Calendar/types'
import { datePicker } from '../../config/mask'
import { getValidDayjs, type DateAccuracy, getDateAccuracy, cutDateByAccuracy } from '../../dayjs-utils'
import { DATE_FORMAT, OUTPUT_FORMAT, TODAY } from '../../const'
import { useDatePickerInputEvents } from '../hooks/date-picker-input-events'
import { FocusTrap } from '../../../core/components/focus-trap'

import { useHandleInputCompleteHook } from './hooks/handle-input-complete.hook'

dayjs.extend(customParseFormat)

export interface DatePickerProps extends ComponentBaseProps, Omit<InputProps, 'onChange' | 'value' | 'defaultValue'> {
    calendarView?: CalendarView,
    dateFormat?: string,
    getContainer?(): Element,
    maskConfig?: ReactMaskOpts,
    maxDate?: Date | string,
    minDate?: Date | string,
    onChange(date: string | null, event?: InputEvent): void,
    parentId?: string,
    placement?: PopoverPlacement,
    popupClassName?: string,
    timeFormat?: string,
    value?: Date | string | null
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
    const {
        className,
        popupClassName,
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
        prefix,
        dateFormat = DATE_FORMAT,
        timeFormat,
        style,
        suffixIcon,
        visible = true,
        getContainer,
        maskConfig,
        calendarView = 'month',
        ...restProps
    } = props
    const inputRef = useForwardedRef<HTMLInputElement>(ref)
    const dateAccuracyRef = useRef<DateAccuracy>('day')

    dateAccuracyRef.current = getDateAccuracy(dateFormat, timeFormat)

    const [calendarOpen, setCalendarOpen] = useState(false)

    const onOpenCalendar = useMemoFunction(() => {
        setCalendarOpen(true)
    })

    const onCloseCalendar = useMemoFunction(() => {
        setCalendarOpen(false)
    })

    const { getPrefix } = useConfigProvider()
    const prefixCls = getPrefix(prefix)

    // #region mask config

    const fullFormat = useMemo(() => [dateFormat, timeFormat].filter(Boolean).join(' '), [dateFormat, timeFormat])
    const mask = useMemo(() => maskConfig ?? datePicker(fullFormat), [fullFormat, maskConfig])

    // #endregion

    // #region calendar data

    const { calendarValue, inputValue } = useMemo(() => {
        const dateRaw = getValidDayjs(value)
        const date = cutDateByAccuracy(dateRaw, dateAccuracyRef.current)

        if (date) {
            return ({
                calendarValue: date.toDate(),
                inputValue: date.format(fullFormat),
            })
        }

        return ({
            calendarValue: (cutDateByAccuracy(TODAY, dateAccuracyRef.current) || TODAY).toDate(),
            inputValue: null,
        })
    }, [fullFormat, value])
    const minDate = useMemo(() => cutDateByAccuracy(getValidDayjs(min), dateAccuracyRef.current), [min])
    const maxDate = useMemo(() => cutDateByAccuracy(getValidDayjs(max), dateAccuracyRef.current), [max])

    // #endregion

    // #region calendar handlers

    const handleSelectDate = useMemoFunction<HandleSelectDate>((newDate, { changedType }) => {
        let newValue = getValidDayjs(newDate)

        if (newValue && minDate && newValue < minDate) {
            newValue = minDate
        }

        if (newValue && maxDate && newValue > maxDate) {
            newValue = maxDate
        }

        const newDateLimited = cutDateByAccuracy(newValue, dateAccuracyRef.current)
        const date = newDateLimited?.format(OUTPUT_FORMAT) || null

        if (changedType !== EChangeType.TIME) {
            onCloseCalendar()
        }

        onChange(date)
    })

    // #endregion

    // #region input handlers

    const handleComplete = useHandleInputCompleteHook(
        onChange,
        {
            min: minDate,
            max: maxDate,
            format: fullFormat,
            dateAccuracy: dateAccuracyRef.current,
        },
    )

    const onFocusCallback = useMemoFunction((event: FocusEvent<HTMLInputElement, Element>) => {
        onOpenCalendar()
        onFocus?.(event)
    })

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
        {
            minDate,
            maxDate,
            dateFormat,
            value,
        },
    )

    useEffect(() => {
        const parentElement = document?.getElementById(parentId)

        parentElement?.addEventListener('scroll', onOpenCalendar)

        return () => {
            parentElement?.removeEventListener('scroll', onOpenCalendar)
        }
    }, [parentId, onOpenCalendar])

    const calendarProps = useMemo(() => ({
        minDate: minDate?.toDate(),
        maxDate: maxDate?.toDate(),
    }), [minDate, maxDate])

    const suffixIconFinal = useMemo(() => (
        <div className={`${prefixCls}-datepicker__suffix-icon-button`}>
            {suffixIcon === undefined ? <CalendarIcon /> : suffixIcon}
        </div>
    ), [prefixCls, suffixIcon])

    return (
        visible ? (
            <div
                className={(
                    classNames(
                        `${prefixCls}-datepicker`,
                        className,
                        {
                            [`${prefixCls}-datepicker_opened`]: calendarOpen,
                        },
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
                    className={classNames(popupClassName, `${prefixCls}-datepicker-popover`)}
                    getContainer={getContainer}
                    components={{
                        Content: (
                            <FocusTrap>
                                <Calendar
                                    onSelect={handleSelectDate}
                                    activeStartDate={calendarValue}
                                    view={calendarView}
                                    dateAccuracy={dateAccuracyRef.current}
                                    {...calendarProps}
                                />
                            </FocusTrap>
                        ),
                    }}
                >
                    <InputMask
                        {...restProps}
                        ref={inputRef}
                        value={inputValue}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onComplete={handleComplete}
                        suffixIcon={suffixIconFinal}
                        className={classNames('datepicker__input')}
                        prefix={prefixCls}
                        disabled={disabled || readOnly}
                        error={error}
                        readOnly={readOnly}
                        maskConfig={mask}
                    />
                </Popover>
            </div>
        ) : null
    )
})

DatePicker.displayName = 'DatePicker'
