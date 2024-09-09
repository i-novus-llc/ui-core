import {
    ChangeEvent,
    CSSProperties,
    DetailedHTMLProps,
    FocusEvent,
    HTMLAttributes, JSX, KeyboardEvent,
    MouseEvent,
    ReactElement,
    ReactNode,
} from 'react'

type TBaseProps = {
    className?: string,
    disabled?: boolean
    style?: CSSProperties,
    visible?: boolean
}

type TBaseInputProps<TValue> = {
    id: string
    onBlur?(event: Event | FocusEvent<HTMLInputElement, Element>): void, // void, когда поле ещё не инициализировано
    onChange?(newValue: TValue | null, event: Event | ChangeEvent<HTMLInputElement>): void
    onFocus?(event: Event | FocusEvent<HTMLInputElement, Element>): void
    readonly?: boolean,
    value: TValue | void
}

export type TOption<TValue> = {
    disabled?: boolean,
    id: string,
    label: string
    value: TValue
}

export type DropdownRenderProps<TValue> = {
    onSearch?(search: string, event: Event): void,
    onSelect?(option: TOption<TValue>): void,
    options: Array<TOption<TValue>>,
    selected?: Array<TOption<TValue>>
}

type TProps<TValue> = TBaseProps & TBaseInputProps<TOption<TValue> | Array<TOption<TValue>> | TValue> & {
    dropdownRender?(props: DropdownRenderProps<TValue>): ReactNode,
    hasSearch?: boolean,
    // параметр чтобы дозапрашивать данные при скроле
    loading?: boolean,
    multiple?: boolean,
    // = false
    onOpen?(event: Event | ChangeEvent<HTMLElement>): void,
    // = false
    onScroll?(event: any): void,
    onSearch?(value: string, event: Event | ChangeEvent<HTMLElement>): void,
    options: Array<TOption<TValue>>
}
/** ****************************************************************************** */

export type BaseDropdownProps<TValue> = TProps<TValue> & {
    clearIcon?: boolean,
    emptyText?: string,
    error?: boolean,
    parentId?: string,
    prefix?: string,
    readOnly?: boolean
    selectedInputValue?: string,
    suffixIcon?: ReactElement,
    type?: string
}

export type OptionListProps<TValue> = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
    close?(): void,
    multiple?: boolean,
    onOptionClick(value: Array<TOption<TValue>>, event: MouseEvent<HTMLElement>): void
    onScroll?(event: any): void,
    options: Array<TOption<TValue>>,
    prefix?: string,
    selected?: Array<TOption<TValue>>,
    value?: string
}

export type TagListProps<TValue> = {
    className?: string,
    disabled?: boolean,
    onCloseTag?(id: string, evt: MouseEvent<HTMLElement>): void,
    prefix?: string,
    selectedOptions: Array<TOption<TValue>>
}

export type DropdownInnerComponentProps<TValue> = OptionListProps<TValue>

export type DropdownInputProps<TValue> = Omit<BaseDropdownProps<TValue>, 'onChange' | 'options'> & {
    disableInput?: boolean,
    dropdownInnerComponent(props: DropdownInnerComponentProps<TValue>): JSX.Element,
    dropdownInnerComponentProps: DropdownInnerComponentProps<TValue>,
    onChange(value: string, event?: ChangeEvent<HTMLInputElement>): void,
    onClose?(): void,
    onKeyDown?(event: KeyboardEvent<HTMLInputElement>): boolean
    prefixCls: string,
    selectedInputValue?: unknown,
    type?: string,
    value?: string
}

export type MultipleSelectorProps<TValue> = DropdownInputProps<TValue> & {
    tagListProps: TagListProps<TValue> & {
        handleClearAllSelectedOptions?(event: MouseEvent<HTMLButtonElement>): void
    }
}

export type InputSuffixIconProps = {
    className?: string,
    disabled?: boolean,
    error?: boolean,
    loading?: boolean,
    onClick(event: MouseEvent<HTMLButtonElement>): void
}

export type ClearButtonProps = {
    className?: string,
    clearIcon?: boolean | { icon: ReactNode },
    disabled?: boolean
    error?: boolean,
    onClick(event: MouseEvent<HTMLButtonElement>): void,
    visible: boolean
}
