import { resetScreen, showScreen, showTooltip } from './surfer/screen'
import { typeLine, eraseLine } from './surfer/typing'
import { delay } from './surfer/utilities'

async function animate(index) {
  index %= 3

  await showScreen(index)
  await typeLine(index)
  await showTooltip(index)
  await delay(5)
  await resetScreen()
  await eraseLine(index)
  await delay(0.15)
  await animate(index + 1)
}

async function initAnimation() {
  await delay(1)
  await animate(0)
}

initAnimation()
