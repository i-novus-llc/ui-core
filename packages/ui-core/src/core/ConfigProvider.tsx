import { createContext, FC, ReactNode, useContext, useMemo } from 'react'

export const DEFAULT_PREFIX = 'zireael'
export const DEFAULT_ICON_PREFIX = 'zireael-icon'
export const DEFAULT_ROOT = 'ROOT' // Имя рутового класса для кита, куда вешаются рутовые стили

/* eslint-disable react/no-unused-prop-types */
export interface ConfigProviderProps {
    getPrefix?(prefix?: string): string,
    iconPrefix?: string,
    locale?: Intl.Locale['language'],
    prefix?: string,

    root?: string
}

const contextConfig: ConfigProviderProps = {
    locale: 'ru',
    prefix: DEFAULT_PREFIX,
    iconPrefix: DEFAULT_ICON_PREFIX,
    root: DEFAULT_ROOT,
}

export const ConfigProviderContext = createContext<ConfigProviderProps>(contextConfig)

export const useConfigProvider = () => {
    const context = useContext(ConfigProviderContext)

    return {
        ...context,
        getPrefix: (prefix?: string) => {
            if (prefix) {
                return prefix
            }

            return context.prefix
        },
    } as Required<ConfigProviderProps>
}

export const ConfigProvider: FC<{ children: ReactNode, value: ConfigProviderProps }> = (config) => {
    const { value, children } = config

    const contextValue = useMemo(() => {
        return {
            ...contextConfig,
            ...value,
        }
    }, [value])

    return (
        <ConfigProviderContext.Provider value={contextValue}>
            {children}
        </ConfigProviderContext.Provider>
    )
}
