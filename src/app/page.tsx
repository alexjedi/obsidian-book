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
    <main className="w-screen h-screen px-8 py-4 shadow-center space-y-4 overflow-hidden">
      <Header />
      <section className="relative w-full max-h-full h-[calc(100%-96px)] flex">
        <article className="w-full h-full column-layout columns-2 prose dark:prose-invert max-w-none">
          {error ? <p>{error}</p> : <Markdown>{pages[currentPage]}</Markdown>}
        </article>
        <button
          className="absolute w-[20%] h-full -left-8 border-0 border-l-4 border-transparent hover:border-slate-900 transition-all duration-200 ease-in-out"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        ></button>
        <button
          className="absolute w-[20%] h-full -right-8 border-0 border-r-4 border-transparent hover:border-slate-900 transition-all duration-200 ease-in-out"
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1}
        ></button>
      </section>
      <footer className="w-full h-8 flex justify-between">
        <Slider
          value={[currentPage]}
          max={pages.length - 1}
          step={1}
          onValueChange={(value) => setCurrentPage(value[0])}
        />
        <span className="font-medium text-sm">
          {currentPage + 1} of {pages.length}
        </span>
      </footer>
    </main>
  )
}
