import { ReactNode, FC } from 'react'
import { ToastContainer, toast, CloseButtonProps, ToastContainerProps } from 'react-toastify'
import type { ToastOptions } from 'react-toastify/dist/types'
import classNames from 'classnames'

import { CloseIcon } from '../core/icons'
import { ComponentBaseProps, useConfigProvider } from '../core'

const DEFAULT_CONTAINER_ID = 'default-container'

const CloseButton: FC<ComponentBaseProps & CloseButtonProps> = ({ prefix, closeToast }) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <button
            type="button"
            className={classNames(`${prefixCls}-notification-close`)}
            onClick={closeToast}
        >
            <CloseIcon />
        </button>
    )
}

export interface NotificationGlobalConfig extends ToastContainerProps {
    prefix?: string,
    size?: 'small' | 'large'
}

export interface NotificationConfig extends ToastOptions {
    containerId?: string | number,
    description?: ReactNode
    icon?: ReactNode,
    title?: ReactNode
}

export interface NotificationContentProps extends Omit<NotificationConfig, 'containerId'> {
    prefix?: string
}

export const NotificationContent: FC<NotificationContentProps> = ({ title, description, prefix }) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div className={classNames(`${prefixCls}-notification-content`)}>
            <div className={classNames(`${prefixCls}-notification-row`)}>
                <span className={classNames(`${prefixCls}-notification-title`)}>{title}</span>
            </div>

            <span className={classNames(`${prefixCls}-notification-description`)}>{description}</span>
        </div>
    )
}

export const useNotification = () => {
    const { prefix } = useConfigProvider()

    const push = (config?: NotificationConfig, CustomComponent?: ReactNode) => {
        return toast(CustomComponent || (
            <NotificationContent
                title={config?.title}
                description={config?.description}
            />
        ), {
            className: classNames(`${prefix}-notification`, CustomComponent && `${prefix}-notification_custom`),
            bodyClassName: CustomComponent ? `${prefix}-notification__body_custom` : '',
            containerId: config?.containerId || DEFAULT_CONTAINER_ID,
            closeButton: !CustomComponent,
            ...config,
        })
    }

    return { push, ...toast }
}

export const NotificationContainer = (globalConfig: NotificationGlobalConfig) => {
    const { closeButton = CloseButton, prefix } = globalConfig

    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <ToastContainer
            enableMultiContainer
            containerId={globalConfig?.containerId || DEFAULT_CONTAINER_ID}
            className={classNames(`${prefixCls}-notification-container_${globalConfig?.size || 'small'}`)}
            role="alert"
            hideProgressBar
            autoClose={false}
            closeButton={closeButton}
            {...globalConfig}
        />
    )
}

export type { Id } from 'react-toastify'
