export function shortenedAddress(address: string): string {
    return address.slice(0, 5) + '...' + address.slice(-3)
}