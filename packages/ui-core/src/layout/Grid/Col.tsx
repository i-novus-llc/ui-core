import { forwardRef } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { useRowContext } from './Row'

export interface ColProps extends ComponentBaseProps {
    span?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 // Количество колонок, которое нужно занять внутри Row
}

export const Col = forwardRef<HTMLDivElement, ColProps>((props, ref) => {
    const { className, prefix, span = 0, children } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const rowContext = useRowContext()

    if (rowContext) {
        const { gutter } = rowContext

        return (
            <div
                ref={ref}
                className={classNames(`${prefixCls}-col`, {
                    [`${prefixCls}-col-${span}`]: Number(span) || true,
                }, className)}
                style={{
                    paddingLeft: gutter && gutter / 2,
                    paddingRight: gutter && gutter / 2,
                }}
            >
                {children}
            </div>
        )
    }

    return (
        <div
            ref={ref}
            className={classNames(`${prefixCls}-col`, className)}
        >
            {children}
        </div>
    )
})

Col.displayName = 'Col'
