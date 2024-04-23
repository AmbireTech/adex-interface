import { Popover, PopoverProps } from '@mantine/core'
import { PropsWithChildren } from 'react'

type CustomPopoverProps = PropsWithChildren &
  PopoverProps & {
    popoverContent: JSX.Element | string
  }

const CustomPopover = ({ popoverContent, children, opened, ...rest }: CustomPopoverProps) => {
  return (
    <Popover width={200} opened={opened} closeOnClickOutside withArrow shadow="md" {...rest}>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>{popoverContent}</Popover.Dropdown>
    </Popover>
  )
}

export default CustomPopover
