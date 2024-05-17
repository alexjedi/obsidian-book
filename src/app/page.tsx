'use client'

import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { supabase } from '@/client/supabaseClient'

interface MarkdownFile {
  id: number
  created_at: string
  title: string
  content: string
}

export default function Home() {
  const [markdownText, setMarkdownText] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarkdown = async () => {
      const { data, error } = await supabase.from('books').select('content').eq('id', 1).single()

      if (error) {
        setError('Error fetching markdown content')
        console.error(error)
      } else if (data) {
        setMarkdownText(data.content)
      }
    }

    fetchMarkdown()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-200">
      <section className="w-full max-w-[1100px] h-full flex bg-gray-700">
        <div className="w-full bg-white h-full p-24">
          {error ? <p>{error}</p> : <Markdown>{markdownText}</Markdown>}
        </div>
      </section>
    </main>
  )
}
