import { ALargeSmall, Baseline, Bookmark, Languages, Menu, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const Header = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="flex h-8 items-center justify-between">
      <div className="flex space-x-3 items-center">
        <Menu size={20} />
        <h1 className="text-lg font-medium">Obsidian Book</h1>
      </div>
      <div className="flex space-x-3 items-center">
        <Search size={20} />
        <Languages size={20} />
        <Baseline size={20} />
        <button onClick={toggleTheme} className="flex items-center space-x-1">
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  )
}

export default Header
