import AddressBar from './AddressBar'
import NavigationButtons from './NavigationButtons'

interface BrowserToolbarProps {
  inputValue: string
  inputRef: React.RefObject<HTMLInputElement | null>
  canBack: boolean
  canForward: boolean
  isLoading: boolean
  setInputValue: (value: string) => void
  navigate: () => void
  goBack: () => void
  goForward: () => void
  reload: () => void
  stop: () => void
}

export default function BrowserToolbar({ inputValue, inputRef, canBack, canForward, isLoading, setInputValue, navigate, goBack, goForward, reload, stop }: BrowserToolbarProps): React.JSX.Element {
  return (
    <div className="flex h-full w-full items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-3 py-2 text-white">
      <NavigationButtons
        canBack={canBack}
        canForward={canForward}
        isLoading={isLoading}
        onBack={goBack}
        onForward={goForward}
        onReload={reload}
        onStop={stop}
      />

      <AddressBar
        value={inputValue}
        inputRef={inputRef}
        onChange={setInputValue}
        onNavigate={navigate}
      />

      <button
        onClick={navigate}
        className="h-8 rounded-md bg-transparent px-5 text-sm border-1 border-blue-600 font-medium transition-colors hover:bg-blue-500 active:bg-zinc-700"
      >
        Go
      </button>
    </div>
  )
}
