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

  const {
    top: calendarTop,
    left: calendarLeft,
    width: calendarWidth,
    height: calendarHeight,
  } = calendarEl.getBoundingClientRect()

  console.log(calendarTop, calendarLeft)

  const toAdjustedLeft = (left: number) => {
    return `calc(${left}px +  var(--left-adjustment, 0px))`
  }

  const toAdjustedTop = (top: number) => {
    return `calc(${top}px + var(--top-adjustment, 0px))`
  }

  const defaultTopValue = toAdjustedTop(
    scrollTop + top + targetHeight + interval - calendarTop
  )

  const defaultLeftValue = toAdjustedLeft(
    scrollLeft + left + targetWidth + interval - calendarLeft
  )

  const topValue = top + scrollTop - calendarHeight - interval

  const leftValue = left + scrollLeft - calendarWidth - interval

  switch (direction) {
    case 'bottom':
      return {
        left: toAdjustedLeft(scrollLeft + left - calendarLeft),
        top: defaultTopValue,
      }

    case 'top':
      return {
        left: toAdjustedLeft(scrollLeft + left - calendarLeft),
        top: topValue >= 0 ? toAdjustedTop(topValue) : defaultTopValue,
      }

    case 'left':
      return {
        left: leftValue > 0 ? toAdjustedLeft(leftValue) : defaultLeftValue,
        top: toAdjustedTop(scrollTop + top - calendarTop),
      }

    case 'right':
      return {
        left: defaultLeftValue,
        top: toAdjustedTop(scrollTop + top - calendarTop),
      }

    default:
      return {}
  }
}
