import { forwardRef } from 'react'
import classNames from 'classnames'

import { Spin } from '../../../feedback/Spin'
import { Icon } from '../../../data-display/Icon'
import { InputSuffixIconProps } from '../types'

export const InputSuffixIcon = forwardRef<HTMLButtonElement, InputSuffixIconProps>((props, ref) => {
    const { disabled = false, error, loading, className, onClick } = props

    return (
        <button
            ref={ref}
            type="button"
            className={className}
            disabled={disabled}
            onClick={onClick}
        >
            {
                loading
                    ? (<Spin />)
                    : (
                        <Icon
                            icon="chevron-more"
                            className={classNames('dropdown-chevron-icon', {
                                'dropdown-chevron-icon_disabled': disabled,
                                'dropdown-chevron-icon_error': error,
                            })}
                        />
                    )
            }
        </button>
    )
})

InputSuffixIcon.displayName = 'InputSuffixIcon'
