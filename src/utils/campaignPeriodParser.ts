type PeriodInt = number | bigint

const periodNumberToDate = (timeInt: PeriodInt) =>
  new Date(Number(timeInt)).toLocaleDateString().slice(0, 9)

const parsePeriodForCampaign = (periods: PeriodInt[]) =>
  `${periodNumberToDate(periods[0])} - ${periodNumberToDate(periods[1])}`

export default parsePeriodForCampaign
