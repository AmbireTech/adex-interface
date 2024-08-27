export const getRandomHexString = (length: number) => {
  return [...Array(length)]
    .map(() => Math.floor(Math.random() * new Date().valueOf()).toString(16))
    .join('')
}
