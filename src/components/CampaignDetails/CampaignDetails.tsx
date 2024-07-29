import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Container, Grid, createStyles, Text, Flex, Box, Button, Paper, Stack } from '@mantine/core'
import { modals } from '@mantine/modals'
import BadgeStatusCampaign from 'components/Dashboard/BadgeStatusCampaign'
import { formatCatsAndLocsData } from 'helpers/createCampaignHelpers'
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
import ActionButton from 'components/common/CustomTable/ActionButton/ActionButton'
import AnalyticsIcon from 'resources/icons/Analytics'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { AdminBadge } from 'components/common/AdminBadge'
import EditCampaign from 'components/EditCampaign'
import { CustomConfirmModalBody } from 'components/common/Modals/CustomConfirmModal/CustomConfirmModalBody'
import DeleteIcon from 'resources/icons/Delete'
import CatsLocsFormatted from './CatsLocsFormatted'
import { AdminActions } from './AdminActions'

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: theme.colors.mainBackground[theme.fn.primaryShade()],
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    boxShadow: theme.shadows.sm
  },
  innerWrapper: {
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    border: '1px solid',
    borderRadius: theme.radius.md,
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    maxWidth: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`
  },
  lighterColor: {
    color:
      theme.colors.secondaryText[theme.fn.primaryShade()] +
      theme.other.shades.hexColorSuffix.lighter
  },
  scrollableContainer: {
    maxHeight: 300,
    overflowY: 'auto'
  },
  separator: {
    borderBottom: `1px dashed ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`,
    margin: `${theme.spacing.sm} 0`
  },
  actionIcons: {
    color: theme.colors.secondaryText[3],
    margin: '3px',
    padding: '0 15px',
    '&.active': {
      color: theme.colors.success[3],
      '&:hover': {
        color: theme.colors.success[3],
        background: theme.fn.lighten(theme.colors.success[3], theme.other.shades.lighten.lightest)
      }
    },
    '&.paused': {
      color: theme.colors.paused[3],
      '&:hover': {
        color: theme.colors.paused[3],
        background: theme.fn.lighten(theme.colors.paused[3], theme.other.shades.lighten.lightest)
      }
    },
    '&.stopped': {
      '&:hover': {
        color: theme.colors.stopped[3]
      },
      '&.selected': {
        color: theme.colors.stopped[3],
        background: theme.fn.lighten(theme.colors.stopped[3], theme.other.shades.lighten.lightest)
      }
    },
    '&.archived': {
      '&:hover': {
        color: theme.colors.mainText[3]
      },
      '&.selected': {
        color: theme.colors.mainText[3],
        background: theme.fn.lighten(theme.colors.mainText[3], theme.other.shades.lighten.lightest)
      }
    },
    '&.edit': {
      '&:hover': {
        color: theme.colors.mainText[3]
      },
      '&.selected': {
        color: theme.colors.mainText[3],
        background: theme.fn.lighten(theme.colors.mainText[3], theme.other.shades.lighten.lightest)
      }
    }
  }
}))

const CampaignDetails = ({ isAdminPanel }: { isAdminPanel?: boolean }) => {
  const { classes, cx } = useStyles()
  const {
    campaignsData,
    updateCampaignDataById,
    changeCampaignStatus,
    toggleArchived,
    deleteDraftCampaign
  } = useCampaignsData()
  const { showNotification } = useCustomNotifications()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { id } = useParams()

  if (!id) {
    return <div>Missing ID</div>
  }

  const campaignData = useMemo(() => campaignsData.get(id), [id, campaignsData])

  const campaign = useMemo(() => campaignData?.campaign, [campaignData])

  const handleArchive = useCallback(() => {
    if (!campaign?.id) {
      return
    }

    const confirm = campaign?.archived ? 'Unarchive' : 'Archive'

    return modals.openConfirmModal({
      title: `${confirm} Campaign`,
      children: (
        <CustomConfirmModalBody
          text={`Are you sure want to ${confirm} campaign "${campaign?.title}"`}
        />
      ),
      labels: { confirm, cancel: 'Cancel' },
      confirmProps: { color: campaign?.archived ? 'blue' : 'red' },
      onConfirm: () => {
        toggleArchived(campaign?.id || '')
        updateCampaignDataById(campaign?.id)
        showNotification('info', `Campaign ${campaign?.archived ? 'Unarchived' : 'Archived'}`)
      }
    })
  }, [
    campaign?.archived,
    campaign?.id,
    campaign?.title,
    showNotification,
    toggleArchived,
    updateCampaignDataById
  ])

  const handleStopOrDelete = useCallback(() => {
    if (!campaign?.id || !campaign?.status) {
      return
    }

    const isDraft = campaign?.status === CampaignStatus.draft

    const confirm = isDraft ? 'Delete Draft' : 'Stop'
    const onConfirm = isDraft
      ? () => {
          deleteDraftCampaign(campaign.id)
          showNotification('info', 'Draft campaign deleted!')
          navigate('/dashboard')
        }
      : () => {
          changeCampaignStatus(CampaignStatus.closedByUser, campaign.id)
          updateCampaignDataById(campaign?.id)
          showNotification('info', 'Campaign stopped!')
        }

    return modals.openConfirmModal({
      title: `${confirm} Campaign`,
      children: (
        <CustomConfirmModalBody
          text={`Are you sure want to ${confirm} campaign "${campaign?.title}. This action is irreversible!"`}
        />
      ),
      labels: { confirm: 'Yes', cancel: 'Cancel' },
      confirmProps: { color: campaign?.archived ? 'blue' : 'red' },
      onConfirm
    })
  }, [
    campaign?.archived,
    campaign?.id,
    campaign?.status,
    campaign?.title,
    changeCampaignStatus,
    deleteDraftCampaign,
    navigate,
    showNotification,
    updateCampaignDataById
  ])

  useEffect(() => {
    if (id) {
      updateCampaignDataById(id)
    }
  }, [id, updateCampaignDataById])

  const onAfterEditSubmit = () => updateCampaignDataById(id)

  const canArchive = useMemo(() => {
    return (
      !isAdminPanel &&
      campaign?.status &&
      [
        CampaignStatus.closedByUser,
        CampaignStatus.exhausted,
        CampaignStatus.expired,
        CampaignStatus.rejected
      ].includes(campaign?.status)
    )
  }, [campaign?.status, isAdminPanel])

  const canStop = useMemo(() => {
    return (
      campaign?.status && [CampaignStatus.active, CampaignStatus.paused].includes(campaign?.status)
    )
  }, [campaign?.status])

  const canActivate = useMemo(() => {
    return campaign?.status === CampaignStatus.paused
  }, [campaign?.status])

  const canEdit = useMemo(() => {
    return (
      campaign?.status && [CampaignStatus.active, CampaignStatus.paused].includes(campaign?.status)
    )
  }, [campaign?.status])

  if (!campaign) return <div>Invalid Campaign Id</div>
  return (
    <>
      <Box p="md">
        <Flex direction={{ base: 'column', md: 'row' }} align="flex-start">
          <GoBack fixed title="Dashboard">
            <Paper mx="auto" shadow="xs" radius="lg">
              <Flex>
                <Button
                  className={cx(classes.actionIcons, {
                    active: canActivate
                  })}
                  rightIcon={<ActiveIcon size="15px" />}
                  onClick={() =>
                    canActivate && changeCampaignStatus(CampaignStatus.active, campaign.id)
                  }
                  disabled={!canActivate}
                  variant="subtle"
                >
                  Activate
                </Button>

                <Button
                  className={cx(classes.actionIcons, {
                    paused: campaign.status === CampaignStatus.active
                  })}
                  rightIcon={<PausedIcon size="15px" />}
                  onClick={() =>
                    campaign.status !== CampaignStatus.paused &&
                    changeCampaignStatus(CampaignStatus.paused, campaign.id)
                  }
                  variant="subtle"
                  disabled={campaign.status !== CampaignStatus.active}
                >
                  Pause
                </Button>

                <Button
                  className={cx(classes.actionIcons, {
                    stopped: canStop
                  })}
                  rightIcon={<StopIcon size="15px" />}
                  onClick={handleStopOrDelete}
                  disabled={!canStop}
                  variant="subtle"
                >
                  Stop
                </Button>

                {campaign.status === CampaignStatus.draft ? (
                  <Button
                    className={cx(classes.actionIcons, {
                      archived: true
                    })}
                    rightIcon={<DeleteIcon size="15px" />}
                    onClick={handleStopOrDelete}
                    variant="subtle"
                  >
                    Delete draft
                  </Button>
                ) : (
                  <Button
                    className={cx(classes.actionIcons, 'archived', {
                      selected: canArchive
                    })}
                    rightIcon={<ArchivedIcon size="15px" />}
                    onClick={handleArchive}
                    disabled={!canArchive}
                    variant="subtle"
                  >
                    {campaign.archived ? 'Unarchive' : 'Archive'}
                  </Button>
                )}

                <Button
                  disabled={!canEdit}
                  className={cx(classes.actionIcons, 'edit', {
                    selected: params.get('edit') && campaign.status !== CampaignStatus.draft
                  })}
                  rightIcon={<EditIcon size="15px" />}
                  variant="subtle"
                  onClick={() =>
                    canEdit &&
                    setParams(
                      params.get('edit') && campaign.status !== CampaignStatus.draft
                        ? ''
                        : 'edit=true',
                      { replace: true }
                    )
                  }
                >
                  Edit
                </Button>
              </Flex>
            </Paper>
            <Flex align="center" gap="xs">
              Campaign Analytics
              <ActionButton
                title="View Analytics"
                icon={<AnalyticsIcon size="32px" />}
                action={() => navigate(`/dashboard/campaign-analytics/${campaign.id}`)}
              />
            </Flex>
          </GoBack>
        </Flex>
      </Box>
      <Box mt="xl">
        {campaign.status !== CampaignStatus.closedByUser &&
        campaign.status !== CampaignStatus.draft &&
        params.get('edit') ? (
          <EditCampaign campaign={campaign} onAfterSubmit={onAfterEditSubmit} />
        ) : (
          <Container fluid className={classes.wrapper}>
            {isAdminPanel && <AdminBadge title="Admin Details" />}
            <Grid>
              <Grid.Col md={12} xl={6}>
                <Text weight="bold" size="sm" pb="sm" className={classes.lighterColor}>
                  Overview
                </Text>
                <div className={classes.innerWrapper}>
                  <CampaignDetailsRow
                    lineHeight="sm"
                    textSize="sm"
                    title="Title"
                    value={campaign?.title}
                  />
                  <CampaignDetailsRow
                    lineHeight="sm"
                    textSize="sm"
                    title="Id"
                    nowrap
                    value={campaign?.id}
                  />
                  <CampaignDetailsRow
                    lineHeight="sm"
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
                    lineHeight="sm"
                    textSize="sm"
                    title="Served"
                    // value={campaignData?.share}
                    value=""
                  />
                  {/* TODO: Add data for it */}
                  <CampaignDetailsRow
                    lineHeight="sm"
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
                    lineHeight="sm"
                    title="Created"
                    value={formatDateTime(new Date(Number(campaign.created)))}
                  />
                  <CampaignDetailsRow
                    lineHeight="sm"
                    textSize="sm"
                    title="Starts"
                    value={
                      campaign.activeFrom
                        ? formatDateTime(new Date(Number(campaign.activeFrom)))
                        : 'N/A'
                    }
                  />
                  <CampaignDetailsRow
                    lineHeight="sm"
                    textSize="sm"
                    title="Ends"
                    value={
                      campaign.activeTo
                        ? formatDateTime(new Date(Number(campaign.activeTo)))
                        : 'N/A'
                    }
                  />
                  <CampaignDetailsRow
                    lineHeight="sm"
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
                    lineHeight="sm"
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
                    lineHeight="sm"
                    textSize="sm"
                    title="Limit average daily spending"
                    value={
                      campaign.targetingInput.inputs.advanced.limitDailyAverageSpending
                        ? 'Yes'
                        : 'No'
                    }
                  />
                  <CampaignDetailsRow
                    lineHeight="sm"
                    textSize="sm"
                    title="Last modified by"
                    noBorder
                    value={
                      <Stack spacing="xs" align="end">
                        <Text size="sm">{campaign.lastModifiedBy}</Text>
                        <Text size="xs" color="dimmed">
                          {new Date(Number(campaign.modified)).toLocaleString()}
                        </Text>
                      </Stack>
                    }
                  />
                </div>
              </Grid.Col>
              <Grid.Col md={12} xl={6}>
                <Grid>
                  <Grid.Col span={12}>
                    <Text weight="bold" size="sm" pb="sm" className={classes.lighterColor}>
                      Targeting
                    </Text>
                    <div className={classes.innerWrapper}>
                      <CatsLocsFormatted
                        title="Selected Categories"
                        arr={formatCatsAndLocsData(
                          campaign.targetingInput.inputs.categories,
                          CATEGORIES
                        )}
                      />
                      <CatsLocsFormatted
                        title="Selected Countries"
                        arr={formatCatsAndLocsData(
                          campaign.targetingInput.inputs.location,
                          COUNTRIES
                        )}
                      />
                    </div>
                  </Grid.Col>
                </Grid>
                {campaign.adUnits.length ? (
                  <>
                    <Grid>
                      <Grid.Col span={12}>
                        <Text weight="bold" size="sm" pb="sm" className={classes.lighterColor}>
                          Creatives
                        </Text>
                      </Grid.Col>
                    </Grid>
                    <Grid>
                      <Grid.Col span={12}>
                        <div className={cx(classes.innerWrapper, classes.scrollableContainer)}>
                          {campaign.adUnits.map((item: AdUnit, index) => {
                            const isLast = index === campaign.adUnits.length - 1
                            return (
                              <CampaignDetailsRow
                                key={item.id}
                                lineHeight="sm"
                                textSize="sm"
                                title={`${item.banner?.format.w}x${item.banner?.format.h}`}
                                value={
                                  <MediaThumb
                                    adUnit={item}
                                    previewOnClick
                                    title={`Target URL: ${item.banner?.targetUrl}`}
                                  />
                                }
                                noBorder={isLast}
                              />
                            )
                          })}
                        </div>
                      </Grid.Col>
                    </Grid>
                  </>
                ) : null}
              </Grid.Col>

              {isAdminPanel && (
                <Grid.Col md={12} xl={6} pt="xl">
                  <Grid>
                    <Grid.Col span={12}>
                      <Text weight="bold" size="xl" pb="sm" color="attention">
                        Admin actions
                      </Text>
                    </Grid.Col>
                    <Grid.Col>
                      <AdminActions item={campaign} />
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              )}
            </Grid>
          </Container>
        )}
      </Box>
    </>
  )
}

export default CampaignDetails
