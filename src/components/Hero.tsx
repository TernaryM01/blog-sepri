import { useState, useRef, useEffect } from 'react'
import logoIcon from '../assets/logo-icon.svg'
import balloonSvg from '../assets/balloon.svg'
import charPicture from '../assets/char-picture.png'
import { PlaygroundPhysics } from './PlaygroundPhysics'

const PANEL_WIDTH = 815
const VISIBLE_HANDLE_WIDTH = 40
const MAX_OFFSET = PANEL_WIDTH - VISIBLE_HANDLE_WIDTH // 775px

const NAV_LINKS = [
  { id: 'Nav-Link-1', href: '#blog', label: 'Blog' },
  { id: 'Nav-Link-2', href: '#class', label: 'Class' },
  { id: 'Nav-Link-3', href: '#my-journey', label: 'My Journey' },
  { id: 'Nav-Link-4', href: '#contact-me', label: 'Contact Me' },
]

function PhotosSlideshowPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      id="Slideshow-Placeholder"
      className={`relative w-full max-w-[650px] min-h-[380px] min-[1150px]:min-h-[546px] flex flex-col items-center justify-center p-6 md:p-8 select-none overflow-hidden ${className}`}
    >
      {/* Background Decorative Photo Cards */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-[140px] sm:w-[190px] h-[180px] sm:h-[230px] bg-white rounded-xl shadow-md border border-black/10 p-2.5 sm:p-3 flex flex-col items-center animate-photo-drift-1 transition-transform duration-300 hover:scale-105 pointer-events-auto cursor-pointer">
          <div className="w-full h-[110px] sm:h-[150px] bg-[#a8e0d1] rounded-lg flex items-center justify-center text-2xl sm:text-3xl transition-transform duration-300 hover:scale-105">
            🌌
          </div>
          <span className="font-['Solway'] text-[11px] sm:text-[12px] text-gray-600 mt-1.5 sm:mt-2 font-medium">Cosmos Lab</span>
        </div>
        <div className="w-[140px] sm:w-[190px] h-[180px] sm:h-[230px] bg-white rounded-xl shadow-md border border-black/10 p-2.5 sm:p-3 flex flex-col items-center animate-photo-drift-2 transition-transform duration-300 hover:scale-105 pointer-events-auto cursor-pointer">
          <div className="w-full h-[110px] sm:h-[150px] bg-[#ffd599] rounded-lg flex items-center justify-center text-2xl sm:text-3xl transition-transform duration-300 hover:scale-105">
            🧪
          </div>
          <span className="font-['Solway'] text-[11px] sm:text-[12px] text-gray-600 mt-1.5 sm:mt-2 font-medium">Field Experiments</span>
        </div>
      </div>

      {/* Central Info Card */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[420px] px-6 sm:px-8 py-5 sm:py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/40 backdrop-blur-[2px] cursor-pointer group">
        <div className="w-[50px] sm:w-[56px] h-[50px] sm:h-[56px] rounded-full bg-[#24705f]/15 flex items-center justify-center text-[#24705f] mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 animate-pulse-slow">
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="font-['Solway'] text-[20px] sm:text-[22px] font-semibold text-[#1e5d50] m-0 transition-colors duration-200 group-hover:text-[#16483e]">
          Photos Slideshow
        </h3>
        <p className="font-['Solway'] text-[13px] sm:text-[14px] text-[#2d6e60] mt-2 mb-3 leading-relaxed">
          Moments, highlights, and discoveries from Sepriani’s universe will be featured right here soon!
        </p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-[12px] font-['Solway'] font-medium bg-[#24705f]/15 text-[#195447] transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-[#24705f]/25 select-none">
          <span className="w-2 h-2 rounded-full bg-[#24705f] animate-pulse"></span>
          Coming Soon
        </span>
      </div>
    </div>
  )
}

export function Hero() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentOffset, setCurrentOffset] = useState(MAX_OFFSET)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopScreen, setIsDesktopScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1150 : true
  )

  // Nav highlight state
  const [navHighlight, setNavHighlight] = useState<{
    left: number
    width: number
    activeKey: string | null
  }>({
    left: 0,
    width: 0,
    activeKey: null,
  })

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopScreen(window.innerWidth >= 1150)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = e.currentTarget
    const PADDING_X = 22
    setNavHighlight({
      left: target.offsetLeft - PADDING_X,
      width: target.offsetWidth + PADDING_X * 2,
      activeKey: href,
    })
  }

  const handleNavMouseLeave = () => {
    setNavHighlight((prev) => ({
      ...prev,
      activeKey: null,
    }))
  }

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const targetId = href.replace('#', '')
    const el =
      document.getElementById(targetId) ||
      document.getElementById(targetId.charAt(0).toUpperCase() + targetId.slice(1)) ||
      document.getElementById(targetId.toLowerCase())
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const dragStartRef = useRef<{
    startX: number
    startOffset: number
    moved: boolean
  }>({
    startX: 0,
    startOffset: MAX_OFFSET,
    moved: false,
  })

  const playgroundSlotRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStartRef.current = {
      startX: e.clientX,
      startOffset: currentOffset,
      moved: false,
    }
    setIsDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStartRef.current.startX
    if (Math.abs(deltaX) > 4) {
      dragStartRef.current.moved = true
    }
    const nextOffset = Math.min(MAX_OFFSET, Math.max(0, dragStartRef.current.startOffset + deltaX))
    setCurrentOffset(nextOffset)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
    setIsDragging(false)

    if (!dragStartRef.current.moved) {
      // Clicks are ignored — only dragging opens/closes
      setCurrentOffset(isOpen ? 0 : MAX_OFFSET)
    } else {
      // Drag snap threshold (40% to open, 60% to close)
      if (currentOffset < MAX_OFFSET * 0.5) {
        setIsOpen(true)
        setCurrentOffset(0)
      } else {
        setIsOpen(false)
        setCurrentOffset(MAX_OFFSET)
      }
    }
  }

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
    setIsDragging(false)
    if (currentOffset < MAX_OFFSET * 0.5) {
      setIsOpen(true)
      setCurrentOffset(0)
    } else {
      setIsOpen(false)
      setCurrentOffset(MAX_OFFSET)
    }
  }

  return (
    <div
      id="Hero"
      className="relative w-full flex flex-col max-[1150px]:items-center min-[1150px]:flex-row min-[1150px]:items-center min-[1150px]:justify-between py-[36px] min-[1150px]:min-h-[697px] self-stretch"
    >
      {/* Mobile Hamburger Toggle Button (Top Right) */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="absolute top-4 right-4 z-50 sm:hidden w-12 h-12 bg-[#ffdb74] border-[3px] border-[#3f2007] shadow-[3px_3px_0px_1px_rgba(0,0,0,0.25)] rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 select-none"
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span
          className={`w-6 h-[3px] bg-[#3f2007] rounded-full transition-all duration-300 ${
            isMobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''
          }`}
        />
        <span
          className={`w-6 h-[3px] bg-[#3f2007] rounded-full transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`w-6 h-[3px] bg-[#3f2007] rounded-full transition-all duration-300 ${
            isMobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''
          }`}
        />
      </button>

      {/* Mobile Pop-open Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 sm:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-18 right-4 left-4 z-50 bg-[#fffcf5] border-[4px] border-[#3f2007] shadow-[6px_6px_0px_2px_rgba(0,0,0,0.25)] rounded-[24px] p-5 flex flex-col items-center gap-2.5 sm:hidden">
            <span className="font-['Solway'] text-xs font-bold text-[#6b4728] tracking-wider uppercase mb-1">
              Menu
            </span>
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="w-full py-3 px-4 font-['Solway'] font-bold text-[19px] text-[#3f2007] bg-[#ffdb74]/40 hover:bg-[#ffdb74] active:bg-[#ffdb74] border-2 border-[#3f2007]/25 hover:border-[#3f2007] rounded-xl text-center no-underline transition-all duration-200 shadow-xs hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] select-none cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </>
      )}

      {/* Hero Left */}
      <div
        id="Hero-Left"
        className="relative h-full flex flex-col items-center justify-start flex-1 self-stretch"
      >
        {/* Logo */}
        <a
          id="Logo"
          href="#"
          className="flex flex-row items-center gap-[25px] cursor-pointer group no-underline transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <img
            id="Logo-Icon"
            src={logoIcon}
            alt="Logo Icon"
            className="w-[105px] h-[105px] shrink-0 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
          />
          <span
            id="Logo-Text"
            className="font-['Solway'] text-[40px] font-normal leading-[1.2] text-black text-center select-none transition-colors duration-300 group-hover:text-[#185347]"
          >
            Sepriani’s Lab
          </span>
        </a>

        {/* Hero Char */}
        <div
          id="Hero-Char"
          className="relative w-[284px] h-[499px] shrink-0 self-stretch mx-auto mt-0 animate-float-gentle"
        >
          {/* Char Picture */}
          <img
            id="Char-Picture"
            src={charPicture}
            alt="Char Picture"
            className="absolute left-[0.5px] top-0 w-[284px] h-[380px] object-cover pointer-events-none"
          />

          {/* Hero Balloon */}
          <div
            id="Hero-Balloon"
            className="absolute left-[16px] top-[321px] w-[252px] h-[178px] animate-balloon-breathe transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Balloon */}
            <img
              id="Balloon"
              src={balloonSvg}
              alt="Balloon"
              className="absolute left-0 top-0 w-[252px] h-[178px] pointer-events-none"
            />
            {/* Hero Text */}
            <p
              id="Hero-Text"
              className="absolute left-[7px] top-[70px] w-[238px] h-[92px] m-0 font-['Solway'] text-[24px] font-normal leading-[1.2] text-black text-center select-none"
            >
              Hello! Let’s explore the wonders of the universe together!
            </p>
          </div>
        </div>

        {/* 1-column view Photos Slideshow Placeholder (below Hero Char) */}
        <div className="w-full flex justify-center mt-6 min-[1150px]:hidden">
          <PhotosSlideshowPlaceholder />
        </div>
      </div>

      {/* Hero Right — nav on top; in 2-column view (>= 1150px), stage has the slideshow with the draggable playground over it */}
      <div
        id="Hero-Right"
        className="relative w-full min-[1150px]:w-[815px] flex flex-col items-center min-[1150px]:items-end justify-start max-[1150px]:mb-10 min-[1150px]:gap-[55px] shrink-0 self-stretch order-first min-[1150px]:order-none"
      >
        {/* Nav — Centered on 1-column view, hidden on mobile in favor of hamburger */}
        <nav
          id="Nav"
          onMouseLeave={handleNavMouseLeave}
          className="relative hidden sm:flex flex-row items-center justify-center min-[1150px]:justify-end gap-[28px] min-[1150px]:gap-[48px] px-4 min-[1150px]:pr-[64px] min-[1150px]:self-end py-1 whitespace-nowrap"
        >
          {/* Hanging Purple Nav Highlighter */}
          <div
            id="Nav-Highlighter"
            className="absolute top-[-40px] h-[92px] bg-[#d82b78] rounded-b-[26px] pointer-events-none z-0 will-change-transform shadow-[0_4px_14px_rgba(216,43,120,0.35)]"
            style={{
              left: `${navHighlight.left}px`,
              width: `${navHighlight.width}px`,
              transform: navHighlight.activeKey ? 'translateY(0)' : 'translateY(-100%)',
              transition:
                'left 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease',
              opacity: navHighlight.width > 0 ? 1 : 0,
            }}
          />

          {NAV_LINKS.map((link) => {
            const isHovered = navHighlight.activeKey === link.href
            return (
              <a
                key={link.id}
                id={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                onMouseEnter={(e) => handleLinkMouseEnter(e, link.href)}
                className={`relative z-10 font-['Solway'] text-[20px] font-normal leading-[1.2] h-[24px] no-underline select-none transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-90 cursor-pointer ${
                  isHovered ? 'text-white' : 'text-black'
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        {/* Hero Interactive Stage Container — only rendered in 2-column view (>= 1150px) */}
        {isDesktopScreen && (
          <div
            id="Hero-Stage"
            className="relative w-[815px] min-h-[546px] shrink-0 self-stretch hidden min-[1150px]:block"
          >
            {/* Photos Slideshow Placeholder in desktop stage */}
            <PhotosSlideshowPlaceholder className="absolute inset-0 w-full h-full" />

            {/* Playground Wrapper (Draggable panel) */}
            <div
              id="Playground-Wrapper"
              style={{
                transform: `translateX(${currentOffset}px)`,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="absolute top-0 left-0 w-[815px] h-full rounded-l-[30px] overflow-hidden hazard-stripes-bg shadow-[-8px_0px_20px_rgba(0,0,0,0.22)] select-none will-change-transform z-20"
            >
              {/* Draggable Left Handle Bar */}
              <div
                className="absolute left-0 top-0 w-[40px] h-full cursor-grab active:cursor-grabbing z-30 flex flex-col items-center justify-center group focus:outline-none touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                role="region"
                aria-label="Draggable playground panel"
              >
                {/* Visible Grip Bar */}
                <div className="w-[20px] h-[80px] rounded-full bg-[#2e2e2e] border-2 border-[#fbda6c] flex flex-col items-center justify-center gap-[4px] shadow-lg transition-transform duration-200 group-hover:scale-110 group-active:scale-90">
                  <div className="w-[8px] h-[2.5px] bg-[#fbda6c] rounded-full" />
                  <div className="w-[8px] h-[2.5px] bg-[#fbda6c] rounded-full" />
                  <div className="w-[8px] h-[2.5px] bg-[#fbda6c] rounded-full" />
                </div>
              </div>

              {/* Playground Content Area */}
              <div
                id="Playground"
                ref={playgroundSlotRef}
                className="absolute left-[38px] top-[20px] w-[753px] h-[506px] overflow-hidden"
              >
                {/* Reference slot for physics walls tracking */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Viewport Physics Canvas — strictly only rendered when playground is present in desktop view */}
      {isDesktopScreen && (
        <div className="hidden min-[1150px]:block">
          <PlaygroundPhysics targetRef={playgroundSlotRef} />
        </div>
      )}
    </div>
  )
}

