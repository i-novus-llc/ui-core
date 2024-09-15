import { useRef } from 'react'

const MEMO_KEY = Symbol('core-memoized')

interface CB {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]): any
    memoProp?: typeof MEMO_KEY
}

export function useMemoFunction<F extends CB>(cb: F): F
export function useMemoFunction(cb: undefined): undefined
export function useMemoFunction<F extends CB>(cb: F | undefined): (F | undefined)
export function useMemoFunction<F extends CB>(cb: F | undefined): (F | undefined) {
    const fooRef = useRef<{ returnFunction: F, bodyFunction: F }>(null as unknown as { returnFunction: F, bodyFunction: F })

    if (cb === undefined) {
        return undefined
    }

    if (fooRef.current === null) {
        fooRef.current = {
            returnFunction: ((...args: unknown[]) => fooRef.current.bodyFunction(...args)) as F,
            bodyFunction: cb,
        }

        fooRef.current.returnFunction.memoProp = MEMO_KEY
    }

    fooRef.current.bodyFunction = cb

    return fooRef.current.returnFunction
}
