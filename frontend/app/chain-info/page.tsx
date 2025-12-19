'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { SEPOLIA_CHAIN_ID } from '@/lib/contracts'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ChainInfoPage() {
  const { account, chainId, lastBlockNumber, isConnected, connectWallet } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if (isConnected && chainId !== null && chainId !== SEPOLIA_CHAIN_ID) {
      router.push('/wrong-network')
    }
  }, [chainId, isConnected, router])

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Chain Information</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please connect your wallet to view chain information
            </p>
            <button
              onClick={connectWallet}
              className="btn-primary px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Connect Wallet</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (chainId !== SEPOLIA_CHAIN_ID) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
          <h1 className="text-3xl font-bold mb-8 text-center gradient-text">Chain Information</h1>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-slate-700 pb-4 group hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg px-3 py-2 -mx-3 transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">Network:</span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Sepolia Testnet
                </span>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-slate-700 pb-4 group hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg px-3 py-2 -mx-3 transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">Chain ID:</span>
                <span className="text-lg font-mono font-semibold bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">{chainId}</span>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-slate-700 pb-4 group hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg px-3 py-2 -mx-3 transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">Last Block Number:</span>
                <span className="text-lg font-mono font-semibold bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  {lastBlockNumber !== null ? lastBlockNumber.toLocaleString() : 'Loading...'}
                </span>
              </div>
            </div>

            <div className="pt-4 group hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg px-3 py-2 -mx-3 transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">Your Address:</span>
                <span className="text-sm font-mono bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 px-3 py-1.5 rounded border border-gray-300 dark:border-slate-600 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-200 hover:shadow-md">
                  {account || 'Not connected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

