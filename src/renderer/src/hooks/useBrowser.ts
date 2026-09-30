import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    browser: {
      onUrlChanged: (callback: (url: string) => void) => void
      canGoBack: () => Promise<boolean>
      canGoForward: () => Promise<boolean>
      navigate: (url: string) => void
      goBack: () => void
      goForward: () => void
      reload: () => void
      stop: () => void
    }
  }
}

export interface BrowserState {
  inputValue: string
  canBack: boolean
  canForward: boolean
  isLoading: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  setInputValue: (value: string) => void
  navigate: () => void
  goBack: () => void
  goForward: () => void
  reload: () => void
  stop: () => void
}

export function useBrowser(): BrowserState {
  const [inputValue, setInputValue] = useState('https://search.brave.com')
  const [canBack, setCanBack] = useState(false)
  const [canForward, setCanForward] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect((): (() => void) => {
    window.browser.onUrlChanged((url: string): void => {
      setInputValue(url)
      setIsLoading(false)
    })

    const updateNavigation = async (): Promise<void> => {
      setCanBack(await window.browser.canGoBack())
      setCanForward(await window.browser.canGoForward())
    }

    void updateNavigation()

    const interval = window.setInterval((): void => {
      void updateNavigation()
    }, 500)

    return (): void => {
      window.clearInterval(interval)
    }
  }, [])

  const navigate = (): void => {
    const value = inputValue.trim()

    if (!value) {
      return
    }

    setIsLoading(true)
    window.browser.navigate(value)
    inputRef.current?.blur()
  }

  const goBack = (): void => {
    window.browser.goBack()
  }

  const goForward = (): void => {
    window.browser.goForward()
  }

  const reload = (): void => {
    setIsLoading(true)
    window.browser.reload()
  }

  const stop = (): void => {
    window.browser.stop()
    setIsLoading(false)
  }

  return {
    inputValue,
    canBack,
    canForward,
    isLoading,
    inputRef,
    setInputValue,
    navigate,
    goBack,
    goForward,
    reload,
    stop
  }
}
