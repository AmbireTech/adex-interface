import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Grid, Text, Button, Paper, Stack, Group, Divider, Box, Anchor } from '@mantine/core'
import { modals } from '@mantine/modals'
import BadgeStatusCampaign from 'components/Dashboard/BadgeStatusCampaign'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'
import { AdUnit, CampaignStatus } from 'adex-common/dist/types'
import MediaThumb from 'components/common/MediaThumb'
import { formatDateTime } from 'helpers/formatters'
import GoBack from 'components/common/GoBack'
import CampaignDetailsRow from 'components/common/CampainDetailsRow/CampaignDetailsRow'
import { useCampaignsData } from 'hooks/useCampaignsData'
import ActiveIcon from 'resources/icons/Active'
import StopIcon from 'resources/icons/Stop'
import ArchivedIcon from 'resources/icons/Archived'
import FormattedAmount from 'components/common/FormattedAmount/FormattedAmount'
import PausedIcon from 'resources/icons/Paused'
import EditIcon from 'resources/icons/Edit'
import AnalyticsIcon from 'resources/icons/Analytics'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { AdminBadge } from 'components/common/AdminBadge'
import EditCampaign from 'components/EditCampaign'
import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'
import DeleteIcon from 'resources/icons/Delete'
import { StickyPanel } from 'components/TopBar/TopBarStickyPanel'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import CatsLocsFormatted from './CatsLocsFormatted'
import { AdminActions } from './AdminActions'

