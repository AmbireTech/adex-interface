import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Grid, createStyles, Text, Flex } from '@mantine/core'
import BadgeStatusCampaign from 'components/Dashboard/BadgeStatusCampaign'
import { formatCatsAndLocsData } from 'helpers/createCampaignHelpers'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'
import { AdUnit } from 'adex-common/dist/types'
import MediaBanner from 'components/common/MediaBanner'
import { formatDateTime } from 'helpers/formatters'
import GoBack from 'components/common/GoBack'
import CampaignDetailsRow from 'components/common/CampainDetailsRow/CampaignDetailsRow'
import useCampaignsData from 'hooks/useCampaignsData'
import ActiveIcon from 'resources/icons/Active'
import CampaignActionBtn from 'components/CampaignAnalytics/CampaignActionBtn'
import StopIcon from 'resources/icons/Stop'
import ArchivedIcon from 'resources/icons/Archived'
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
  const { campaignsData, updateCampaignAnalyticsById } = useCampaignsData()
  const { id } = useParams()
  if (!id) {
    return <div>Missing ID</div>
  }

  const campaignDetails = useMemo(
    () => campaignsData.get(id)?.campaign,

    [id, campaignsData]
  )

  useEffect(() => {
    if (id) {
      updateCampaignAnalyticsById(id)
    }
  }, [id, updateCampaignAnalyticsById])

  return (
    <>
      <GoBack title="Dashboard" />
      {campaignDetails && (
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
                  value={campaignDetails?.title}
                />
                <CampaignDetailsRow
                  lineHeight="sm"
                  textSize="sm"
                  title="Id"
                  value={campaignDetails?.id}
                />
                <CampaignDetailsRow
                  lineHeight="sm"
                  textSize="sm"
                  title="Status"
                  value={<BadgeStatusCampaign type={campaignDetails?.status as number} />}
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
                  // value={campaignDetails?.budget}
                  value=""
                />
                <CampaignDetailsRow
                  lineHeight="sm"
                  title="Created"
                  value={
                    campaignDetails && formatDateTime(new Date(Number(campaignDetails.created)))
                  }
                />
                <CampaignDetailsRow
                  lineHeight="sm"
                  textSize="sm"
                  title="Starts"
                  value={
                    campaignDetails && formatDateTime(new Date(Number(campaignDetails.activeFrom)))
                  }
                />
                <CampaignDetailsRow
                  lineHeight="sm"
                  textSize="sm"
                  title="Ends"
                  value={
                    campaignDetails && formatDateTime(new Date(Number(campaignDetails.activeTo)))
                  }
                />
                <CampaignDetailsRow
                  lineHeight="sm"
                  title="CPC min"
                  value={campaignDetails?.pricingBounds.CLICK?.min}
                />
                <CampaignDetailsRow
                  lineHeight="sm"
                  title="CPC max"
                  value={campaignDetails?.pricingBounds.CLICK?.max}
                />
                {/* TODO: Add data for it */}
                <CampaignDetailsRow
                  lineHeight="sm"
                  textSize="sm"
                  title="Limit average daily spending"
                  value={
                    campaignDetails?.targetingInput.inputs.advanced.limitDailyAverageSpending
                      ? 'Yes'
                      : 'No'
                  }
                />
                {/* TODO: Add data for it */}
                <CampaignDetailsRow
                  lineHeight="sm"
                  textSize="sm"
                  title="Disable frequency capping"
                  value={
                    campaignDetails?.targetingInput.inputs.advanced.disableFrequencyCapping
                      ? 'Yes'
                      : 'No'
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
                        campaignDetails.targetingInput.inputs.categories,
                        CATEGORIES
                      )}
                    />
                    <CatsLocsFormatted
                      title="Selected Countries"
                      arr={formatCatsAndLocsData(
                        campaignDetails.targetingInput.inputs.location,
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
                    {campaignDetails &&
                      campaignDetails.adUnits.map((item: AdUnit, index) => {
                        const isLast = index === campaignDetails.adUnits.length - 1
                        return (
                          <CampaignDetailsRow
                            key={item.id}
                            lineHeight="sm"
                            textSize="sm"
                            title={`${item.banner?.format.w}x${item.banner?.format.h}`}
                            value={<MediaBanner adUnit={item} />}
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
                    <CampaignActionBtn
                      text="Activate"
                      icon={<ActiveIcon size="13px" />}
                      color="success"
                      onBtnClicked={() => console.log('Activate btn clicked')}
                    />
                    <CampaignActionBtn
                      text="Stop"
                      icon={<StopIcon size="13px" />}
                      color="stopped"
                      onBtnClicked={() => console.log('Stop btn clicked')}
                    />
                    <CampaignActionBtn
                      text="Archive"
                      icon={<ArchivedIcon size="13px" />}
                      color="secondaryText"
                      onBtnClicked={() => console.log('Archive btn clicked')}
                    />
                  </Flex>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Container>
      )}
    </>
  )
}

export default CampaignDetails
