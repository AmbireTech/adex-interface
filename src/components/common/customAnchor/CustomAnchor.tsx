import { forwardRef } from 'react'
import { Anchor, createPolymorphicComponent } from '@mantine/core'
import { CustomAnchorProps } from 'types'

const DefaultCustomAnchor = forwardRef<HTMLAnchorElement, CustomAnchorProps>(
  ({ external, children, color, ...props }, ref) => (
    <Anchor
      {...props}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      ref={ref}
      color={color}
    >
      {children}
    </Anchor>
  )
)

const CustomAnchor = createPolymorphicComponent<'a', CustomAnchorProps>(DefaultCustomAnchor)

export default CustomAnchor
