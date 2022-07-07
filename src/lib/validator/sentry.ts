import { } from 'types'

type Pagination = {
    total_pages: number,
    page: number
}

type Channel = {
    leader: string,
    follower: string,
    guardian: string,

}

type ChannelListQuery = {
    page: number,
    validator: string,
    chains: Array<number>
}

export async function get(params: ChannelListQuery): Promise<{ channels: Array<Channel>, pagination: Pagination }> {

    return { channels: [], pagination: { total_pages: 1, page: 1 } }
}