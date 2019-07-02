/* global window */

import { $, debounce, delay, last, onFontsLoaded, translate } from './utilities'

let currentLineIndex = -1
let currentLetterIndex = -1

const rootClassName = 'typing'
const lineClassName = rootClassName + '__line'
const letterClassName = rootClassName + '__letter'

const cursorClassName = rootClassName + '__cursor'
const dimmedCursorClassName = cursorClassName + '--dimmed'

const activeLineClassName = lineClassName + '--on'
const activeLetterClassName = letterClassName + '--on'

const root = $(rootClassName)[0]

const lineElements = $(root, lineClassName)
const lines = lineElements.map(element => element.innerText)

const letters = lines.map(string => string.split(''))
const letterElements = letters.map((lineLetters, index) => {
  const lineElement = lineElements[index]
  lineElement.innerHTML = lineLetters
    .map(l => `<span class="${letterClassName}">${l}</span>`)
    .join('')
  return $(lineElement, letterClassName)
})
const letterCounts = letters.map(lineLetters => lineLetters.length)

const cursorElement = $(root, cursorClassName)[0]
let cursorPositions = []

calculateCursorPositions()
window.addEventListener('resize', debounce(recalculateWidgetLayout, 150), false)
onFontsLoaded(recalculateWidgetLayout)

export async function typeLine(lineIndex) {
  const letterCount = letterCounts[lineIndex]
  let letterIndex = -1

  while (++letterIndex < letterCount) {
    type(lineIndex, letterIndex)

    if (letterIndex < letterCount) {
      await delay(0.065, 0.095)
    }
  }

  recalculateWidgetLayout()
}

export async function eraseLine(lineIndex) {
  let letterIndex = letterCounts[lineIndex]

  while (--letterIndex >= 0) {
    erase(lineIndex, letterIndex)

    if (letterIndex > 0) {
      await delay(0.035)
    }
  }

  recalculateWidgetLayout()
}

function recalculateWidgetLayout() {
  calculateCursorPositions()
  moveCursor(currentLineIndex, currentLetterIndex)
}

function calculateCursorPositions() {
  cursorPositions = letterElements
    .map(lineLetterElements => {
      return lineLetterElements.map(l => l.getBoundingClientRect())
    })
    .map(lineLetterElementRects => {
      return lineLetterElementRects.reduce((positions, letterRect) => {
        const lastPosition = last(positions) || 0
        const currentPosition = lastPosition + Math.round(letterRect.width)
        return positions.concat(currentPosition)
      }, [])
    })
}

function showLine(lineIndex) {
  if (lineIndex === currentLineIndex) {
    return
  }

  hideLine(currentLineIndex)
  lineElements[lineIndex].classList.add(activeLineClassName)
  setCurrentIndex(lineIndex)
}

function hideLine(lineIndex) {
  if (lineIndex < 0) {
    return
  }

  lineElements[lineIndex].classList.remove(activeLineClassName)
  letterElements[lineIndex].forEach(letterElement => {
    letterElement.classList.remove(activeLetterClassName)
  })
}

function handleCursor(lineIndex, letterIndex) {
  moveCursor(lineIndex, letterIndex)
  setCursorClassName(lineIndex, letterIndex)
}

function moveCursor(lineIndex, letterIndex) {
  let position = 0

  try {
    position = cursorPositions[lineIndex][letterIndex]
  } catch (err) {}

  translate(cursorElement, position || 0)
}

function setCursorClassName(lineIndex, letterIndex) {
  const method = isCursorAtLastIndex(lineIndex, letterIndex) ? 'add' : 'remove'
  cursorElement.classList[method](dimmedCursorClassName)
}

function setCurrentIndex(lineIndex, letterIndex = -1) {
  currentLineIndex = lineIndex
  currentLetterIndex = letterIndex
  handleCursor(lineIndex, letterIndex)
}

function isCursorAtLastIndex(lineIndex, letterIndex) {
  return letterIndex === letterCounts[lineIndex] - 1
}

function type(lineIndex, letterIndex) {
  showLine(lineIndex)
  letterElements[lineIndex][letterIndex].classList.add(activeLetterClassName)
  setCurrentIndex(lineIndex, letterIndex)
}

function erase(lineIndex, letterIndex) {
  showLine(lineIndex)
  letterElements[lineIndex][letterIndex].classList.remove(activeLetterClassName)
  setCurrentIndex(lineIndex, letterIndex - 1)
}
