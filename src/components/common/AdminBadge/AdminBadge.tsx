import { Badge } from '@mantine/core'
import UnderReviewIcon from 'resources/icons/UnderReview'

export const AdminBadge = ({ title = 'Admin' }: { title: string }) => {
  return (
    <Badge
      variant="gradient"
      gradient={{ from: 'violet', to: 'purple' }}
      size="xl"
      mb="md"
      fullWidth
      leftSection={<UnderReviewIcon size="13px" />}
      rightSection={<UnderReviewIcon size="13px" />}
    >
      {title}
    </Badge>
  )
}
