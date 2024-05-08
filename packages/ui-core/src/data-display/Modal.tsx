import { FC, HTMLAttributes, MouseEvent, KeyboardEvent, ButtonHTMLAttributes, ReactNode, useEffect } from 'react'
import RCModal, { OnAfterOpenCallback } from 'react-modal'
import classNames from 'classnames'

import { CompoundComponent, ComponentBaseProps, useConfigProvider } from '../core'
import { CloseIcon } from '../core/icons'
import { Button } from '../general/Button'

export interface ModalProps extends ComponentBaseProps, HTMLAttributes<HTMLDivElement> {
    backdrop?: boolean | 'static',
    getContainer?(): HTMLElement,
    onAfterClose?(): void,
    onAfterOpen?: OnAfterOpenCallback,
    onClose?(event: MouseEvent | KeyboardEvent): void,
    open: boolean,
    scrollable?: boolean
    size?: 'sm' | 'lg'
}

export interface ModalHeaderProps extends ComponentBaseProps, HTMLAttributes<HTMLDivElement> {
    closeIcon?: ReactNode,
    onClose?(): void,
    showCloseButton?: boolean
}

export interface ModalContentProps extends ComponentBaseProps, HTMLAttributes<HTMLDivElement> {}

export interface ModalFooterProps extends ComponentBaseProps, HTMLAttributes<HTMLDivElement> {
    cancelText?: string,
    cancelVariant?: 'primary' | 'secondary' | 'delete' | 'link' | 'link-delete' | 'link-cancel',
    disabled?: boolean,
    loading?: boolean,
    okText?: string,
    okVariant?: 'primary' | 'secondary' | 'delete' | 'link' | 'link-delete' | 'link-cancel',
    onCancel?(): void,
    onOk?(): void
}

export type CloseButtonProps = ComponentBaseProps
& Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'className'>
& Pick<ModalHeaderProps, 'closeIcon'>

export const ModalBody: FC<ModalProps> = ({
    prefix,
    onClose = () => {},
    getContainer = () => document.body,
    size = 'sm',
    scrollable = true,
    backdrop = true,
    open,
    onAfterOpen,
    onAfterClose,
    className,
    style,
    children,
}) => {
    const { getPrefix, root } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    useEffect(() => {
        if (backdrop && open) {
            document.body.classList.add('no-scroll')
        }

        return () => {
            document.body.classList.remove('no-scroll')
        }
    }, [backdrop, open])

    return (
        <RCModal
            ariaHideApp={false}
            isOpen={open}
            style={{ content: style }}
            overlayClassName={classNames(
                root,
                `${prefixCls}-modal-overlay`,
                backdrop && `${prefixCls}-modal-overlay_visible`,
                scrollable || `${prefixCls}-modal-overlay_scrollable`,
            )}
            onAfterOpen={onAfterOpen}
            onAfterClose={onAfterClose}
            onRequestClose={onClose}
            parentSelector={getContainer}
            className={classNames(
                `${prefixCls}-modal`,
                `${prefixCls}-modal_${size}`,
                scrollable && `${prefixCls}-modal_scrollable`,
                className,
            )}
            shouldCloseOnOverlayClick={backdrop && backdrop !== 'static'}
        >
            {children}
        </RCModal>
    )
}

export const CloseButton: FC<CloseButtonProps> = ({
    prefix,
    onClick,
    closeIcon,
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <button
            type="button"
            className={`${prefixCls}-modal-close`}
            onClick={onClick}
        >
            {closeIcon || <CloseIcon />}
        </button>
    )
}

export const ModalHeader: FC<ModalHeaderProps> = ({
    prefix,
    showCloseButton = true,
    onClose,
    className,
    children,
    closeIcon,
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div className={classNames(`${prefixCls}-modal-header`, className)}>
            {children}

            {showCloseButton && onClose && <CloseButton onClick={onClose} closeIcon={closeIcon} />}
        </div>
    )
}

export const ModalContent: FC<ModalContentProps> = ({ prefix, className, children }) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div className={classNames(`${prefixCls}-modal-content`, className)}>
            {children}
        </div>
    )
}

export const ModalFooter: FC<ModalFooterProps> = ({
    prefix,
    okText = 'Сохранить',
    cancelText = 'Отменить',
    okVariant = 'link',
    cancelVariant = 'link',
    onOk,
    onCancel,
    loading = false,
    disabled = false,
    className,
    children,
}) => {
    const { getPrefix } = useConfigProvider()

    const prefixCls = getPrefix(prefix)

    return (
        <div className={classNames(`${prefixCls}-modal-footer`, className)}>
            {children}

            {(onCancel || onOk) && (
                <div className={`${prefixCls}-modal-actions`}>
                    {onCancel && (
                        <Button
                            variant={cancelVariant}
                            onClick={onCancel}
                        >
                            {cancelText}
                        </Button>
                    )}

                    {onOk && (
                        <Button
                            variant={okVariant}
                            disabled={disabled}
                            loading={loading}
                            onClick={onOk}
                        >
                            {okText}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

export const Modal = ModalBody as CompoundComponent<ModalProps, {
    Content: typeof ModalContent,
    Footer: typeof ModalFooter,
    Header: typeof ModalHeader
}>

Modal.Header = ModalHeader
Modal.Content = ModalContent
Modal.Footer = ModalFooter

Modal.displayName = 'Modal'
ModalContent.displayName = 'ModalContent'
ModalFooter.displayName = 'ModalFooter'
