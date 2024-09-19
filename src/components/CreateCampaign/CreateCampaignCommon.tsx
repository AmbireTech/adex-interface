import { Text, Code, HoverCard, ActionIcon, Group } from '@mantine/core'
import { Placement } from 'adex-common'
import InfoIcon from 'resources/icons/Info'

export const UtmInfo = ({ title = '', placement }: { title: string; placement?: Placement }) => (
  <HoverCard width={420}>
    <HoverCard.Target>
      <Group>
        <Text size="inherit">{title}</Text>
        <ActionIcon size="sm" variant="transparent">
          <InfoIcon size="100%" />
        </ActionIcon>
      </Group>
    </HoverCard.Target>
    <HoverCard.Dropdown>
      <Text size="md">
        * if checked all manually added UTM tags will be overridden by auto tags in format:{' '}
        <Code>
          {`utm_source=AdEx&utm_term=${
            placement === 'site' ? 'Website' : 'App'
          }&utm_campaign={CAMPAIGN_TITLE}&utm_content={BANNER_SIZE}`}
        </Code>
        {'. '}
        On impression will be added{' '}
        <Code>{`&utm_medium={${placement === 'site' ? 'WEBSITE_DOMAIN' : 'APP_NAME'}}`}</Code>
      </Text>
    </HoverCard.Dropdown>
  </HoverCard>
)
