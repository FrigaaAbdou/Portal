import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function useFocusTrap(enabled, containerRef) {
  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return

    const selectors = [
      'a[href]','button:not([disabled])','textarea:not([disabled])','input:not([disabled])','select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ]
    const getNodes = () => Array.from(container.querySelectorAll(selectors.join(',')))

    const previouslyFocused = document.activeElement
    const nodes = getNodes()
    if (nodes.length) nodes[0].focus()

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const list = getNodes()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus()
    }
  }, [enabled, containerRef])
}

export default function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm | md | lg
  closeOnOverlay = true,
}) {
  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Focus trap
  useFocusTrap(open, panelRef)

  if (!mounted) return null
  if (!open) return null

  // Width per breakpoint
  const widthClass = size === 'lg' ? 'sm:max-w-2xl' : size === 'sm' ? 'sm:max-w-sm' : 'sm:max-w-lg'

  return createPortal(
    <div className="fixed left-0 top-0 z-50 w-screen" style={{ height: '100dvh' }}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute left-0 top-0 h-full w-full bg-black/40 opacity-100 transition-opacity duration-200"
        onClick={() => closeOnOverlay && onClose?.()}
      />

      {/* Panel container: always centered */}
      <div className="absolute left-0 top-0 grid h-full w-full place-items-center p-4">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          className={`w-full ${widthClass} transform rounded-xl bg-white shadow-2xl outline-none transition-all duration-200 ease-out animate-[dialogIn_.2s_ease-out]`}
          style={{
            // Ensure the panel never exceeds viewport height; allow internal scrolling
            maxHeight: 'calc(100dvh - 100px)'
          }}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
            <h2 id="dialog-title" className="text-base font-semibold text-gray-900">{title}</h2>
            <button
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close dialog"
              onClick={() => onClose?.()}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="px-5 py-4 text-sm text-gray-700 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 160px)' }}>
            {children}
          </div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-white">
              {footer}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dialogIn { from { opacity: .0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>,
    document.body
  )
}
