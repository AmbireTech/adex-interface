import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Grid, createStyles, Text, Flex } from '@mantine/core'
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
import CampaignActionBtn from 'components/CampaignAnalytics/CampaignActionBtn'
import StopIcon from 'resources/icons/Stop'
import ArchivedIcon from 'resources/icons/Archived'
import FormattedAmount from 'components/common/FormattedAmount/FormattedAmount'
import EditIcon from 'resources/icons/Edit'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { CustomConfirmModal } from 'components/common/Modals'
import CatsLocsFormatted from './CatsLocsFormatted'

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: theme.colors.mainBackground[theme.fn.primaryShade()],
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
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
  }
}))

const CampaignDetails = () => {
  const { classes, cx } = useStyles()
  const { campaignsData, updateCampaignDataById, changeCampaignStatus } = useCampaignsData()
  const { updateCampaignFromDraft } = useCreateCampaignContext()
  const navigate = useNavigate()
  const { showNotification } = useCustomNotifications()

  const { id } = useParams()

  if (!id) {
    return <div>Missing ID</div>
  }

  const campaignData = useMemo(
    () => campaignsData.get(id),

    [id, campaignsData]
  )

  const campaign = useMemo(() => campaignData?.campaign, [campaignData])

  const handleEdit = useCallback(() => {
    if (campaign) {
      updateCampaignFromDraft(campaign)
      navigate('/dashboard/create-campaign')
    } else {
      showNotification('error', 'Editing draft campaign failed', 'Editing draft campaign failed')
    }
  }, [updateCampaignFromDraft, navigate, showNotification, campaign])

  useEffect(() => {
    if (id) {
      updateCampaignDataById(id)
    }
  }, [id, updateCampaignDataById])

  const [open, setOpen] = useState(false)

  const updateOpenState = useCallback(() => setOpen((prev) => !prev), [])

  const handleActionBtnClicked = useCallback(() => {
    updateOpenState()
  }, [updateOpenState])

  const handleConfirmBtnClicked = useCallback(() => {
    campaign && changeCampaignStatus(CampaignStatus.closedByUser, campaign?.id)
    updateOpenState()
  }, [changeCampaignStatus, updateOpenState, campaign])

  useEffect(() => {
    console.log({ campaignsData })
  }, [campaignsData])

  return (
    <>
      <GoBack title="Dashboard" />
      {campaign && (
        <>
          <Container fluid className={classes.wrapper}>
            <Grid>
              <Grid.Col span={6}>
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
              <Grid.Col span={6}>
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
                            value={<MediaThumb adUnit={item} previewOnClick />}
                            noBorder={isLast}
                          />
                        )
                      })}
                    </div>
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col>
                    <Flex justify="flex-end" align="center" gap="xs" mt="xl">
                      {campaign.status === CampaignStatus.paused && (
                        <CampaignActionBtn
                          text="Activate"
                          icon={<ActiveIcon size="13px" />}
                          color="success"
                          onBtnClicked={() =>
                            changeCampaignStatus(CampaignStatus.active, campaign.id)
                          }
                        />
                      )}
                      {campaign.status === CampaignStatus.active && (
                        <CampaignActionBtn
                          text="Pause"
                          icon={<StopIcon size="13px" />}
                          color="paused"
                          onBtnClicked={() =>
                            changeCampaignStatus(CampaignStatus.paused, campaign.id)
                          }
                        />
                      )}
                      {(campaign.status === CampaignStatus.paused ||
                        campaign.status === CampaignStatus.active) && (
                        <CampaignActionBtn
                          text="Close"
                          icon={<ArchivedIcon size="13px" />}
                          color="secondaryText"
                          onBtnClicked={() => handleActionBtnClicked()}
                        />
                      )}
                      {campaign.status === CampaignStatus.draft && (
                        <CampaignActionBtn
                          text="Edit"
                          icon={<EditIcon size="13px" />}
                          color="draft"
                          onBtnClicked={handleEdit}
                        />
                      )}
                      {campaign.status === CampaignStatus.inReview && (
                        <CampaignActionBtn
                          text="Cancel"
                          icon={<ArchivedIcon size="13px" />}
                          color="secondaryText"
                          // onBtnClicked={() =>
                          //   changeCampaignStatus(CampaignStatus.closedByUser, campaign.id)
                          // }
                          onBtnClicked={() => handleActionBtnClicked()}
                        />
                      )}
                    </Flex>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </Container>
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
      )}
    </>
  )
}

export default CampaignDetails
