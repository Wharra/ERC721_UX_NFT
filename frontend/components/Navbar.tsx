'use client'

import Link from 'next/link'
import { useWeb3 } from '@/hooks/useWeb3'

export default function Navbar() {
  const { account, isConnected, connectWallet } = useWeb3()

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md border-b border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ERC721 UX
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/chain-info" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 relative group px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Chain Info
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/fakeBayc" 
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 relative group px-2 py-1 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              BAYC
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/fakeNefturians" 
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 relative group px-2 py-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              Nefturians
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/fakeMeebits" 
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 relative group px-2 py-1 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              Meebits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {isConnected ? (
              <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 rounded-lg text-sm font-mono border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-primary px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Connect Wallet</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

