export const useElementPosition = (
  el: HTMLElement,
  calendarEl: HTMLElement,
  direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
) => {
  const interval = 20
  const scrollTop = document.documentElement.scrollTop
  const scrollLeft = document.documentElement.scrollLeft
  const {
    top,
    left,
    width: targetWidth,
    height: targetHeight,
  } = el.getBoundingClientRect()

  const { width: calendarWidth, height: calendarHeight } =
    calendarEl.getBoundingClientRect()

  const toAdjustedLeft = (left: number) => {
    return `calc(${left}px +  var(--left-adjustment, 0px))`
  }

  const toAdjustedTop = (top: number) => {
    return `calc(${top}px + var(--top-adjustment, 0px))`
  }

  const defaultTopValue = toAdjustedTop(
    scrollTop + top + targetHeight + interval
  )

  const defaultLeftValue = toAdjustedLeft(
    scrollLeft + left + targetWidth + interval
  )

  switch (direction) {
    case 'bottom':
      return {
        left: toAdjustedLeft(scrollLeft + left),
        top: defaultTopValue,
      }

    case 'top':
      const topValue = top + scrollTop - calendarHeight - interval
      return {
        left: toAdjustedLeft(scrollLeft + left),
        top: topValue >= 0 ? toAdjustedTop(topValue) : defaultTopValue,
      }

    case 'left':
      const leftValue = left + scrollLeft - calendarWidth - interval
      return {
        left: leftValue > 0 ? toAdjustedLeft(leftValue) : defaultLeftValue,
        top: toAdjustedTop(scrollTop + top),
      }

    case 'right':
      return {
        left: defaultLeftValue,
        top: toAdjustedTop(scrollTop + top),
      }

    default:
      return {}
  }
}
