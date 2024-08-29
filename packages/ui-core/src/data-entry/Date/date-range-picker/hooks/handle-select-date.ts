import { useCallback, useLayoutEffect, useState } from 'react'

import { getValidDayjs } from '../../../dayjs-utils'
import { OUTPUT_FORMAT } from '../../../const'

type Range = {
    begin: Date | string | null,
    end: Date | string | null,
}

type TemporaryValue = {
    begin: string | null
    end: string | null
}

const DEFAULT_TEMPORARY_VALUE: TemporaryValue = { begin: null, end: null }

export const useHandleSelectDate = (callback: Function, value: Range | null) => {
    const [tryToFireCallback, setTryToFireCallback] = useState(false)
    const [temporaryValue, setTemporaryValue] = useState(DEFAULT_TEMPORARY_VALUE)

    const handleSelectBegin = useCallback((value: Date | null) => {
        const date = getValidDayjs(value)

        setTemporaryValue(state => ({
            ...state,
            begin: date?.format(OUTPUT_FORMAT) ?? null,
        }))

        setTryToFireCallback(true)
    }, [])

    const handleSelectEnd = useCallback((value: Date | null) => {
        const date = getValidDayjs(value)

        setTemporaryValue(state => ({
            ...state,
            end: date?.format(OUTPUT_FORMAT) ?? null,
        }))

        setTryToFireCallback(true)
    }, [])

    useLayoutEffect(() => {
        setTemporaryValue({
            begin: getValidDayjs(value?.begin)?.format(OUTPUT_FORMAT) ?? null,
            end: getValidDayjs(value?.end)?.format(OUTPUT_FORMAT) ?? null,
        })
    }, [value?.begin, value?.end])

    useLayoutEffect(() => {
        if (tryToFireCallback && temporaryValue.begin && temporaryValue.end) {
            callback(temporaryValue)
        } else {
            setTryToFireCallback(false)
        }
    }, [tryToFireCallback, temporaryValue, callback])

    return { handleSelectBegin, handleSelectEnd }
}
