import { ReactNode, useEffect, useState, forwardRef, HTMLProps } from 'react'
import { debounce } from 'throttle-debounce'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'
import { SpinnerIcon } from '../core/icons'
import { Icon } from '../data-display/Icon'

interface SpinProps extends ComponentBaseProps, HTMLProps<HTMLDivElement> {
    delay?: number,
    iconClassName?: string,
    indicator?: ReactNode,
    spinning?: boolean,
    variant?: 'transparent' | 'dimmed'
}

export const Spin = forwardRef<HTMLDivElement, SpinProps>((props, ref) => {
    const {
        className,
        iconClassName,
        prefix,
        indicator = <SpinnerIcon />,
        spinning = true,
        delay = 500,
        variant = 'transparent',
        children,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const [spinningInternal, setSpinningInternal] = useState(false)

    useEffect(() => {
        if (spinning) {
            const showSpinner = debounce(delay, () => { setSpinningInternal(true) })

            showSpinner()

            return () => {
                showSpinner?.cancel()
            }
        }

        return () => {}
    }, [delay, spinning])

    return (
        <div
            ref={ref}
            className={classNames(`${prefixCls}-spin`, `${prefixCls}-spin_${variant}`, {
                [`${prefixCls}-spin_spinning`]: spinning,
            }, className)}
            {...restProps}
        >
            {children}

            {spinningInternal && (
                <div className={`${prefixCls}-spin__container`}>
                    <Icon icon={indicator} className={iconClassName} />
                </div>
            )}
        </div>
    )
})
