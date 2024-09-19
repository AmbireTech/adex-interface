import { Button } from '@mantine/core'

import LeftChevronIcon from 'resources/icons/LeftChevron'
import { useNavigate } from 'react-router-dom'
import { PropsWithChildren } from 'react'

const GoBack = ({ title, path }: { title: string; path?: string } & PropsWithChildren) => {
  const navigate = useNavigate()
  const handleClick = () => (path ? navigate(path, { replace: true }) : navigate(-1))

  return (
    <Button
      fw="normal"
      variant="transparent"
      color="mainText"
      onClick={handleClick}
      leftSection={<LeftChevronIcon size="26px" />}
    >
      {title}
    </Button>
  )
}

export default GoBack
