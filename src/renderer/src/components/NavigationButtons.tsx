import BrowserButton from './BrowserButton'
import { ArrowLeft, ArrowRight, RotateCcw, X } from 'lucide-react'

interface NavigationButtonsProps {
  canBack: boolean
  canForward: boolean
  isLoading: boolean
  onBack: () => void
  onForward: () => void
  onReload: () => void
  onStop: () => void
}

export default function NavigationButtons({ canBack, canForward, isLoading, onBack, onForward, onReload, onStop }: NavigationButtonsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-0.5">
      <BrowserButton onClick={onBack} disabled={!canBack} title="Back">
        <ArrowLeft />
      </BrowserButton>

      <BrowserButton onClick={onForward} disabled={!canForward} title="Forward">
        <ArrowRight />
      </BrowserButton>

      <BrowserButton onClick={isLoading ? onStop : onReload} title={isLoading ? 'Stop' : 'Reload'}>
        {isLoading ? <X /> : <RotateCcw />}
      </BrowserButton>
    </div>
  )
}
