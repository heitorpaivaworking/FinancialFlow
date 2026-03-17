import { useState } from 'react'

export default function Tooltip({ children, text, position = 'top' }) {
  const [show, setShow] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`
            absolute z-50 px-2.5 py-1.5 text-xs font-medium
            bg-overlay border border-white/10 rounded-lg
            text-white/80 whitespace-nowrap shadow-lg
            animate-fade-in pointer-events-none
            ${positionClasses[position]}
          `}
        >
          {text}
        </div>
      )}
    </div>
  )
}
