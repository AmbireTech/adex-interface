import fetch, { RequestInit } from 'node-fetch'


export { fetch }

export async function fetchPost(url: string, body: any): Promise<any> {
    const res = await fetch(url, {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body)
    })
    return res.json()
}

export const fetchGet = async function (url: string): Promise<any> {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status !== 200) throw new Error('Failed to fetch')
    return response.json()
}

export async function fetchCaught(url: string, params?: RequestInit): Promise<{ body?: any, resp?: any, errMsg?: string }> {
    let resp
    try {
        resp = await fetch(url, params)
    } catch (e) {
        console.error(e)
        return { errMsg: `Unexpected error: ${e?.message}` }
    }
    let body
    try {
        body = await resp.json()
    } catch (e) {
        console.error(e)
        return { errMsg: `Unexpected error: ${resp.status}, ${e?.message}`, resp }
    }
    return { body, resp, errMsg: '' }
}