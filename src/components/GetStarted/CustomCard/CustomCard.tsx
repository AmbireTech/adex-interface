import { Button, Box, Group, Text, Flex, rem } from '@mantine/core'
import { useState } from 'react'

const CustomCard = ({
  icon,
  color,
  title,
  text,
  buttonLabel,
  action
}: {
  icon: React.ReactNode
  color: string
  title: string
  text: string
  buttonLabel: string
  action: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEvent = () => {
    setIsHovered((prevState) => !prevState)
  }

  const iconStyles = {
    transition: 'transform 0.3s ease-in-out',
    transform: isHovered ? 'scale(1.3)' : 'scale(1)'
  }

  return (
    <Box
      onMouseOver={handleMouseEvent}
      onMouseOut={handleMouseEvent}
      sx={(theme) => ({
        backgroundColor: theme.white,
        textAlign: 'center',
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        height: rem(330),
        width: rem(294),
        transition: 'all 0.3s ease-in-out',
        border: '1px solid',
        borderColor: theme.colors.gray[1],

        '&:hover': {
          backgroundColor: theme.fn.lighten(color, 0.97),
          borderColor: theme.fn.lighten(color, 0.5),
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }
      })}
    >
      <Flex mih={50} gap="sm" justify="center" align="center" direction="column" wrap="wrap">
        <h2>{title}</h2>
        <div style={iconStyles}>{icon}</div>
        <Group position="apart" mt="md" mb="xs">
          <Text size="xl">{text}</Text>
        </Group>
        <Button onClick={action} variant="light" color="green" mt="md" radius="md">
          {buttonLabel}
        </Button>
      </Flex>
    </Box>
  )
}

export default CustomCard
