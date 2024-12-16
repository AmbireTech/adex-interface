export type SSPQPSStats = {
  name: string
  qpsConfig?: number
  qpsCurrent: number
  qpsDropped: number
}
export type DspStats = {
  totalRequests: number
  ortbRequests: number
  throttledRequests: number
  ortbRequestsPerSecond: number
  throttledRequestsPerSecond: number
  bidRequestsWithNoBids: number
  bidRequestsBidsInTime: number
  bidRequestsWithBidsLate: number
  ssp: SSPQPSStats[]
}
