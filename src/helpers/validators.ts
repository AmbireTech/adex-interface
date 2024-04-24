export const isValidHttpUrl = (inputURL: string) => {
  let url

  try {
    url = new URL(inputURL)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
