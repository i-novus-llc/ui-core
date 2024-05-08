import {
    Children,
    cloneElement,
    CSSProperties,
    forwardRef,
    HTMLAttributes, HTMLProps,
    ReactElement, useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import classNames from 'classnames'

import { ComponentBaseProps, CompoundComponent, useConfigProvider } from '../core'
import { Button } from '../general/Button'

export interface TabsProps extends ComponentBaseProps, Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    activeTabPaneId: string
    direction?: 'row' | 'column',
    onChange?(activeTabPaneId: string): void,
    variant?: 'primary' | 'secondary'
}

export interface TabPaneProps extends ComponentBaseProps, Omit<HTMLProps<HTMLButtonElement>, 'onChange' | 'type'> {
    id: string
    isActive?: boolean
    onChange?(activeTabPaneId: string): void
}

const TabsBody = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
    const {
        prefix,
        className,
        activeTabPaneId,
        onChange,
        variant = 'primary',
        direction = 'row',
        children,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const activeTabPaneRef = useRef<HTMLButtonElement | null>(null)

    const [tabsStyles, setTabsStyles] = useState({
        width: 0,
        height: 0,
        left: 0,
        top: 0,
    })

    useEffect(() => {
        if (!activeTabPaneRef.current) {
            return
        }

        const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = activeTabPaneRef.current

        setTabsStyles({
            width: offsetWidth,
            height: offsetHeight,
            left: offsetLeft,
            top: offsetTop,
        })
    }, [activeTabPaneId])

    return (
        <div
            ref={ref}
            className={classNames(
                `${prefixCls}-tabs`,
                `${prefixCls}-tabs_variant-${variant}`,
                `${prefixCls}-tabs_direction-${direction}`,
                className,
            )}
            style={{
                '--width': `${tabsStyles.width}px`,
                '--height': `${tabsStyles.height}px`,
                '--left': `${tabsStyles.left}px`,
                '--top': `${tabsStyles.top}px`,
            } as CSSProperties}
            {...restProps}
        >
            {
                Children.map(children, (child) => {
                    if (child && typeof child === 'object' && Object.hasOwn(child, 'props')) {
                        const childTabPane = (child as ReactElement<TabPaneProps, typeof TabPane>)

                        const { id, ...restTabPaneProps } = childTabPane.props

                        const isActive = Boolean(id) && Boolean(id === activeTabPaneId)

                        return cloneElement(childTabPane, {
                            ...restTabPaneProps,
                            id,
                            isActive,
                            onChange,
                            ref: isActive ? activeTabPaneRef : undefined,
                        })
                    }

                    return null
                })
            }
        </div>
    )
})

const TabPane = forwardRef<HTMLButtonElement, TabPaneProps>((props, ref) => {
    const {
        id,
        className,
        isActive,
        children,
        prefix,
        onChange,
        ...restProps
    } = props

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    const onActiveTabPaneChange = useCallback(() => {
        onChange?.(id)
    }, [id, onChange])

    return (
        <Button
            {...restProps}
            variant='link'
            className={classNames(`${prefixCls}-tab-pane`, {
                [`${prefixCls}-tab-pane_active`]: isActive,
            }, className)}
            onClick={onActiveTabPaneChange}
            ref={ref}
        >
            {children}
        </Button>
    )
})

TabPane.defaultProps = {
    onChange: () => {},
}

export const Tabs = TabsBody as CompoundComponent<TabsProps, {
    TabPane: typeof TabPane
}>

Tabs.TabPane = TabPane

Tabs.displayName = 'Tabs'
TabPane.displayName = 'TabPane'
