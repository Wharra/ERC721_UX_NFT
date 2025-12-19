'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { CONTRACT_ADDRESSES, ABIS, SEPOLIA_CHAIN_ID } from '@/lib/contracts'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSignatures, SignatureData } from '@/lib/signatures'

export default function FakeMeebitsPage() {
  const { provider, signer, chainId, isConnected, connectWallet } = useWeb3()
  const router = useRouter()
  const [availableTokens, setAvailableTokens] = useState<number[]>([])
  const [signatures, setSignatures] = useState<SignatureData[]>([])
  const [selectedToken, setSelectedToken] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [minting, setMinting] = useState(false)
  const [maxTokenId, setMaxTokenId] = useState<number>(10000)

  useEffect(() => {
    if (isConnected && chainId !== null && chainId !== SEPOLIA_CHAIN_ID) {
      router.push('/wrong-network')
    }
  }, [chainId, isConnected, router])

  useEffect(() => {
    if (provider && isConnected) {
      loadSignatures()
      checkAvailableTokens()
    }
  }, [provider, isConnected])

  const loadSignatures = async () => {
    try {
      const sigs = await getSignatures()
      setSignatures(sigs)
    } catch (error) {
      console.error('Error loading signatures:', error)
    }
  }

  const checkAvailableTokens = async () => {
    if (!provider) return
    try {
      setLoading(true)
      const claimerContract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_MEEBITS_CLAIMER,
        ABIS.FAKE_MEEBITS_CLAIMER,
        provider
      )
      const meebitsContract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_MEEBITS,
        ABIS.FAKE_MEEBITS,
        provider
      )

      const available: number[] = []
      const checkPromises = []
      
      for (let i = 0; i < 200; i++) {
        checkPromises.push(
          Promise.all([
            claimerContract.tokensThatWereClaimed(i),
            meebitsContract.ownerOf(i).catch(() => null)
          ]).then(([claimed, owner]) => {
            if (!claimed && owner === null) {
              available.push(i)
            }
          }).catch(() => {})
        )
      }

      await Promise.all(checkPromises)
      setAvailableTokens(available.sort((a, b) => a - b))
    } catch (error) {
      console.error('Error checking available tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const verifyTokenAvailable = async (tokenId: number): Promise<boolean> => {
    if (!provider) return false
    try {
      const claimerContract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_MEEBITS_CLAIMER,
        ABIS.FAKE_MEEBITS_CLAIMER,
        provider
      )
      const meebitsContract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_MEEBITS,
        ABIS.FAKE_MEEBITS,
        provider
      )

      const [claimed, owner] = await Promise.all([
        claimerContract.tokensThatWereClaimed(tokenId),
        meebitsContract.ownerOf(tokenId).catch(() => null)
      ])

      return !claimed && owner === null
    } catch (error) {
      console.error('Error verifying token:', error)
      return false
    }
  }

  const handleMint = async () => {
    if (!signer || selectedToken === null) return

    const isAvailable = await verifyTokenAvailable(selectedToken)
    if (!isAvailable) {
      alert('This token has already been minted. Please select another token.')
      await checkAvailableTokens()
      return
    }

    const signatureData = signatures.find((sig) => sig.tokenNumber === selectedToken)
    if (!signatureData) {
      alert('Signature not found for this token')
      return
    }

    try {
      setMinting(true)
      const claimerContract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAKE_MEEBITS_CLAIMER,
        ABIS.FAKE_MEEBITS_CLAIMER,
        signer
      )

      const tx = await claimerContract.claimAToken(
        selectedToken,
        signatureData.signature,
        { value: 0 }
      )
      await tx.wait()
      alert('Token minted successfully!')
      await checkAvailableTokens()
      setSelectedToken(null)
    } catch (error: any) {
      console.error('Error minting token:', error)
      let errorMessage = 'Failed to mint token'
      if (error.reason) {
        errorMessage = error.reason
      } else if (error.message) {
        errorMessage = error.message
      }
      alert(`Error: ${errorMessage}`)
      await checkAvailableTokens()
    } finally {
      setMinting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Fake Meebits Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Connect your wallet to mint tokens with signature verification
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
          <h1 className="text-5xl font-bold mb-4 gradient-text">Fake Meebits</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Mint tokens with signature verification</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-10 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
            <h2 className="text-3xl font-bold mb-2 gradient-text">Mint a Token</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Select a token number that hasn't been minted yet
            </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 animate-pulse">Checking available tokens...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Select Token Number:
                </label>
                <select
                  value={selectedToken ?? ''}
                  onChange={(e) => setSelectedToken(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500"
                >
                  <option value="">Choose a token...</option>
                  {availableTokens.map((tokenId) => (
                    <option key={tokenId} value={tokenId}>
                      Token #{tokenId}
                    </option>
                  ))}
                </select>
                {availableTokens.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2 animate-pulse">
                    No available tokens found in the first 200 tokens. You can manually enter a token ID below.
                  </p>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Or enter a token ID manually:
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter token ID"
                    onChange={(e) => {
                      const value = e.target.value
                      if (value) {
                        setSelectedToken(Number(value))
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500"
                  />
                </div>
              </div>

              {selectedToken !== null && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 animate-pulse-glow">
                  <p className="text-sm font-medium mb-2">
                    <strong>Selected:</strong> Token #{selectedToken}
                  </p>
                  {signatures.find((sig) => sig.tokenNumber === selectedToken) ? (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-2">
                      <span className="text-lg">✓</span>
                      <span>Signature available</span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-2">
                      <span className="text-lg">⚠</span>
                      <span>Signature not found for this token</span>
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleMint}
                disabled={minting || selectedToken === null}
                className="btn-primary w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {minting ? (
                    <>
                      <div className="spinner h-4 w-4 border-2"></div>
                      <span>Minting token...</span>
                    </>
                  ) : (
                    <>
                      <span>Mint Token</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

