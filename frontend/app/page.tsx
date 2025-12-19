import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ERC721 Token Manager
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Explore and interact with NFT collections on Sepolia testnet
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
          <Link href="/chain-info" className="group block">
            <div className="card-hover bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 relative overflow-hidden border border-gray-100 dark:border-slate-700 h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Chain Info
                </h2>
                <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors flex-1">
                  View network information and connection status
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                    View details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/fakeBayc" className="group block">
            <div className="card-hover bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 relative overflow-hidden border border-gray-100 dark:border-slate-700 h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-yellow-500/0 group-hover:from-orange-500/5 group-hover:to-yellow-500/5 transition-all duration-300"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Fake BAYC
                </h2>
                <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors flex-1">
                  Claim and explore Bored Ape tokens
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-2">
                    Explore collection
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/fakeNefturians" className="group block">
            <div className="card-hover bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 relative overflow-hidden border border-gray-100 dark:border-slate-700 h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Fake Nefturians
                </h2>
                <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors flex-1">
                  Buy and collect Nefturian NFTs
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2">
                    Shop now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/fakeMeebits" className="group block">
            <div className="card-hover bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 relative overflow-hidden border border-gray-100 dark:border-slate-700 h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300"></div>
              <div className="relative flex-1 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Fake Meebits
                </h2>
                <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors flex-1">
                  Mint Meebits with signature verification
                </p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                    Mint tokens
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

