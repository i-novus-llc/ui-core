import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { ComponentBaseProps, useConfigProvider } from '../core'

import { Input, InputProps } from './Input'

dayjs.extend(customParseFormat)

export interface InputTimeProps extends InputProps, ComponentBaseProps {
    format?: string,
    onChange(date: Date | null): void,
    value?: Date | null
}

export const InputTime = forwardRef<HTMLInputElement, InputTimeProps>((props, ref) => {
    const { value, onChange, prefix, format = 'HH:mm', ...restProps } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [time, setTime] = useState('')

    const onChangeTime = useCallback((value: string) => {
        if (!value) {
            setTime('')

            return
        }

        let newValue = value

        if (value.length === 3 && !value.endsWith(':')) {
            const hours = value.substring(0, 2)
            const minutes = value.substring(2)

            newValue = `${hours}:${minutes}`
        }

        if (!newValue.match(/^([0-2]|0\d|1\d|2[0-3])?(:([0-5]|[0-5]\d)?)?$/)) {
            return
        }

        if (/^(0\d|1\d|2[0-3]):([0-5]\d)$/.test(newValue)) {
            onChange(dayjs(newValue, format).toDate())
        }

        setTime(newValue)
    }, [format, onChange])

    useEffect(() => {
        if (!time) {
            onChange(null)
        }
    }, [onChange, time])

    const getDefaultValue = useMemo(() => {
        if (value) {
            const hours = dayjs(value).hour().toString()
            const minutes = dayjs(value).minute().toString()

            const TwoDigitHours = hours.length === 1 ? `0${hours}` : hours
            const TwoDigitMinutes = minutes.length === 1 ? `0${minutes}` : minutes

            setTime(`${TwoDigitHours}:${TwoDigitMinutes}`)

            return `${TwoDigitHours}:${TwoDigitMinutes}`
        }

        return ''
    }, [value])

    return (
        <Input
            {...restProps}
            ref={ref}
            prefix={prefixCls}
            placeholder="ЧЧ:MM"
            defaultValue={getDefaultValue}
            value={time}
            onChange={onChangeTime}
        />
    )
})

InputTime.displayName = 'InputTime'
