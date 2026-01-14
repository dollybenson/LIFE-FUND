import Link from 'next/link'
import { SearchBar } from './SearchBar'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="V Save a Life Foundation" className="h-10 w-10" />
          <span className="font-semibold text-slate-900 hidden sm:inline">V Save a Life Foundation</span>
        </Link>

        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Dashboard
          </Link>
          <Link href="#" className="rounded-full bg-brand-500 px-4 py-2 text-white text-sm font-semibold">
            Start a Campaign
          </Link>
        </div>
      </div>
    </header>
  )
}
