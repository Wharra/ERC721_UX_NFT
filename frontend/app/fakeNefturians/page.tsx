'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { CONTRACT_ADDRESSES, ABIS, SEPOLIA_CHAIN_ID } from '@/lib/contracts'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FakeNefturiansPage() {
  const { provider, signer, account, chainId, isConnected, connectWallet } = useWeb3()
  const router = useRouter()
  const [tokenPrice, setTokenPrice] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    if (isConnected && chainId !== null && chainId !== SEPOLIA_CHAIN_ID) {
      router.push('/wrong-network')
    }
  }, [chainId, isConnected, router])

  useEffect(() => {
    if (provider && isConnected) {
      loadContractData()
    }
  }, [provider, isConnected])

  const loadContractData = async () => {
    if (!provider) return
    try {
      setLoading(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_NEFTURIANS,
        ABIS.FAKE_NEFTURIANS,
        provider
      )
      const price = await contract.tokenPrice()
      setTokenPrice(ethers.formatEther(price))
    } catch (error) {
      console.error('Error loading contract data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuy = async () => {
    if (!signer) {
      await connectWallet()
      return
    }

    try {
      setBuying(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_NEFTURIANS,
        ABIS.FAKE_NEFTURIANS,
        signer
      )
      const price = await contract.tokenPrice()
      const valueToSend = price + BigInt(1)
      const tx = await contract.buyAToken({ value: valueToSend })
      await tx.wait()
      alert('Token purchased successfully!')
      await loadContractData()
    } catch (error: any) {
      console.error('Error buying token:', error)
      let errorMessage = 'Failed to buy token'
      if (error.message) {
        errorMessage = error.message
      } else if (error.reason) {
        errorMessage = error.reason
      }
      alert(`Error: ${errorMessage}`)
    } finally {
      setBuying(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Fake Nefturians Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your wallet to view and buy tokens
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
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Fake Nefturians</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Purchase NFTs from the collection</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner h-12 w-12 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading price information...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Token Price</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {tokenPrice} ETH
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="btn-primary w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {buying ? (
                        <>
                          <div className="spinner h-5 w-5 border-2"></div>
                          <span>Processing purchase...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>Buy a Token</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {account && (
          <div className="text-center">
            <Link
              href={`/fakeNefturians/${account}`}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-all duration-200 hover:gap-3 group"
            >
              <span>View My Tokens</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

