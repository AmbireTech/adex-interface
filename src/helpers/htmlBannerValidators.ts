import { ValidationRegExBanner } from 'types'

const validationRegExBanner: ValidationRegExBanner = {
  image: {
    htmlTag: 'img',
    regExp: /<img[^>]+src="([^">]+)"/
  },
  animatedGIF: {
    htmlTag: 'img',
    regExp: /<img[^>]+src="([^">]+\.gif)"/
  },
  richMedia: { htmlTag: 'div', regExp: /<div.*?>.*?<\/div>/ },
  video: { htmlTag: 'video', regExp: /<video[^>]+src="([^">]+\.mp4)"/ },
  interactive: { htmlTag: 'button', regExp: /<button.*?>.*?<\/button>/ },
  dynamic: { htmlTag: 'p', regExp: /<p.*?id="dynamicText".*?>.*?<\/p>/ }
}

const validateHTMLBannerViaRegExp = (
  html: HTMLElement,
  validator: {
    htmlTag: string
    regExp: RegExp
  }
) => {
  const bannerElement = html.querySelector(validator.htmlTag)
  if (bannerElement) return validator.regExp.test(bannerElement.outerHTML)
  return false
}

export const validateHTMLBanner = (htmlContent: string) => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  const isValidStaticImageBanner = validateHTMLBannerViaRegExp(tempDiv, validationRegExBanner.image)
  const isValidAnimatedGIFBanner = validateHTMLBannerViaRegExp(
    tempDiv,
    validationRegExBanner.animatedGIF
  )
  const isValidHTML5Banner = validateHTMLBannerViaRegExp(tempDiv, validationRegExBanner.richMedia)
  const isValidateRichMediaBanner = validateHTMLBannerViaRegExp(
    tempDiv,
    validationRegExBanner.video
  )
  const isValidInteractiveBanner = validateHTMLBannerViaRegExp(
    tempDiv,
    validationRegExBanner.interactive
  )
  const isValidDynamicBanner = validateHTMLBannerViaRegExp(tempDiv, validationRegExBanner.dynamic)

  return (
    isValidStaticImageBanner ||
    isValidAnimatedGIFBanner ||
    isValidHTML5Banner ||
    isValidateRichMediaBanner ||
    isValidInteractiveBanner ||
    isValidDynamicBanner
  )
}
