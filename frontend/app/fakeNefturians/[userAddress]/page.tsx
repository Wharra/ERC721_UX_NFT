'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { CONTRACT_ADDRESSES, ABIS, SEPOLIA_CHAIN_ID } from '@/lib/contracts'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface TokenData {
  tokenId: string
  name?: string
  description?: string
  image?: string
  imageUrl?: string
  imageError?: boolean
}

function TokenCard({ token }: { token: TokenData }) {
  const [imageError, setImageError] = useState(false)
  const imageSrc = token.imageUrl || token.image
  
  return (
    <div className="card-hover bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700 group">
      {imageSrc && !imageError ? (
        <div className="relative aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
          <img
            src={imageSrc}
            alt={token.name || `Token #${token.tokenId}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-2 right-2 bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            #{token.tokenId}
          </div>
        </div>
      ) : (
        <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
          <div className="text-center p-4">
            <svg className="w-12 h-12 mx-auto mb-2 text-purple-400 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">#{token.tokenId}</p>
          </div>
        </div>
      )}
      <div className="p-4 group-hover:bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 transition-all duration-300">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {token.name || `Token #${token.tokenId}`}
        </h3>
        {token.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {token.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default function UserTokensPage() {
  const { provider, chainId, isConnected, connectWallet } = useWeb3()
  const router = useRouter()
  const params = useParams()
  const userAddress = params?.userAddress as string
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(true)
  const [collectionName, setCollectionName] = useState('')

  useEffect(() => {
    if (isConnected && chainId !== null && chainId !== SEPOLIA_CHAIN_ID) {
      router.push('/wrong-network')
    }
  }, [chainId, isConnected, router])

  useEffect(() => {
    if (provider && isConnected && userAddress) {
      loadUserTokens()
    }
  }, [provider, isConnected, userAddress])

  const normalizeImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return imageUrl
    
    let normalized = imageUrl
    
    if (normalized.startsWith('ipfs://')) {
      normalized = normalized.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
    } else if (normalized.startsWith('Qm') && normalized.length === 46 && !normalized.includes('/')) {
      normalized = `https://gateway.pinata.cloud/ipfs/${normalized}`
    }
    
    if (normalized.startsWith('0x') && normalized.length > 2) {
      try {
        const hexString = normalized.slice(2)
        const bytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
        const decoded = new TextDecoder().decode(bytes)
        if (decoded.startsWith('http') || decoded.startsWith('ipfs://')) {
          normalized = decoded.startsWith('ipfs://') 
            ? decoded.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
            : decoded
        } else {
          const base64 = btoa(String.fromCharCode(...bytes))
          normalized = `data:image/png;base64,${base64}`
        }
      } catch (e) {
        console.warn('Could not decode hex image:', e)
      }
    }
    
    return normalized
  }

  const loadUserTokens = async () => {
    if (!provider || !userAddress) return
    try {
      setLoading(true)
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_NEFTURIANS,
        ABIS.FAKE_NEFTURIANS,
        provider
      )

      const name = await contract.name()
      setCollectionName(name)

      const balance = await contract.balanceOf(userAddress)
      const tokenCount = Number(balance)

      const tokenPromises = []
      for (let i = 0; i < tokenCount; i++) {
        tokenPromises.push(contract.tokenOfOwnerByIndex(userAddress, i))
      }

      const tokenIds = await Promise.all(tokenPromises)
      
      const tokenDataPromises = tokenIds.map(async (tokenId) => {
        try {
          const tokenURI = await contract.tokenURI(tokenId)
          const response = await fetch(tokenURI)
          const metadata = await response.json()
          
          return {
            tokenId: tokenId.toString(),
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            imageUrl: metadata.image ? normalizeImageUrl(metadata.image) : undefined,
            imageError: false,
          }
        } catch (error) {
          return {
            tokenId: tokenId.toString(),
            imageError: false,
          }
        }
      })

      const tokenData = await Promise.all(tokenDataPromises)
      setTokens(tokenData)
    } catch (error) {
      console.error('Error loading user tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">User Tokens</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your wallet to view tokens
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            {collectionName || 'Fake Nefturians'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Collection for <span className="font-mono text-sm bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg">{userAddress}</span>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="spinner h-12 w-12 mx-auto mb-4"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading tokens...</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              This address doesn't own any tokens yet.
            </p>
            <Link
              href="/fakeNefturians"
              className="mt-4 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-all duration-200 hover:gap-3 group"
            >
              <span>Buy a token</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {tokens.map((token) => (
              <TokenCard key={token.tokenId} token={token} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

