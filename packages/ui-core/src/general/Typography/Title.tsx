import React, { forwardRef, useMemo } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { TypographyBody, TypographyBodyProps } from './Typography'

const typographyLevel = [1, 2, 3, 4, 5, 6] as const

export interface TitleProps extends TypographyBodyProps, ComponentBaseProps {
    level?: typeof typographyLevel[number] | `${typeof typographyLevel[number]}`
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
    const { level, className, prefix, ...restProps } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const tag = useMemo(() => {
        if (!level || !typographyLevel.includes(Number(level) as typeof typographyLevel[number])) { return 'h1' }

        return `h${level}`
    }, [level]) as unknown as keyof React.JSX.IntrinsicElements

    return (
        <TypographyBody
            tag={tag}
            ref={ref}
            className={classNames(className, `${prefixCls}-typography-title`)}
            {...restProps}
        />
    )
})
