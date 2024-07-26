import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Container, Grid, createStyles, Text, Flex, Box, Button, Paper } from '@mantine/core'
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
// import useCustomNotifications from 'hooks/useCustomNotifications'
import { CustomConfirmModal } from 'components/common/Modals'
import { AdminBadge } from 'components/common/AdminBadge'
import EditCampaign from 'components/EditCampaign'
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
      '&:hover': {
        color: theme.colors.success[3]
      },
      '&.selected': {
        color: theme.colors.success[3],
        background: theme.fn.lighten(theme.colors.success[3], theme.other.shades.lighten.lightest)
      }
    },
    '&.paused': {
      '&:hover': {
        color: theme.colors.paused[3]
      },
      '&.selected': {
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
  const { campaignsData, updateCampaignDataById, changeCampaignStatus } = useCampaignsData()
  // const { showNotification } = useCustomNotifications()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { id } = useParams()

  if (!id) {
    return <div>Missing ID</div>
  }

  const campaignData = useMemo(() => campaignsData.get(id), [id, campaignsData])

  const campaign = useMemo(() => campaignData?.campaign, [campaignData])

  // const handleEdit = useCallback(() => {
  //   if (campaign) {
  //     updateCampaignFromDraft(campaign)
  //     navigate('/dashboard/create-campaign')
  //   } else {
  //     showNotification('error', 'Editing draft campaign failed', 'Editing draft campaign failed')
  //   }
  // }, [updateCampaignFromDraft, navigate, showNotification, campaign])

  useEffect(() => {
    if (id) {
      updateCampaignDataById(id)
    }
  }, [id, updateCampaignDataById])

  const [open, setOpen] = useState(false)

  const updateOpenState = useCallback(
    () => campaign?.status !== CampaignStatus.closedByUser && setOpen((prev) => !prev),
    [campaign]
  )

  const handleConfirmBtnClicked = useCallback(() => {
    campaign && changeCampaignStatus(CampaignStatus.closedByUser, campaign?.id)
    updateOpenState()
  }, [changeCampaignStatus, updateOpenState, campaign])

  const onAfterEditSubmit = () => updateCampaignDataById(id)

  if (!campaign) return <div>Invalid Campaign Id</div>
  return (
    <>
      <Box p="md">
        <Flex direction={{ base: 'column', md: 'row' }} align="flex-start">
          <GoBack fixed title="Dashboard">
            <Paper mx="auto" shadow="xs" radius="lg">
              <Flex>
                <Button
                  className={cx(classes.actionIcons, 'active', {
                    selected: campaign.status === CampaignStatus.active
                  })}
                  rightIcon={<ActiveIcon size="15px" />}
                  onClick={() =>
                    campaign.status !== CampaignStatus.active &&
                    changeCampaignStatus(CampaignStatus.active, campaign.id)
                  }
                  disabled={isAdminPanel}
                  variant="subtle"
                >
                  Activate
                </Button>
                <Button
                  className={cx(classes.actionIcons, 'paused', {
                    selected: campaign.status === CampaignStatus.paused
                  })}
                  rightIcon={<PausedIcon size="15px" />}
                  onClick={() =>
                    campaign.status !== CampaignStatus.paused &&
                    changeCampaignStatus(CampaignStatus.paused, campaign.id)
                  }
                  variant="subtle"
                >
                  Pause
                </Button>
                <Button
                  className={cx(classes.actionIcons, 'stopped', {
                    selected: campaign.status === CampaignStatus.closedByUser
                  })}
                  rightIcon={<StopIcon size="15px" />}
                  // onClick={updateOpenState}
                  disabled={!isAdminPanel}
                  variant="subtle"
                >
                  Stop
                </Button>
                <Button
                  className={cx(classes.actionIcons, 'archived', {
                    selected: campaign.status === CampaignStatus.exhausted
                  })}
                  rightIcon={<ArchivedIcon size="15px" />}
                  disabled
                  variant="subtle"
                >
                  Archive
                </Button>
                <Button
                  disabled={campaign.status === CampaignStatus.draft}
                  className={cx(classes.actionIcons, 'edit', {
                    selected: params.get('edit') && campaign.status !== CampaignStatus.draft
                  })}
                  rightIcon={<EditIcon size="15px" />}
                  variant="subtle"
                  onClick={() =>
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
        {params.get('edit') && campaign.status !== CampaignStatus.draft ? (
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
                    // value={campaignDetails?.served}
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
                    title="Disable frequency capping"
                    value={
                      campaign.targetingInput.inputs.advanced.disableFrequencyCapping ? 'Yes' : 'No'
                    }
                    noBorder
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
      <CustomConfirmModal
        cancelBtnLabel="No"
        confirmBtnLabel="Yes"
        onCancelClicked={() => updateOpenState()}
        onConfirmClicked={() => handleConfirmBtnClicked()}
        color="attention"
        text="Are you sure you want to stop or cancel the campaign?"
        opened={open}
      />
    </>
  )
}

export default CampaignDetails
