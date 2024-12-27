export type SSPQPSStats = {
  name: string
  qpsConfig?: number
  qpsCurrent: number
  qpsDropped: number
}

export type BaseDSPStats = {
  totalRequests: number
  ortbRequests: number
  throttledRequests: number
  bidRequestsWithNoBids: number
  bidRequestsBidsInTime: number
  bidRequestsWithBidsLate: number
}
export type DspStats = BaseDSPStats & {
  ortbRequestsPerSecond: number
  throttledRequestsPerSecond: number
  last24h: BaseDSPStats
  ssp: SSPQPSStats[]
}
