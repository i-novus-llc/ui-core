import { cloneElement, FC, forwardRef, JSX, ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react'
import EllipsisComponent from 'react-ellipsis-component'

/* eslint-disable react/no-unused-prop-types */
type EllipsisExtended = {
    expandText?: string,
    expandable?: boolean,
    // Проп для ручного указания высоты обрезаемой строки. Работает только для html в children
    rowHeight?: number,
    rows: number,
    shrinkText?: string
}
/* eslint-enable react/no-unused-prop-types */

export type EllipsisConfig = boolean | EllipsisExtended

export interface EllipsisProps {
    children?: ReactNode,
    className?: string,
    ellipsis?: EllipsisConfig,
    tag?: keyof JSX.IntrinsicElements
}

const isEllipsisExtended = (ellipsis: EllipsisConfig | undefined): ellipsis is EllipsisExtended => {
    return typeof ellipsis === 'object' && ellipsis?.rows !== undefined
}

const enum ExpandState {
    Expanded = 'Expanded',
    NotVisible = 'NotVisible',
    Shrinked = 'Shrinked',
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const Ellipsis = forwardRef<HTMLElement, EllipsisProps>((props, ref) => {
    const { tag: Tag = 'article', className, ellipsis, children, ...restProps } = props

    const rowsMap = useMemo(() => {
        if (isEllipsisExtended(ellipsis) && ellipsis?.rows) {
            return {
                [ExpandState.Expanded]: Number.MAX_SAFE_INTEGER,
                [ExpandState.Shrinked]: ellipsis.rows,
                [ExpandState.NotVisible]: ellipsis.rows,
            }
        }

        return {
            [ExpandState.Expanded]: Number.MAX_SAFE_INTEGER,
            [ExpandState.Shrinked]: 1,
            [ExpandState.NotVisible]: 1,
        }
    }, [ellipsis])

    const [expandState, setExpandState] = useState(ExpandState.NotVisible)

    const htmlEllipsisRef = useRef<HTMLElement>()

    const htmlNodeRowHeight = useMemo(() => {
        const DEFAULT_LINE_HEIGHT = 24

        if (!htmlEllipsisRef.current) {
            return DEFAULT_LINE_HEIGHT
        }

        const computedLineHeight = getComputedStyle(htmlEllipsisRef.current).getPropertyValue('line-height')

        return computedLineHeight ? parseInt(computedLineHeight, 10) : DEFAULT_LINE_HEIGHT
    }, [])

    useLayoutEffect(() => {
        if (typeof children !== 'string' && isEllipsisExtended(ellipsis) && htmlEllipsisRef.current) {
            const nodeHeight = htmlEllipsisRef.current.clientHeight
            const computedNodeRowHeight = ellipsis?.rowHeight || htmlNodeRowHeight
            const ellipsisContentHeight = ellipsis.rows * computedNodeRowHeight

            if (nodeHeight > ellipsisContentHeight) {
                setExpandState(ExpandState.Shrinked)
            } else {
                setExpandState(ExpandState.NotVisible)
            }
        }
        // eslint-disable-next-line
    }, [htmlNodeRowHeight])

    if (!ellipsis) {
        return (
            // @ts-ignore
            <Tag ref={ref} className={className} {...restProps}>
                {children}
            </Tag>
        )
    }

    // eslint-disable-next-line react/no-unstable-nested-components
    const ExpandLabel: FC<EllipsisExtended> = ({ expandable, expandText = 'Развернуть', shrinkText = 'Свернуть' }) => {
        if (!expandable) {
            return null
        }

        const onExpandLabelClick = () => setExpandState(ExpandState.Expanded)
        const onShrinkLabelClick = () => setExpandState(ExpandState.Shrinked)

        if (expandState === ExpandState.Shrinked) {
            return (
                <i className="expand-container">
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <span className="expand-label" onClick={onExpandLabelClick}>{expandText}</span>
                </i>
            )
        }

        if (expandState === ExpandState.Expanded) {
            return (
                <i className="expand-container">
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <span className="expand-label" onClick={onShrinkLabelClick}>{shrinkText}</span>
                </i>
            )
        }

        return null
    }

    if (typeof children !== 'string') {
        if (isEllipsisExtended(ellipsis)) {
            const computedNodeRowHeight = ellipsis?.rowHeight || htmlNodeRowHeight
            const ellipsisContentHeight = ellipsis.rows * computedNodeRowHeight

            return (
                // @ts-ignore
                <Tag ref={ref} className={className} {...restProps}>
                    {/* @ts-ignore */}
                    {cloneElement(children, {
                        ref: htmlEllipsisRef,
                        style: {
                            letterSpacing: 'normal',
                            textRendering: 'auto',
                            width: '100%',
                            boxSizing: 'content-box',
                            wordBreak: 'normal',
                            whiteSpace: 'pre-wrap',
                            minHeight: '0',
                            maxHeight: 'none',
                            display: 'block',
                            visibility: 'hidden',
                            overflow: 'hidden',
                            position: 'absolute',
                            zIndex: '-1000',
                            top: '-1000px',
                            right: '-1000px',
                            pointerEvents: 'none',
                        },
                    })}
                    {/* @ts-ignore */}
                    {cloneElement(children, { style: {
                        height: expandState === ExpandState.Shrinked ? ellipsisContentHeight : 'auto',
                        overflow: 'hidden',
                        whiteSpace: 'pre-wrap',
                    } })}

                    <ExpandLabel {...ellipsis} />
                </Tag>
            )
        }

        return (
            // @ts-ignore
            <Tag ref={ref} className={className} {...restProps}>
                {children}
            </Tag>
        )
    }

    if (isEllipsisExtended(ellipsis)) {
        const onEllipsisCompute = (textTruncated: boolean) => {
            if (textTruncated) {
                setExpandState(ExpandState.Shrinked)
            }
        }

        return (
            // @ts-ignore
            <Tag ref={ref} className={className} {...restProps}>
                <EllipsisComponent
                    key={expandState}
                    text={children}
                    maxLine={rowsMap[expandState]}
                    ellipsis
                    dangerouslyUseInnerHTML
                    reflowOnResize
                    onReflow={onEllipsisCompute}
                />

                <ExpandLabel {...ellipsis} />
            </Tag>
        )
    }

    return (
        // @ts-ignore
        <Tag ref={ref} className={className} {...restProps}>
            <EllipsisComponent
                key={expandState}
                text={children}
                maxLine={rowsMap[expandState]}
                ellipsis={ellipsis}
                dangerouslyUseInnerHTML
                reflowOnResize
            />
        </Tag>
    )
})

Ellipsis.displayName = 'Ellipsis'
