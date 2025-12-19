'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { CONTRACT_ADDRESSES, ABIS, SEPOLIA_CHAIN_ID } from '@/lib/contracts'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

interface TokenMetadata {
  name?: string
  description?: string
  image?: string
  attributes?: Array<{ trait_type: string; value: string | number }>
}

export default function TokenDetailPage() {
  const { provider, chainId, isConnected, connectWallet } = useWeb3()
  const router = useRouter()
  const params = useParams()
  const tokenId = params?.tokenId as string
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tokenExists, setTokenExists] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && chainId !== null && chainId !== SEPOLIA_CHAIN_ID) {
      router.push('/wrong-network')
    }
  }, [chainId, isConnected, router])

  useEffect(() => {
    if (provider && isConnected && tokenId) {
      loadTokenData()
    }
  }, [provider, isConnected, tokenId])

  const loadTokenData = async () => {
    if (!provider || !tokenId) return
    try {
      setLoading(true)
      setError(null)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_BAYC,
        ABIS.FAKE_BAYC,
        provider
      )

      try {
        await contract.ownerOf(tokenId)
        setTokenExists(true)
      } catch (err) {
        setTokenExists(false)
        setError('This token does not exist')
        setLoading(false)
        return
      }

      const uri = await contract.tokenURI(tokenId)
      const response = await fetch(uri)
      if (!response.ok) {
        throw new Error('Failed to fetch metadata')
      }
      const data = await response.json()
      setMetadata(data)
      
      if (data.image) {
        let normalizedUrl = data.image
        if (normalizedUrl.startsWith('ipfs://')) {
          normalizedUrl = normalizedUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
        } else if (normalizedUrl.startsWith('Qm') && normalizedUrl.length === 46) {
          normalizedUrl = `https://gateway.pinata.cloud/ipfs/${normalizedUrl}`
        }
        if (normalizedUrl.startsWith('0x') && normalizedUrl.length > 2) {
          try {
            const hexString = normalizedUrl.slice(2)
            const bytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
            const decoded = new TextDecoder().decode(bytes)
            if (decoded.startsWith('http') || decoded.startsWith('ipfs://')) {
              normalizedUrl = decoded.startsWith('ipfs://') 
                ? decoded.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
                : decoded
            } else {
              const base64 = btoa(String.fromCharCode(...bytes))
              normalizedUrl = `data:image/png;base64,${base64}`
            }
          } catch (e) {
            console.warn('Could not decode hex image:', e)
          }
        }
        setImageUrl(normalizedUrl)
      }
    } catch (error: any) {
      console.error('Error loading token data:', error)
      if (error.message?.includes('nonexistent token')) {
        setError('This token does not exist')
        setTokenExists(false)
      } else {
        setError('Failed to load token data')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Token #{tokenId}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your wallet to view token details
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading token data...</p>
        </div>
      </div>
    )
  }

  if (error || !tokenExists) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl shadow-lg p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">
              Token Not Found
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {error || 'This token does not exist'}
            </p>
            <button
              onClick={() => router.push('/fakeBayc')}
              className="btn-primary px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>←</span>
                <span>Back to Collection</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 border border-gray-100 dark:border-slate-700">
          <div className="grid md:grid-cols-2 gap-10">
            {(imageUrl || metadata?.image) && !imageError ? (
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700">
                <img
                  src={imageUrl || metadata?.image}
                  alt={metadata?.name || `Token #${tokenId}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">Image unavailable</p>
                </div>
              </div>
            )}
            <div>
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-3">
                  {metadata?.name || `Token #${tokenId}`}
                </h1>
                {metadata?.description && (
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {metadata.description}
                  </p>
                )}
              </div>
              
              {metadata?.attributes && metadata.attributes.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-200">Attributes</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {metadata.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600"
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          {attr.trait_type}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

