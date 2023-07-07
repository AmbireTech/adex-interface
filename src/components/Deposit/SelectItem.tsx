import { Group, Text } from '@mantine/core'
import { forwardRef } from 'react'
import { ItemProps } from 'types'

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, ...others }: ItemProps, ref) => {
    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          {image}
          <div>
            <Text size="sm">{label}</Text>
          </div>
        </Group>
      </div>
    )
  }
)

export default SelectItem
