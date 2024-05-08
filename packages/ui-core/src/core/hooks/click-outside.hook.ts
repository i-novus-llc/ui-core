import { MutableRefObject, useEffect } from 'react'

export const useClickOutside = (
    refList: Array<MutableRefObject<HTMLElement | null>>,
    callback?: Function,
) => {
    useEffect(() => {
        const clickHandler = (event: any) => {
            if (
                !refList.length ||
                refList.some(item => item.current?.contains(event.target))
            ) { return }

            callback?.(event)
        }

        document.addEventListener('mousedown', clickHandler)
        document.addEventListener('touchstart', clickHandler)

        return () => {
            document.removeEventListener('mousedown', clickHandler)
            document.removeEventListener('touchstart', clickHandler)
        }
    }, [refList, callback])
}
