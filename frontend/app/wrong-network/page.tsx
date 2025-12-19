'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { SEPOLIA_CHAIN_ID } from '@/lib/contracts'

export default function WrongNetworkPage() {
  const { chainId } = useWeb3()

  const switchToSepolia = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            })
          } catch (addError) {
            console.error('Error adding Sepolia network:', addError)
          }
        }
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-500 dark:border-red-600 rounded-2xl shadow-lg p-10 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">
            Wrong Network
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
            This application requires the Sepolia test network.
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6 border border-red-200 dark:border-red-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Chain ID: <span className="font-mono font-semibold text-red-600 dark:text-red-400">{chainId || 'Not connected'}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Required Chain ID: <span className="font-mono font-semibold text-green-600 dark:text-green-400">11155111 (Sepolia)</span>
            </p>
          </div>
          <button
            onClick={switchToSepolia}
            className="btn-primary px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Switch to Sepolia Network</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

