'use client'

import { Web3Provider } from '@/hooks/useWeb3'

export function Providers({ children }: { children: React.ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>
}

