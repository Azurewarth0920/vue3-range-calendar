export const useElementPosition = (
  el: HTMLElement,
  calendarEl: HTMLElement,
  direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
) => {
  const interval = 20
  const {
    top,
    left,
    width: targetWidth,
    height: targetHeight,
  } = el.getBoundingClientRect()

  const { width: calendarWidth, height: calendarHeight } =
    calendarEl.getBoundingClientRect()

  const { top: parentTop, left: parentLeft } =
    calendarEl.offsetParent?.getBoundingClientRect?.() ?? {
      top: 0,
      left: 0,
    }

  const toAdjustedLeft = (left: number) => {
    return `calc(${left}px +  var(--left-adjustment, 0px))`
  }

  const toAdjustedTop = (top: number) => {
    return `calc(${top}px + var(--top-adjustment, 0px))`
  }

  const defaultTopValue = toAdjustedTop(
    top + targetHeight + interval - parentTop
  )

  const defaultLeftValue = toAdjustedLeft(
    left + targetWidth + interval - parentLeft
  )

  const topValue = top - parentTop - calendarHeight - interval

  const leftValue = left - parentLeft - calendarWidth - interval

  switch (direction) {
    case 'bottom':
      return {
        left: toAdjustedLeft(left - parentLeft),
        top: defaultTopValue,
      }

    case 'top':
      return {
        left: toAdjustedLeft(left - parentLeft),
        top: topValue >= 0 ? toAdjustedTop(topValue) : defaultTopValue,
      }

    case 'left':
      return {
        left: leftValue > 0 ? toAdjustedLeft(leftValue) : defaultLeftValue,
        top: toAdjustedTop(top - parentTop),
      }

    case 'right':
      return {
        left: defaultLeftValue,
        top: toAdjustedTop(top - parentTop),
      }

    default:
      return {}
  }
}
