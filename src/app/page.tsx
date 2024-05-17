'use client'

import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { supabase } from '@/client/supabaseClient'
import { ALargeSmall, Baseline, Bookmark, Languages, Search } from 'lucide-react'
import PAGE_SIZE from '@/utils/pageSplit'

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

  useEffect(() => {
    const fetchMarkdown = async () => {
      const { data, error } = await supabase.from('books').select('content').eq('id', 1).single()

      if (error) {
        setError('Error fetching markdown content')
        console.error(error)
      } else if (data) {
        setMarkdownText(data.content)
        const splitPages = splitContentIntoPages(data.content, PAGE_SIZE)
        setPages(splitPages)
      }
    }

    fetchMarkdown()
  }, [])

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

  return (
    <main className="flex h-screen flex-col items-center justify-between px-16 py-8 bg-gray-200">
      <section className="relative w-full max-w-[1100px] h-full flex bg-gray-700 py-6 px-16 rounded-xl">
        <div className="absolute z-0 left-[2%] top-[4%] w-[96%] h-[92%] bg-white shadow-[0px_4px_32px_0px_rgba(0,0,0,0.20)] rounded-lg"></div>
        <div className="absolute z-0 left-[3%] top-[3%] w-[94%] h-[94%] bg-white shadow-[0px_4px_32px_0px_rgba(0,0,0,0.20)] rounded-lg"></div>
        <div className="absolute z-0 left-[4%] top-[2%] w-[92%] h-[96%] bg-white p-12 flex flex-col space-y-4 shadow-[0px_4px_32px_0px_rgba(0,0,0,0.20)] rounded-lg overflow-hidden shadow-center">
          <header className="w-full flex justify-between">
            <h3 className="font-medium text-md">Title</h3>
            <div className="flex space-x-3">
              <Search size={20} />
              <Languages size={20} />
              <Baseline size={20} />
            </div>
          </header>
          <article className="w-full h-[92%] column-layout columns-2 prose prose-sm dark:prose-invert max-w-none">
            {error ? <p>{error}</p> : <Markdown>{pages[currentPage]}</Markdown>}
          </article>
          <footer className="w-full flex justify-between">
            <span className="font-medium text-sm">
              {currentPage + 1} of {pages.length}
            </span>
          </footer>
          <button
            className="absolute w-[30%] h-full left-0"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          ></button>
          <button
            className="absolute w-[30%] h-full right-0"
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
          ></button>
        </div>
      </section>
    </main>
  )
}
