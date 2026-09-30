import BrowserToolbar from './components/BrowserToolbar.tsx'
import { useBrowser } from './hooks/useBrowser.ts'

export default function App(): React.JSX.Element {
  return <BrowserToolbar {...useBrowser()} />
}
