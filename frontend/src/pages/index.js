import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [totalStaked, setTotalStaked] = useState('1,250,000')
  const [totalRewards, setTotalRewards] = useState('45,780')
  const [activeStakers, setActiveStakers] = useState('2,134')

  const connectWallet = async () => {
    // Wallet connection logic will be implemented
    setWalletConnected(true)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900">
      <Head>
        <title>StrawHat DeFi Platform | IndiaCodex Hackathon 2024</title>
        <meta name="description" content="Decentralized Finance platform built on Cardano blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="text-2xl font-bold text-white">
            🏴‍☠️ StrawHat DeFi
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="/stake" className="text-sm font-semibold leading-6 text-white hover:text-yellow-400">
            Stake
          </Link>
          <Link href="/farm" className="text-sm font-semibold leading-6 text-white hover:text-yellow-400">
            Farm
          </Link>
          <Link href="/nft" className="text-sm font-semibold leading-6 text-white hover:text-yellow-400">
            NFT Marketplace
          </Link>
          <Link href="/lend" className="text-sm font-semibold leading-6 text-white hover:text-yellow-400">
            Lending
          </Link>
        </div>

        <div className="flex lg:flex-1 lg:justify-end">
          <button 
            onClick={connectWallet}
            className={`rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              walletConnected 
                ? 'bg-green-600 text-white hover:bg-green-500'
                : 'bg-yellow-600 text-white hover:bg-yellow-500'
            }`}
          >
            {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      <main className="px-6 py-24 sm:py-32 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          {...fadeInUp}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Set Sail for DeFi Adventures
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Join the Straw Hat crew in revolutionizing DeFi on Cardano. 
            Stake, farm, lend, and trade with the spirit of adventure!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/stake"
              className="rounded-md bg-yellow-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
            >
              Start Staking
            </Link>
            <Link 
              href="/docs" 
              className="text-sm font-semibold leading-6 text-white hover:text-yellow-400"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mx-auto mt-20 max-w-7xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center">
              <h3 className="text-2xl font-bold text-yellow-400">{totalStaked} ADA</h3>
              <p className="mt-2 text-sm text-gray-300">Total Staked</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center">
              <h3 className="text-2xl font-bold text-green-400">{totalRewards} ADA</h3>
              <p className="mt-2 text-sm text-gray-300">Rewards Distributed</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 text-center">
              <h3 className="text-2xl font-bold text-blue-400">{activeStakers}</h3>
              <p className="mt-2 text-sm text-gray-300">Active Stakers</p>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mx-auto mt-20 max-w-7xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Platform Features</h2>
            <p className="mt-4 text-lg text-gray-300">
              Everything you need for your DeFi journey on Cardano
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Staking Pool",
                description: "Stake ADA and native tokens to earn rewards",
                icon: "🎯",
                link: "/stake"
              },
              {
                title: "Yield Farming",
                description: "Provide liquidity and farm STRAW tokens",
                icon: "🌾",
                link: "/farm"
              },
              {
                title: "NFT Staking",
                description: "Stake your Straw Hat NFTs for bonuses",
                icon: "🖼️",
                link: "/nft"
              },
              {
                title: "P2P Lending",
                description: "Lend and borrow with collateral",
                icon: "🏦",
                link: "/lend"
              }
            ].map((feature, index) => (
              <Link 
                key={index}
                href={feature.link}
                className="group rounded-2xl bg-white/10 backdrop-blur-sm p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Hackathon Badge */}
        <motion.div 
          className="mx-auto mt-20 max-w-2xl text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 p-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              🏆 IndiaCodex Hackathon 2024
            </h3>
            <p className="text-white/90">
              Built by Team StrawHat - Revolutionizing DeFi on Cardano
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2024 StrawHat DeFi Platform. Built with ❤️ for IndiaCodex Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}