const CampaignDetails = ({ isAdminPanel }: { isAdminPanel?: boolean }) => {
  const {
    campaignsData,
    updateCampaignDataById,
    changeCampaignStatus,
    toggleArchived,
    deleteDraftCampaign
  } = useCampaignsData()
  const { updateCampaignFromDraft } = useCreateCampaignContext()
  const { showNotification } = useCustomNotifications()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { id } = useParams()

  if (!id) {
    return <div>Missing ID</div>
  }

  const campaignData = useMemo(() => campaignsData.get(id), [id, campaignsData])
  const campaign = useMemo(() => campaignData?.campaign, [campaignData])

  const isEditMode = useMemo(() => params.get('edit'), [params])
  const isDraft = useMemo(() => campaign?.status === CampaignStatus.draft, [campaign?.status])

  const handleArchive = useCallback(() => {
    if (!campaign?.id) {
      return
    }

    const confirm = campaign?.archived ? 'Unarchive' : 'Archive'

    modals.openConfirmModal(
      defaultConfirmModalProps({
        text: `Are you sure want to ${confirm} campaign "${campaign?.title}"`,
        color: campaign?.archived ? 'brand' : 'warning',
        labels: { confirm, cancel: 'Cancel' },
        onConfirm: () => {
          toggleArchived(campaign?.id || '')
          showNotification('info', `Campaign ${campaign?.archived ? 'Unarchived' : 'Archived'}`)
        }
      })
    )
  }, [campaign?.archived, campaign?.id, campaign?.title, showNotification, toggleArchived])

  const handleStopOrDelete = useCallback(() => {
    if (!campaign?.id || !campaign?.status) {
      return
    }

    const confirmLabel = isDraft ? 'Delete Draft' : 'Stop'
    const onConfirm = isDraft
      ? () => {
          deleteDraftCampaign(campaign.id)
          showNotification('info', 'Draft campaign deleted!')
          navigate('/dashboard')
        }
      : () => {
          changeCampaignStatus(CampaignStatus.closedByUser, campaign.id)
          showNotification('info', 'Campaign stopped!')
        }

    modals.openConfirmModal(
      defaultConfirmModalProps({
        text: `Are you sure want to ${confirmLabel} campaign "${campaign?.title}. This action is irreversible!"`,
        color: isDraft ? 'warning' : 'brand',
        labels: { confirm: 'Yes', cancel: 'Cancel' },
        onConfirm
      })
    )
  }, [
    campaign?.id,
    campaign?.status,
    campaign?.title,
    changeCampaignStatus,
    deleteDraftCampaign,
    isDraft,
    navigate,
    showNotification
  ])

  const handleEditDraft = useCallback(() => {
    campaign &&
      updateCampaignFromDraft({
        ...campaign
      })
    navigate('/dashboard/create-campaign', {})
  }, [campaign, updateCampaignFromDraft, navigate])

  useEffect(() => {
    if (id) {
      updateCampaignDataById(id)
    }
  }, [id, updateCampaignDataById])

  const canArchive = useMemo(() => {
    return (
      !isEditMode &&
      !isAdminPanel &&
      campaign?.status &&
      [
        CampaignStatus.closedByUser,
        CampaignStatus.exhausted,
        CampaignStatus.expired,
        CampaignStatus.rejected
      ].includes(campaign?.status)
    )
  }, [campaign?.status, isAdminPanel, isEditMode])

  const canStop = useMemo(() => {
    return (
      !isEditMode &&
      campaign?.status &&
      [CampaignStatus.active, CampaignStatus.paused].includes(campaign?.status)
    )
  }, [campaign?.status, isEditMode])

  const canActivate = useMemo(() => {
    return !isEditMode && campaign?.status === CampaignStatus.paused
  }, [campaign?.status, isEditMode])

  const canPause = useMemo(() => {
    return !isEditMode && campaign?.status === CampaignStatus.active
  }, [campaign?.status, isEditMode])

  const canEdit = useMemo(() => {
    return (
      campaign?.status && [CampaignStatus.active, CampaignStatus.paused].includes(campaign?.status)
    )
  }, [campaign?.status])

  const canEditDraft = useMemo(() => {
    return !isAdminPanel && isDraft
  }, [isAdminPanel, isDraft])

  if (!campaign) return <div>Invalid Campaign Id</div>
  return (
    <Stack gap="xl">
      <StickyPanel>
        <Paper mx="auto" shadow="lg" radius="xl">
          <Group align="center" justify="space-between">
            <GoBack title="Dashboard" />
            <Box>
              <Group gap="xs" p={4} justify="center" w="100%">
                <Button
                  rightSection={<ActiveIcon size="15px" />}
                  onClick={() =>
                    canActivate && changeCampaignStatus(CampaignStatus.active, campaign.id)
                  }
                  color="success"
                  disabled={!canActivate}
                  variant="light"
                >
                  Activate
                </Button>

                <Button
                  rightSection={<PausedIcon size="15px" />}
                  onClick={() =>
                    canPause && changeCampaignStatus(CampaignStatus.paused, campaign.id)
                  }
                  color="paused"
                  variant="subtle"
                  disabled={!canPause}
                >
                  Pause
                </Button>

                <Button
                  rightSection={<StopIcon size="15px" />}
                  onClick={handleStopOrDelete}
                  disabled={!canStop}
                  color="secondaryText"
                  variant="subtle"
                >
                  Stop
                </Button>

                {campaign.status === CampaignStatus.draft ? (
                  <Button
                    rightSection={<DeleteIcon size="15px" />}
                    onClick={handleStopOrDelete}
                    disabled={isAdminPanel}
                    color="warning"
                    variant="subtle"
                  >
                    Delete draft
                  </Button>
                ) : (
                  <Button
                    rightSection={<ArchivedIcon size="15px" />}
                    onClick={handleArchive}
                    disabled={!canArchive}
                    color="secondaryText"
                    variant="subtle"
                  >
                    {campaign.archived ? 'Unarchive' : 'Archive'}
                  </Button>
                )}

                <Button
                  disabled={isDraft ? !canEditDraft : !canEdit}
                  rightSection={<EditIcon size="15px" />}
                  variant={isEditMode ? 'filled' : 'subtle'}
                  color={isEditMode ? 'brand' : 'mainText'}
                  onClick={() =>
                    isDraft
                      ? canEditDraft && handleEditDraft()
                      : canEdit &&
                        setParams(params.get('edit') ? '' : 'edit=true', { replace: true })
                  }
                >
                  {isDraft ? 'Edit draft' : 'Edit'}
                </Button>
              </Group>
            </Box>
            <Button
              fw="normal"
              variant="transparent"
              color="mainText"
              rightSection={<AnalyticsIcon size="26px" />}
              onClick={() =>
                navigate(
                  `/dashboard/campaign-analytics/${isAdminPanel ? 'admin/' : ''}${campaign.id}`
                )
              }
              disabled={campaign?.status === CampaignStatus.draft}
            >
              Campaign Analytics
            </Button>
          </Group>
        </Paper>
        {isAdminPanel && <AdminBadge title="Admin campaign details" />}
      </StickyPanel>

      {isEditMode ? (
        <EditCampaign campaign={campaign} isAdmin={isAdminPanel} />
      ) : (
        <Paper p="lg" shadow="xs">
          <Grid gutter="lg">
            <Grid.Col span={{ md: 12, xl: 6 }}>
              <Stack gap="xl">
                <Text fw="bold" size="sm" c="dimmed">
                  Overview
                </Text>
                <Paper bg="lightBackground" p="md" withBorder>
                  {isAdminPanel && (
                    <CampaignDetailsRow
                      textSize="sm"
                      title="Owner"
                      value={
                        <Anchor
                          underline="never"
                          size="inherit"
                          href={`/dashboard/admin/user-account/${campaign.owner}`}
                          c="secondaryText"
                        >
                          {campaign.owner}
                        </Anchor>
                      }
                    />
                  )}
                  <CampaignDetailsRow textSize="sm" title="Title" value={campaign?.title} />
                  <CampaignDetailsRow textSize="sm" title="Id" value={campaign?.id} />
                  <CampaignDetailsRow
                    textSize="sm"
                    title="Status"
                    value={
                      <span>
                        {campaign?.status === CampaignStatus.rejected &&
                          `${campaign.reviewMessage} `}
                        <BadgeStatusCampaign type={campaign?.status as number} />
                      </span>
                    }
                  />
                  {/* TODO: Add data for it */}
                  <CampaignDetailsRow
                    textSize="sm"
                    title="Served"
                    // value={campaignData?.share}
                    value=""
                  />
                  {/* TODO: Add data for it */}
                  <CampaignDetailsRow
                    textSize="sm"
                    title="Budget"
                    value={
                      <FormattedAmount
                        chainId={campaign.outpaceChainId}
                        tokenAddress={campaign.outpaceAssetAddr}
                        amount={campaign.campaignBudget}
                        tokenDecimals={campaign.outpaceAssetDecimals}
                      />
                    }
                  />
                  <CampaignDetailsRow
                    title="Created"
                    value={formatDateTime(new Date(Number(campaign.created)))}
                  />
                  <CampaignDetailsRow
                    textSize="sm"
                    title="Starts"
                    value={
                      campaign.activeFrom
                        ? formatDateTime(new Date(Number(campaign.activeFrom)))
                        : 'N/A'
                    }
                  />
                  <CampaignDetailsRow
                    textSize="sm"
                    title="Ends"
                    value={
                      campaign.activeTo
                        ? formatDateTime(new Date(Number(campaign.activeTo)))
                        : 'N/A'
                    }
                  />
                  <CampaignDetailsRow
                    title="CPM min"
                    value={
                      campaign.pricingBounds.IMPRESSION?.min && (
                        <FormattedAmount
                          chainId={campaign.outpaceChainId}
                          tokenAddress={campaign.outpaceAssetAddr}
                          amount={campaign.pricingBounds.IMPRESSION.min}
                          tokenDecimals={campaign.outpaceAssetDecimals}
                          isCPMAmount
                        />
                      )
                    }
                  />
                  <CampaignDetailsRow
                    title="CPM max"
                    value={
                      campaign.pricingBounds.IMPRESSION?.max && (
                        <FormattedAmount
                          chainId={campaign.outpaceChainId}
                          tokenAddress={campaign.outpaceAssetAddr}
                          amount={campaign.pricingBounds.IMPRESSION.max}
                          tokenDecimals={campaign.outpaceAssetDecimals}
                          isCPMAmount
                        />
                      )
                    }
                  />
                  <CampaignDetailsRow
                    textSize="sm"
                    title="Limit average daily spending"
                    value={
                      campaign.targetingInput.inputs.advanced.limitDailyAverageSpending
                        ? 'Yes'
                        : 'No'
                    }
                  />
                  <CampaignDetailsRow
                    textSize="sm"
                    title="Last modified by"
                    noBorder
                    value={
                      <Stack gap="xs" align="end">
                        <Text size="sm">{campaign.lastModifiedBy}</Text>
                        <Text size="xs" c="dimmed">
                          {new Date(Number(campaign.modified)).toLocaleString()}
                        </Text>
                      </Stack>
                    }
                  />
                </Paper>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ md: 12, xl: 6 }}>
              <Stack gap="lg">
                <Stack>
                  <Text fw="bold" size="sm" c="dimmed">
                    Targeting
                  </Text>
                  <Paper bg="lightBackground" p="sm" withBorder>
                    <Stack>
                      <CatsLocsFormatted
                        title="Selected Categories"
                        inputValues={campaign.targetingInput.inputs.categories}
                        selectData={CATEGORIES}
                      />
                      <Divider />
                      <CatsLocsFormatted
                        title="Selected Countries"
                        inputValues={campaign.targetingInput.inputs.location}
                        selectData={COUNTRIES}
                      />
                    </Stack>
                  </Paper>
                </Stack>
                {!!campaign.adUnits.length && (
                  <Stack>
                    <Stack>
                      <Text fw="bold" size="sm" c="dimmed">
                        Creatives
                      </Text>
                      <Paper bg="lightBackground" p="sm" withBorder>
                        {campaign.adUnits.map((item: AdUnit, index: number) => {
                          const isLast = index === campaign.adUnits.length - 1
                          return (
                            <CampaignDetailsRow
                              key={item.id}
                              textSize="sm"
                              title={`${item.banner?.format.w}x${item.banner?.format.h}`}
                              value={
                                <MediaThumb
                                  adUnit={item}
                                  previewOnClick
                                  title={`Target URL: ${item.banner?.targetUrl}`}
                                />
                              }
                              align="center"
                              noBorder={isLast}
                            />
                          )
                        })}
                      </Paper>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Grid.Col>

            {isAdminPanel && (
              <Grid.Col span={{ md: 12, xl: 6 }} pt="xl">
                <Stack>
                  <Text fw="bold" size="xl" pb="sm" c="attention">
                    Admin actions
                  </Text>
                  <AdminActions item={campaign} />
                </Stack>
              </Grid.Col>
            )}
          </Grid>
        </Paper>
      )}
    </Stack>
  )
}

export default CampaignDetails
