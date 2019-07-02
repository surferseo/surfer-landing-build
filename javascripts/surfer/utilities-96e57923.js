/* global document, performance, requestAnimationFrame */

export function $(root, className) {
  if (!className) {
    className = root
    root = document
  }
  return Array.from(root.getElementsByClassName(className))
}

export function debounce(callback, time) {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(callback, time)
  }
}

export async function delay(min, max = 0) {
  const wait = max < min ? min : random(min, max)
  const future = now() + 1000 * wait

  while (now() < future) {
    await tick()
  }
}

export function last(collection) {
  return collection[collection.length - 1]
}

export function now() {
  return performance.now()
}

export async function onFontsLoaded(callback) {
  try {
    return document.fonts.ready.then(callback)
  } catch (err) {
    return delay(2000).then(callback)
  }
}

export async function tick() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

export function transform(element, value) {
  element.style.webkitTransform = value
  element.style.transform = value
}

export function translate(element, x = 0, y = 0, z = 0) {
  const value = [x, y, z].map(n => `${n}px`).join(',')
  transform(element, `translate3d(${value})`)
}

export function random(min, max) {
  return Math.random() * (max - min) + min
}
