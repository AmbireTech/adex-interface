type PeriodInt = number | bigint

export const periodNumberToDate = (timeInt: PeriodInt) =>
  new Date(Number(timeInt)).toLocaleDateString().slice(0, 9)

export const parsePeriodForCampaign = (periods: PeriodInt[]) =>
  `${periodNumberToDate(periods[0])} - ${periodNumberToDate(periods[1])}`
