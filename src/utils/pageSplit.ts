'use client'

const calculateCharactersPerPage = (fontSize: number) => {
  if (typeof window === 'undefined') {
    return 1000
  }
  const viewportWidth = window.innerWidth * 0.5
  const viewportHeight = window.innerHeight * 0.6

  const averageCharWidth = fontSize * 0.6
  const lineHeight = fontSize * 1.4

  // Calculate the number of characters that fit per line
  const charsPerLine = Math.floor(viewportWidth / averageCharWidth)

  // Calculate the number of lines that fit in the viewport
  const linesPerPage = Math.floor(viewportHeight / lineHeight)

  // Calculate the total number of characters per page
  const charsPerPage = charsPerLine * linesPerPage

  return charsPerPage
}

// Example usage:
const fontSize = 14 // Font size in pixels
const PAGE_SIZE = calculateCharactersPerPage(fontSize)
console.log(PAGE_SIZE)

export default PAGE_SIZE
