'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ethers } from 'ethers'

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  account: string | null
  chainId: number | null
  isConnected: boolean
  connectWallet: () => Promise<void>
  lastBlockNumber: number | null
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  isConnected: false,
  connectWallet: async () => {},
  lastBlockNumber: null,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [lastBlockNumber, setLastBlockNumber] = useState<number | null>(null)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const network = await provider.getNetwork()
        const blockNumber = await provider.getBlockNumber()

        setProvider(provider)
        setSigner(signer)
        setAccount(address)
        setChainId(Number(network.chainId))
        setLastBlockNumber(blockNumber)

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
          } else {
            setAccount(null)
            setSigner(null)
          }
        })

        // Listen for chain changes
        window.ethereum.on('chainChanged', async () => {
          const network = await provider.getNetwork()
          const blockNumber = await provider.getBlockNumber()
          setChainId(Number(network.chainId))
          setLastBlockNumber(blockNumber)
        })

        // Listen for new blocks
        provider.on('block', (blockNumber) => {
          setLastBlockNumber(blockNumber)
        })
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const checkConnection = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          await connectWallet()
        }
      }
      checkConnection()
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        isConnected: !!account && !!signer,
        connectWallet,
        lastBlockNumber,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  return useContext(Web3Context)
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
      send: (method: string, params?: any[]) => Promise<any>
    }
  }
}

