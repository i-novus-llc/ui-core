import { Children, cloneElement, forwardRef, PropsWithChildren, ReactElement } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../../core'

import { Crumb, CrumbProps } from './Crumb'

export type BreadcrumbsProps = PropsWithChildren<ComponentBaseProps>

export const Breadcrumbs = forwardRef<HTMLDivElement, BreadcrumbsProps>((props, ref) => {
    const { prefix, className, style, visible = true, children } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    if (!visible) {
        return null
    }

    return (
        <div ref={ref} className={classNames(className, `${prefixCls}-breadcrumbs`)} style={style}>
            {
                Children.map(children, (child, i) => {
                    const crumb = child as ReactElement<CrumbProps, typeof Crumb>

                    if (crumb && typeof crumb === 'object' && Object.hasOwn(crumb, 'props')) {
                        const { disabled, ...otherProps } = crumb.props

                        const isLast = i === Children.count(children) - 1

                        return cloneElement(crumb, {
                            ...otherProps,
                            disabled: disabled || isLast,
                        })
                    }

                    return null
                })
            }
        </div>
    )
})

Breadcrumbs.displayName = 'Breadcrumbs'
