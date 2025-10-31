"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    href: '/photographer/dashboard',
    label: 'Home',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
    )
  },
  {
    href: '/photographer/photos',
    label: 'My Album',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
    )
  },
  {
  // ...removed global guest list link...
    label: 'Guest List',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
    )
  }
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex flex-row max-w-md mx-auto px-2 py-1">
        {items.map(item => {
          if (!item?.href) return null;
          const active = pathname?.startsWith(item.href ?? "");
          return (
            <Link key={item.href} href={item.href ?? "#"} className={`flex-1 flex flex-col items-center gap-0.5 py-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
