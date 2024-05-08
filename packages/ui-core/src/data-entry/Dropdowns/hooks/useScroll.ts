import { MutableRefObject, useEffect, useRef } from 'react'

export const useScroll = (
    targetRef: MutableRefObject<HTMLUListElement | null>,
    scrollHandler?: (event: Event, value?: string) => void,
    value?: string,
) => {
    const valueRef = useRef(value)

    valueRef.current = value

    useEffect(() => {
        if (!targetRef.current || !scrollHandler) { return }

        const listContainerElement = targetRef.current as HTMLUListElement

        listContainerElement.addEventListener('scroll', event => scrollHandler(event, valueRef.current))

        // eslint-disable-next-line consistent-return
        return () => {
            listContainerElement.removeEventListener('scroll', scrollHandler)
        }
    }, [targetRef, scrollHandler, valueRef])
}
