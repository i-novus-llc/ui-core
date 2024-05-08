import { CalendarProps as BaseCalendarProps } from 'react-calendar'
import { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, MutableRefObject } from 'react'

import { ComponentBaseProps } from '../../core'

type OnArgs = Parameters<NonNullable<BaseCalendarProps['onActiveStartDateChange']>>[0]

export type CalendarView = 'year' | 'month'

type HTMLEvents = Pick<HTMLAttributes<HTMLDivElement>, 'onMouseEnter' | 'onMouseLeave'>

export enum EChangeType {
    DATE = 'date',
    MONTH = 'month',
    TIME = 'time',
}
export type OnSelectFunc = (date: Date | null, meta: { changedType: EChangeType }) => void
export interface CalendarProps extends Omit<ComponentBaseProps, 'children' | 'visible' | 'disabled'>, HTMLEvents {
    activeStartDate?: Date | null,
    locale?: string,
    maxDate?: Date,
    minDate?: Date,
    onSelect?: OnSelectFunc,
    showTimePicker?: boolean,
    view?: CalendarView
}

export type OnActiveStartDateChange = ({ action, activeStartDate }: OnArgs) => void

export type NavigationProps = {
    initialDate: Date,
    maxYear: number,
    minYear: number,
    onActiveStartDateChange: OnActiveStartDateChange
    prefix: string,
    view?: CalendarView
}

export type MonthViewNavigationProps = Omit<NavigationProps, 'view'>
export type YearViewNavigationProps = Omit<NavigationProps, 'view'>
export type TimePickerProps = {
    onChange(data: TimePickerProps['value']): void,
    prefix: string,
    value: {
        hours: string
        minutes: string
        seconds: string
    },
}

export type CalendarSelectOptionType = string
export type CalendarSelectOptions = CalendarSelectOptionType[]
export type BaseCalendarSelectProps = {
    initialValue: CalendarSelectOptionType,
    options: CalendarSelectOptions
    prefix: string
}

export type CalendarSelectProps = BaseCalendarSelectProps & {
    expandIconVisibility?: boolean,
    onSelectOption(option: CalendarSelectOptionType): void
} & Pick<HTMLAttributes<HTMLElement>, 'className'>

export type CalendarSelectOptionsProps = BaseCalendarSelectProps & {
    onClickOption(evt: MouseEvent<HTMLButtonElement>): void
}

export type OptionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isSelected: boolean
    onClick(event: MouseEvent<HTMLButtonElement>): void,
    parentContainerRef: MutableRefObject<HTMLDivElement | null>,
    prefix: string
}

export type MonthSelectProps = BaseCalendarSelectProps & {
    onSelectMonth(monthIndex: number): void
}

export type YearSelectProps = BaseCalendarSelectProps & {
    onSelectYear(year: number): void
}

export type NumberSelectProps = BaseCalendarSelectProps & {
    onSelect(data: number): void
}
