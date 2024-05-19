'use client'

export const calculateCharactersPerPage = (fontSize: number, numParagraphs: number) => {
  if (typeof window === 'undefined') {
    return 1000
  }
  const viewportWidth = window.innerWidth - 160
  const viewportHeight = window.innerHeight - 128

  const averageCharWidth = fontSize * 0.6
  const lineHeight = fontSize * 1.75
  const marginPerParagraph = fontSize * 1.25

  // Calculate the number of characters that fit per line
  const charsPerLine = Math.floor(viewportWidth / averageCharWidth)

  // Calculate the number of lines that fit in the viewport minus paragraph margins
  const totalParagraphMargin = numParagraphs * marginPerParagraph
  const adjustedViewportHeight = viewportHeight - totalParagraphMargin
  const linesPerPage = Math.floor(adjustedViewportHeight / lineHeight)

  // Calculate the total number of characters per page
  const charsPerPage = charsPerLine * linesPerPage

  console.log('charsPerPage', charsPerPage)
  console.log('numParagraphs', numParagraphs)

  return charsPerPage
}
