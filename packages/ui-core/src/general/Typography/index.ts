import { ForwardRefExoticComponent, RefAttributes } from 'react'

import { TypographyBody, TypographyBodyProps } from './Typography'
import { Text } from './Text'
import { Title } from './Title'
import { Link } from './Link'
import { Paragraph } from './Paragraph'

export type TypographyProps = ForwardRefExoticComponent<TypographyBodyProps & RefAttributes<HTMLElement>> & {
    Link: typeof Link,
    Paragraph: typeof Paragraph,
    Text: typeof Text,
    Title: typeof Title
}

export const Typography = TypographyBody as unknown as TypographyProps

Typography.Text = Text
Typography.Title = Title
Typography.Link = Link
Typography.Paragraph = Paragraph

Typography.displayName = 'Typography'
Text.displayName = 'Text'
Title.displayName = 'Title'
Link.displayName = 'Link'
Paragraph.displayName = 'Paragraph'
