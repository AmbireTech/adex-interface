import { forwardRef } from 'react'
import { Anchor, AnchorProps, createPolymorphicComponent } from '@mantine/core'

interface CustomAnchorProps extends AnchorProps {
  external?: boolean
}

const DefaultCustomAnchor = forwardRef<HTMLAnchorElement, CustomAnchorProps>(
  ({ external, children, ...props }, ref) => (
    <Anchor
      {...props}
      target={external ? '_blank' : undefined}
      rel={external ? '' : undefined}
      ref={ref}
    >
      {children}
    </Anchor>
  )
)

const CustomAnchor = createPolymorphicComponent<'a', CustomAnchorProps>(DefaultCustomAnchor)

export default CustomAnchor
