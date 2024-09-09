import { forwardRef } from 'react'

import { ClearButtonProps } from '../types'
import { Icon } from '../../../data-display/Icon'

export const ClearButton = forwardRef<HTMLButtonElement, ClearButtonProps>((props, ref) => {
    const {
        clearIcon = true,
        disabled,
        onClick,
        visible,
        className,
    } = props

    if (disabled || !visible || !clearIcon) {
        return null
    }

    const icon = clearIcon === true ? <Icon icon="common-close" /> : clearIcon.icon

    return (
        <button
            ref={ref}
            type="button"
            className={className}
            onClick={onClick}
            tabIndex={0}
        >
            {icon}
        </button>
    )
})
