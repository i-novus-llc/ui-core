import React, { forwardRef, HTMLAttributes, useMemo, useRef } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { Ellipsis, EllipsisConfig } from './Ellipsis'

const typographyFont = [11, 12, 14, 16, 20] as const

export interface TypographyBodyProps extends ComponentBaseProps, HTMLAttributes<HTMLOrSVGElement> {
    bold?: boolean,
    ellipsis?: EllipsisConfig,
    fontSize?: typeof typographyFont[number] | `${typeof typographyFont[number]}`,
    italic?: boolean
    tag?: keyof React.JSX.IntrinsicElements
}

export const TypographyBody = forwardRef<HTMLElement, TypographyBodyProps>((props, ref) => {
    const { className, prefix, fontSize, bold, italic, children, ...restProps } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const innerRef = useRef<HTMLElement>(null)

    const classNamesFactory = useMemo(() => {
        const baseClassName = `${prefixCls}-typography`

        return classNames(baseClassName, {
            [`${baseClassName}_bold`]: bold,
            [`${baseClassName}_italic`]: italic,
            [`${baseClassName}-font_${fontSize}`]: fontSize && typographyFont.includes(Number(fontSize) as typeof typographyFont[number]),
        }, className)
    }, [bold, className, fontSize, italic, prefixCls])

    return (
        <Ellipsis ref={ref || innerRef} className={classNamesFactory} {...restProps}>
            {children || ''}
        </Ellipsis>
    )
})
