import { $, delay } from './utilities'

const deviceClassName = 'device__chrome'
const screenClassName = 'screen__ui--dynamic'
const activeScreenClassName = 'screen__ui--on'
const tooltipClassName = 'tooltip'
const activeTooltipClassName = tooltipClassName + '--on'

const root = $(deviceClassName)[0]
const screenElements = $(root, screenClassName)
const tooltipElements = $(root, tooltipClassName)

export async function showScreen(index) {
  screenElements[index].classList.add(activeScreenClassName)
  delay(1)
}

export async function showTooltip(index) {
  tooltipElements[index].classList.add(activeTooltipClassName)
  delay(0.5)
}

export async function resetScreen() {
  screenElements.forEach(element =>
    element.classList.remove(activeScreenClassName)
  )
  tooltipElements.forEach(element =>
    element.classList.remove(activeTooltipClassName)
  )
  delay(0.5)
}
