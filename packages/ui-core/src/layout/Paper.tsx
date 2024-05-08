import { CSSProperties, forwardRef, HTMLAttributes, useMemo } from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, useConfigProvider } from '../core'

type ScaleSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17
type BorderRadiusSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface PaperProps extends ComponentBaseProps, HTMLAttributes<HTMLDivElement> {
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
    bgColor?: string,
    borderRadius?: BorderRadiusSize,
    bordered?: boolean,
    bottomLeftRadius?: BorderRadiusSize,
    bottomRightRadius?: BorderRadiusSize,
    direction?: 'vertical' | 'horizontal',
    display?: 'flex' | 'grid' | 'block' | 'inline-block' | 'inline-flex',
    fullWidth?: boolean,
    gap?: ScaleSize,
    height?: 'auto' | 'min-content' | 'max-content' | string | number,
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'baseline',
    margin?: ScaleSize,
    mb?: ScaleSize,
    ml?: ScaleSize,
    mr?: ScaleSize,
    mt?: ScaleSize,
    padding?: ScaleSize,
    pb?: ScaleSize,
    pl?: ScaleSize,
    pr?: ScaleSize,
    pt?: ScaleSize,
    scrollable?: boolean,
    shadow?: boolean,
    topLeftRadius?: BorderRadiusSize,
    topRightRadius?: BorderRadiusSize,
    width?: number | string
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
    const {
        children,
        prefix,
        className,
        bordered = false,
        shadow = false,
        fullWidth,
        borderRadius,
        topLeftRadius,
        bottomLeftRadius,
        topRightRadius,
        bottomRightRadius,
        bgColor = 'white',
        padding,
        pl,
        pr,
        pt,
        pb,
        margin,
        ml,
        mr,
        mt,
        mb,
        display = 'block',
        justify,
        align,
        direction,
        gap,
        scrollable = false,
        height,
        width,
        style,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const paddingClasses = useMemo(() => classNames({
        [`${prefixCls}-paper-padding${padding}`]: padding,
        [`${prefixCls}-paper-pl${pl}`]: Number.isInteger(pl),
        [`${prefixCls}-paper-pr${pr}`]: Number.isInteger(pr),
        [`${prefixCls}-paper-pt${pt}`]: Number.isInteger(pt),
        [`${prefixCls}-paper-pb${pb}`]: Number.isInteger(pb),
    }), [padding, pb, pl, pr, prefixCls, pt])

    const marginClasses = useMemo(() => classNames({
        [`${prefixCls}-paper-margin${margin}`]: margin,
        [`${prefixCls}-paper-ml${ml}`]: Number.isInteger(ml),
        [`${prefixCls}-paper-mr${mr}`]: Number.isInteger(mr),
        [`${prefixCls}-paper-mt${mt}`]: Number.isInteger(mt),
        [`${prefixCls}-paper-mb${mb}`]: Number.isInteger(mb),
    }), [margin, mb, ml, mr, mt, prefixCls])

    const borderClasses = useMemo(() => classNames({
        [`${prefixCls}-paper-bordered`]: bordered,
        [`${prefixCls}-paper-shadow`]: shadow,
        [`${prefixCls}-paper-border-radius-${borderRadius}`]: Number.isInteger(borderRadius),
        [`${prefixCls}-paper-top-left-radius-${topLeftRadius}`]: Number.isInteger(topLeftRadius),
        [`${prefixCls}-paper-bottom-left-radius-${bottomLeftRadius}`]: Number.isInteger(bottomLeftRadius),
        [`${prefixCls}-paper-top-right-radius-${topRightRadius}`]: Number.isInteger(topRightRadius),
        [`${prefixCls}-paper-bottom-right-radius-${bottomRightRadius}`]: Number.isInteger(bottomRightRadius),
    }), [borderRadius, bordered, bottomLeftRadius, topLeftRadius, prefixCls, bottomRightRadius, topRightRadius, shadow])

    const paperClassName = useMemo(() => classNames(
        className,
        `${prefixCls}-paper`,
        paddingClasses,
        marginClasses,
        borderClasses,
        {
            [`${prefixCls}-paper-full-width`]: fullWidth,
            [`${prefixCls}-paper-scrollable`]: scrollable,
            [`${prefixCls}-paper-gap${gap}`]: gap,
            [`${prefixCls}-paper-direction-${direction}`]: direction,
        },
    ), [borderClasses, className, direction, fullWidth, gap, marginClasses, paddingClasses, prefixCls, scrollable])

    const flexStyles: CSSProperties = useMemo(() => ({
        ...(display && { display }),
        ...(justify && { justifyContent: justify }),
        ...(align && { alignItems: align }),
    }), [display, align, justify])

    const heightStyle = useMemo(() => {
        if (Number.isInteger(height)) {
            return `${height}px`
        }

        return height
    }, [height])

    const widthStyle = useMemo(() => {
        if (Number.isInteger(width)) {
            return `${width}px`
        }

        return width
    }, [width])

    const paperStyles: CSSProperties = useMemo(() => ({
        ...(bgColor && { backgroundColor: bgColor }),
        ...(heightStyle && { height: heightStyle }),
        ...(widthStyle && { width: widthStyle }),
        ...flexStyles,
        ...style,
    }), [bgColor, heightStyle, widthStyle, flexStyles, style])

    return (
        <div
            ref={ref}
            className={paperClassName}
            style={paperStyles}
            {...restProps}
        >
            {children}
        </div>
    )
})

Paper.displayName = 'Paper'
