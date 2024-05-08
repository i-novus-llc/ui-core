import { Dayjs } from 'dayjs'
import { useCallback } from 'react'

import { INTERVAL_SEPARATOR, OUTPUT_FORMAT } from '../../../const'
import { getValidDayjs } from '../../../dayjs-utils/getValid'

type RangeValue = {
    begin: string | null,
    end: string | null,
}

type Callback = (value: RangeValue) => void

type Config = {
    format: string,
    max: Dayjs | null
    min: Dayjs | null
}

type Limiter = {
    max: Dayjs | null,
    min: Dayjs | null
}

const parseIntervalString = (interval: string): RangeValue => {
    if (!interval) {
        return {
            begin: null,
            end: null,
        }
    }

    const [begin, end] = interval.split(INTERVAL_SEPARATOR)

    return {
        begin: begin?.trim() || null,
        end: end?.trim() || null,
    }
}

const prepareValue = (value: RangeValue, limiter: Limiter, format: string) => {
    let begin = getValidDayjs(value.begin, format)
    let end = getValidDayjs(value.end, format)
    const { min, max } = limiter

    if (begin && end) {
        /**
         * Дата начала не может быть меньше минимально допустимой
         */
        if (min && (begin < min)) {
            begin = min
        }

        /**
         * Дата начала не может быть больше максимально допустимой
         */
        if (max && (begin > max)) {
            begin = max
        }

        /**
         * Дата окончания не может быть больше максимально допустимой
         */
        if (max && (end > max)) {
            end = max
        }

        /**
         * Дата начала не может быть больше даты окончания.
         * В этом случае считаем дату окончания ошибочной и равной дате начала.
         */
        if (begin > end) {
            end = begin
        }
    }

    return ({
        begin: begin?.format(OUTPUT_FORMAT) ?? null,
        end: end?.format(OUTPUT_FORMAT) ?? null,
    })
}

export const useHandleInputCompleteHook = (callback: Callback, config: Config) => {
    const { min, max, format } = config

    return (
        useCallback((value: string) => {
            const parsedValue = parseIntervalString(value)
            const validISODateString = prepareValue(parsedValue, { min, max }, format)

            callback(validISODateString)
        }, [min, max, format, callback])
    )
}
