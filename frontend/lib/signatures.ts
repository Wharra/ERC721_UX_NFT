// This will be populated from the output-sig.json file
export interface SignatureData {
  tokenNumber: number
  signature: string
}

let signaturesCache: SignatureData[] | null = null

export async function getSignatures(): Promise<SignatureData[]> {
  if (signaturesCache) {
    return signaturesCache
  }

  try {
    // Try to load from public folder first
    const response = await fetch('/signatures.json')
    if (response.ok) {
      signaturesCache = await response.json()
      return signaturesCache || []
    }
    
    // Fallback to API route
    const apiResponse = await fetch('/api/signatures')
    if (apiResponse.ok) {
      signaturesCache = await apiResponse.json()
      return signaturesCache || []
    }
  } catch (error) {
    console.error('Error loading signatures:', error)
  }

  return []
}

