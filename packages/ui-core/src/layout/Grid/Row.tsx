import { createContext, CSSProperties, forwardRef, useContext, useMemo } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

export type Gutter = 0 | 4 | 8 | 12 | 16 | 32

export const RowContext = createContext<{ gutter?: Gutter } | null>(null)

export const useRowContext = () => {
    const rowContext = useContext(RowContext)

    if (rowContext === undefined) {
        throw new Error('useRowContext должен быть использован в рамках <RowContext.Provider>')
    }

    return rowContext
}

export interface RowProps extends ComponentBaseProps {
    // Gap между Row контейнерами
    align?: 'top' | 'center' | 'bottom' | 'baseline',
    gutter?: Gutter, // Вертикальное выравнивание
    justify?: 'start' | 'center' | 'end' | 'space-between' // Горизонтальное выравнивание
}

export const Row = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
    const { className, prefix, align, justify, gutter = 0, children } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const rowContextValue = useMemo(() => {
        return { gutter }
    }, [gutter])

    const alignItems = useMemo(() => {
        if (align) {
            const alignMap: Record<NonNullable<RowProps['align']>, CSSProperties['alignItems']> = {
                top: 'flex-start',
                center: 'center',
                bottom: 'flex-end',
                baseline: 'baseline',
            }

            return alignMap[align]
        }

        return undefined
    }, [align])

    const justifyContent = useMemo(() => {
        if (justify) {
            const justifyMap: Record<NonNullable<RowProps['justify']>, CSSProperties['justifyContent']> = {
                start: 'flex-start',
                center: 'center',
                end: 'flex-end',
                'space-between': 'space-between',
            }

            return justifyMap[justify]
        }

        return undefined
    }, [justify])

    return (
        <RowContext.Provider value={rowContextValue}>
            <div
                ref={ref}
                className={classNames(`${prefixCls}-row`, className)}
                style={{
                    marginLeft: Number(`-${gutter && gutter / 2}`),
                    marginRight: Number(`-${gutter && gutter / 2}`),
                    rowGap: gutter,
                    alignItems,
                    justifyContent,
                }}
            >
                {children}
            </div>
        </RowContext.Provider>
    )
})

Row.displayName = 'Row'
