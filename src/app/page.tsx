'use client'

import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { supabase } from '@/client/supabaseClient'
import { calculateCharactersPerPage } from '@/utils/pageSplit'
import Header from '@/components/Header'
import { Slider } from '@/components/ui/slider'

interface MarkdownFile {
  id: number
  created_at: string
  title: string
  content: string
}

export default function Home() {
  const [markdownText, setMarkdownText] = useState<string>('')
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [numParagraphs, setNumParagraphs] = useState<number>(1)
  const [isSerif, setIsSerif] = useState<boolean>(false)

  const fontSize = 16

  const updatePageSize = () => {
    const newSize = calculateCharactersPerPage(fontSize, numParagraphs)
    if (markdownText) {
      const splitPages = splitContentIntoPages(markdownText, newSize)
      setPages(splitPages)
    }
  }

  useEffect(() => {
    const fetchMarkdown = async () => {
      const { data, error } = await supabase.from('books').select('content').eq('id', 1).single()

      if (error) {
        setError('Error fetching markdown content')
        console.error(error)
      } else if (data) {
        setMarkdownText(data.content)
        const paragraphCount = 8
        setNumParagraphs(paragraphCount)
        const splitPages = splitContentIntoPages(
          data.content,
          calculateCharactersPerPage(fontSize, paragraphCount)
        )
        setPages(splitPages)
      }
    }

    fetchMarkdown()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updatePageSize)
    return () => window.removeEventListener('resize', updatePageSize)
  }, [markdownText, numParagraphs])

  const splitContentIntoPages = (content: string, pageSize: number) => {
    const pages = []
    for (let i = 0; i < content.length; i += pageSize) {
      pages.push(content.slice(i, i + pageSize))
    }
    return pages
  }

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < pages.length - 1 ? prevPage + 1 : prevPage))
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePreviousPage()
      } else if (event.key === 'ArrowRight') {
        handleNextPage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentPage, pages])

  return (
    <main className="w-screen h-screen space-y-4 overflow-hidden">
      <Header setIsSerif={() => setIsSerif(!isSerif)} />
      <section className="relative w-full max-h-full h-[calc(100%-160px)] flex px-8 shadow-center">
        <article
          className={`w-full h-full column-layout columns-2 prose dark:prose-invert max-w-none prose-p:text-gray-900 dark:prose-p:text-gray-50 prose-p:mt-2 prose-p:mb-2 indent-7 ${
            isSerif ? 'font-serif' : 'font-sans'
          }`}
        >
          {error ? <p>{error}</p> : <Markdown>{pages[currentPage]}</Markdown>}
        </article>
        <button
          className="absolute w-[20%] h-full -left-8 border-0 border-l-4 border-transparent hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-200 ease-in-out"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        ></button>
        <button
          className="absolute w-[20%] h-full -right-8 border-0 border-r-4 border-transparent hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-200 ease-in-out"
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1}
        ></button>
      </section>
      <footer className="w-full h-12 flex flex-col justify-center items-center space-y-4 px-8">
        {/* <div className="w-full flex justify-between">
          <div className="w-full text-center text-sm font-medium">{currentPage + 1}</div>
          <div className="w-full text-center text-sm font-medium">{currentPage + 2}</div>
        </div> */}
        <div className="w-full flex space-x-4">
          <Slider
            value={[currentPage]}
            max={pages.length - 1}
            step={1}
            onValueChange={(value) => setCurrentPage(value[0])}
          />
          <span className="text-nowrap text-sm font-medium">4 min</span>
        </div>
      </footer>
    </main>
  )
}
