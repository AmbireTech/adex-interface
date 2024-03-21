import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Grid, createStyles, Text } from '@mantine/core'
import GoBack from '../common/GoBack/GoBack'
import { dashboardTableElements } from '../Dashboard/mockData'
import CampaignDetailsRow from '../common/Modals/CampaignDetailsModal/CampaignDetailsRow'
import CollapsibleField from '../common/CollapsibleField'

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
  }
}))

const CampaignDetails = () => {
  const { classes } = useStyles()
  const { id } = useParams()
  if (!id || Number.isNaN(parseInt(id, 10))) {
    return <div>Invalid campaign ID</div>
  }

  const campaignDetails = dashboardTableElements.find((item) => item.id === parseInt(id, 10))

  return (
    <>
      <GoBack title="Dashboard" />
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
                value={campaignDetails?.campaignName}
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
                value={campaignDetails?.status}
              />
              <CampaignDetailsRow
                lineHeight="sm"
                textSize="sm"
                title="Served"
                value={campaignDetails?.served}
              />
              <CampaignDetailsRow
                lineHeight="sm"
                textSize="sm"
                title="Budget"
                value={campaignDetails?.budget}
              />
              {/* TODO: Add data for it */}
              <CampaignDetailsRow
                lineHeight="sm"
                title="Created"
                value={campaignDetails?.period.from}
              />
              {/* TODO: Add data for it */}
              <CampaignDetailsRow
                lineHeight="sm"
                textSize="sm"
                title="Starts"
                value={campaignDetails?.period.from}
              />
              {/* TODO: Add data for it */}
              <CampaignDetailsRow
                lineHeight="sm"
                textSize="sm"
                title="Ends"
                value={campaignDetails?.period.to}
              />
              {/* TODO: Add data for it */}
              <CampaignDetailsRow
                lineHeight="sm"
                title="CPM/CPC min"
                value={campaignDetails?.period.to}
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
                    <p>
                      Test, test, test,Test, test, test,Test, test, test,Test, test, test,Test,
                      test, test,
                    </p>
                  </CollapsibleField>
                  <CollapsibleField label="Selected Locations">
                    <p>Test</p>
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
                <div>Test</div>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}

export default CampaignDetails
