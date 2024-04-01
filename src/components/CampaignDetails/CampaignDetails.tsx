import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Grid, createStyles, Text, Flex } from '@mantine/core'

import BadgeStatusCampaign from 'components/Dashboard/BadgeStatusCampaign'
import { formatCatsAndLocsData } from 'helpers/createCampaignHelpers'
import { SelectData } from 'types/createCampaignCommon'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'
import { TargetingInputSingle, AdUnit } from 'adex-common/dist/types'
import MediaBanner from 'components/common/MediaBanner'
import { formatDateTime } from 'helpers/formatters'

import CollapsibleField from 'components/common/CollapsibleField'
import GoBack from 'components/common/GoBack'
import CampaignDetailsRow from 'components/common/CampainDetailsRow/CampaignDetailsRow'
import useCampaignsData from 'hooks/useCampaignsData'

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
  },
  warningColor: {
    color: theme.colors.warning[theme.fn.primaryShade()]
  }
}))

const CampaignDetails = () => {
  const { classes, cx } = useStyles()
  const { campaignsData } = useCampaignsData()
  const { id } = useParams()
  if (!id) {
    return <div>Missing ID</div>
  }

  const campaignDetails = useMemo(
    () => campaignsData.get(id)?.campaign,

    [id, campaignsData]
  )

  const formatCatsAndLocs = useCallback(
    (inputValues: TargetingInputSingle, lib: SelectData[]) => {
      const [key, labels] = formatCatsAndLocsData(inputValues, lib)
      if (!key) return
      if (key === 'all') {
        return <Text>All</Text>
      }
      if (key === 'in') {
        return <Text>{labels}</Text>
      }
      if (key === 'nin') {
        return (
          <Flex>
            <Text>
              <span className={classes.warningColor}>All except: </span>
              {labels}
            </Text>
          </Flex>
        )
      }
    },
    [classes.warningColor]
  )

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
                  value="No"
                />
                {/* TODO: Add data for it */}
                <CampaignDetailsRow
                  lineHeight="sm"
                  textSize="sm"
                  title="Disable frequency capping"
                  value="No"
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
                    <CollapsibleField label="Selected Categories">
                      <Text>
                        {campaignDetails &&
                          formatCatsAndLocs(
                            campaignDetails.targetingInput.inputs.categories,
                            CATEGORIES
                          )}
                      </Text>
                    </CollapsibleField>
                    <div className={classes.separator} />
                    <CollapsibleField label="Selected Locations">
                      {campaignDetails &&
                        formatCatsAndLocs(
                          campaignDetails.targetingInput.inputs.location,
                          COUNTRIES
                        )}
                    </CollapsibleField>
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
            </Grid.Col>
          </Grid>
        </Container>
      )}
    </>
  )
}

export default CampaignDetails
