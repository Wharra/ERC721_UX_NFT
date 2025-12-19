'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { CONTRACT_ADDRESSES, ABIS, SEPOLIA_CHAIN_ID } from '@/lib/contracts'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FakeBaycPage() {
  const { provider, signer, account, chainId, isConnected, connectWallet } = useWeb3()
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [totalSupply, setTotalSupply] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [claiming, setClaiming] = useState(false)

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
        CONTRACT_ADDRESSES.FAKE_BAYC,
        ABIS.FAKE_BAYC,
        provider
      )
      const [contractName, supply] = await Promise.all([
        contract.name(),
        contract.totalSupply(),
      ])
      setName(contractName)
      setTotalSupply(supply.toString())
    } catch (error) {
      console.error('Error loading contract data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    if (!signer) {
      await connectWallet()
      return
    }

    try {
      setClaiming(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_BAYC,
        ABIS.FAKE_BAYC,
        signer
      )
      const tx = await contract.claimAToken()
      await tx.wait()
      await loadContractData()
      alert('Token claimed successfully!')
    } catch (error: any) {
      console.error('Error claiming token:', error)
      alert(`Error: ${error.message || 'Failed to claim token'}`)
    } finally {
      setClaiming(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Fake BAYC Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your wallet to view and claim tokens
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
          <h1 className="text-5xl font-bold mb-4 gradient-text">Fake BAYC</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Claim and explore Bored Ape tokens</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            {loading ? (
              <div className="text-center py-12">
                <div className="spinner h-12 w-12 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading collection data...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Collection Name</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">{name || 'Loading...'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Supply</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSupply}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="btn-primary w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {claiming ? (
                        <>
                          <div className="spinner h-5 w-5 border-2"></div>
                          <span>Claiming...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>Claim a Token</span>
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

        <div className="text-center mt-8">
          <Link
            href="/fakeBayc/0"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-all duration-200 hover:gap-3 group"
          >
            <span>View Token #0</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

