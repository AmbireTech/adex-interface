import { Placement } from 'adex-common'

const unknownSrc = '🤷🏼‍♂'

export const getHumneSrcName = (indexString: string, placement: Placement): string => {
  const split = indexString.split('|')
  if (split.length < 4) {
    return indexString
  }
  const id = split[0].replace('i::', '')
  const name = split[1].replace('n::', '')
  const domain = split[2].replace('d::', '')
  const bundle = split[3].replace('b::', '')

  let humne = ''
  switch (placement) {
    case 'app':
      humne = name || bundle || domain || id || indexString || unknownSrc
      break
    case 'site':
      humne = domain || name || id || unknownSrc
      break
    default:
      humne = name || domain || id || bundle || unknownSrc
  }

  return humne.replaceAll('__', '.').replaceAll('-_-', ' ')
}
