import React from 'react'
import { Text } from '@mantine/core'
import ActionButton from 'components/common/CustomTable/ActionButton/ActionButton'
import LeftChevronIcon from 'resources/icons/LeftChevron'
import { useNavigate } from 'react-router-dom'

const GoBack = ({ title }: { title: string }) => {
  const navigate = useNavigate()
  const handleClick = () => navigate(-1)

  return (
    <ActionButton action={handleClick} icon={<LeftChevronIcon />} title="Campaign Analytics">
      <Text size="sm">{title}</Text>
    </ActionButton>
  )
}

export default GoBack
