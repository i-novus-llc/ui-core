import { Dayjs } from 'dayjs'
import { useCallback } from 'react'

import { OUTPUT_FORMAT } from '../../../const'
import { getValidDayjs } from '../../../dayjs-utils/getValid'

type Callback = (value: string | null) => void

type Config = {
    format: string,
    max: Dayjs | null
    min: Dayjs | null
}

type Limiter = {
    max: Dayjs | null,
    min: Dayjs | null
}

const prepareValue = (value: string, limiter: Limiter, format: string) => {
    const date = getValidDayjs(value, format)
    const { min, max } = limiter

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
    const { min, max, format } = config

    return (
        useCallback((value: string) => {
            const validISODateString = prepareValue(value, { min, max }, format)

            callback(validISODateString)
        }, [min, max, format, callback])
    )
}
