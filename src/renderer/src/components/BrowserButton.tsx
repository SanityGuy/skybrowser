interface BrowserButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  title: string
}

export default function BrowserButton({ children, onClick, disabled = false, title }: BrowserButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white active:bg-zinc-700 disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  )
}
