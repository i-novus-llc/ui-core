import { MutableRefObject, RefCallback, useMemo } from 'react'

export type ReactRef<RefType> = RefCallback<RefType> | MutableRefObject<RefType> | null | undefined

function assignToRef<Ref = any>(ref: ReactRef<Ref>, node: Ref) {
    if (typeof ref === 'function') {
        ref(node)
    } else if (typeof ref === 'object' && ref && 'current' in ref) {
        // eslint-disable-next-line no-param-reassign
        ref.current = node
    }
}

function mergeRefs<Ref>(...refs: Array<ReactRef<Ref>>) {
    return (node: Ref) => {
        refs.forEach((ref) => {
            assignToRef(ref, node)
        })
    }
}

/**
 * Хук для мержа рефов. Может быть использован для мержа внутреннего и forward рефов компонента
 */
export function useComposeRef<Ref>(...refs: Array<ReactRef<Ref> | null | undefined>) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => mergeRefs(...refs), refs)
}
