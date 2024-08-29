import { Dayjs } from 'dayjs'
import { useCallback } from 'react'

import { OUTPUT_FORMAT } from '../../../const'
import { getValidDayjs, dateLimiter, type DateLimit } from '../../../dayjs-utils'

type Callback = (value: string | null) => void

type Config = {
    format: string,
    max: Dayjs | null
    min: Dayjs | null
    dateLimit: DateLimit
}

type Limiter = {
    max: Dayjs | null,
    min: Dayjs | null
}

const prepareValue = (value: string, limiter: Limiter, format: string, dateLimit: DateLimit) => {
    let date = getValidDayjs(value, format)
    const { min, max } = limiter

    date = dateLimiter(date, dateLimit)

    if (!date) {
        return null
    }

    if (min && date < min) {
        return min.format(OUTPUT_FORMAT)
    }

    if (max && (date > max)) {
        return max.format(OUTPUT_FORMAT)
    }

    return date.format(OUTPUT_FORMAT)
}

export const useHandleInputCompleteHook = (callback: Callback, config: Config) => {
    const { min, max, format, dateLimit } = config

    return (
        useCallback((value: string) => {
            const validISODateString = prepareValue(value, { min, max }, format, dateLimit)

            callback(validISODateString)
        }, [min, max, format, dateLimit, callback])
    )
}
