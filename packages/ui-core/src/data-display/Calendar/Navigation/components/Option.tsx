import { FC, useEffect, useRef } from 'react'

import { Button } from '../../../../general/Button'
import { OptionProps } from '../../types'

const OUTLINE_WIDTH = 3

export const Option: FC<OptionProps> = ({
    isSelected,
    parentContainerRef,
    prefix,
    children,
    onClick,
    name,
    id,
    className,
    ...rest
}) => {
    const optionRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (isSelected) {
            const parentRect = parentContainerRef.current?.getBoundingClientRect()
            const optionRect = optionRef.current?.getBoundingClientRect()

            if (optionRect && parentRect) {
                const scrollTop = Math.abs(parentRect.top) - Math.abs(optionRect.top) + OUTLINE_WIDTH

                parentContainerRef.current?.scrollTo(0, Math.abs(scrollTop))
            }
        }
    }, [parentContainerRef, isSelected])

    return (
        <Button
            {...rest}
            id={id}
            name={name}
            variant="link-cancel"
            ref={optionRef}
            className={className}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}
