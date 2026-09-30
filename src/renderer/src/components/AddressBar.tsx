import { useEffect } from 'react'

interface AddressBarProps {
  value: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onNavigate: () => void
}

export default function AddressBar({ value, inputRef, onChange, onNavigate }: AddressBarProps): React.JSX.Element {
  useEffect((): (() => void) => {
    const handleShortcut = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && (event.key === 'l' || event.key === 'k')) {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }

    window.addEventListener('keydown', handleShortcut)

    return (): void => {
      window.removeEventListener('keydown', handleShortcut)
    }
  }, [inputRef])

  return (
    <div className="flex h-8 flex-1 items-center rounded-lg border border-zinc-800 bg-zinc-900 px-3 transition-colors focus-within:border-blue-500 focus-within:bg-zinc-800">
      <span className="mr-2 text-sm text-zinc-500">⌕</span>

      <input
        ref={inputRef}
        value={value}
        onChange={(event): void => onChange(event.target.value)}
        onKeyDown={(event): void => {
          if (event.key === 'Enter') {
            onNavigate()
          }

          if (event.key === 'Escape') {
            inputRef.current?.blur()
          }
        }}
        onFocus={(event): void => event.target.select()}
        className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
        placeholder="Search or enter URL"
        spellCheck={false}
      />
    </div>
  )
}
