import { NextResponse } from 'next/server';

// Sample explore channel data for demo
const exploreChannels = [
  {
    id: 'exp1',
    name: 'NFT Collectors',
    creatorId: 'system',
    isTokenGated: true,
    tokenAddress: 'cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn',
    members: Array.from({ length: 124 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 872 }),
    description: 'Discuss NFT collections, drops, and trading strategies',
    category: 'NFT'
  },
  {
    id: 'exp2',
    name: 'DeFi Strategies',
    creatorId: 'system',
    isTokenGated: true,
    tokenAddress: 'cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn',
    members: Array.from({ length: 89 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 654 }),
    description: 'Talk about yield farming, liquidity pools, and DeFi protocols',
    category: 'DeFi'
  },
  {
    id: 'exp3',
    name: 'Gaming Guild',
    creatorId: 'system',
    isTokenGated: false,
    members: Array.from({ length: 212 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 1243 }),
    description: 'For gamers and gaming enthusiasts',
    category: 'Gaming'
  },
  {
    id: 'exp4',
    name: 'Crypto Art',
    creatorId: 'system',
    isTokenGated: false,
    members: Array.from({ length: 76 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 521 }),
    description: 'Digital art and crypto art discussions',
    category: 'Art'
  },
  {
    id: 'exp5',
    name: 'Music NFTs',
    creatorId: 'system',
    isTokenGated: true,
    tokenAddress: 'cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn',
    members: Array.from({ length: 58 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 317 }),
    description: 'Discuss music NFTs and the future of music ownership',
    category: 'Music'
  },
  {
    id: 'exp6',
    name: 'Web3 Developers',
    creatorId: 'system',
    isTokenGated: false,
    members: Array.from({ length: 145 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 892 }),
    description: 'A community for web3 developers to share knowledge and resources',
    category: 'Education'
  },
  {
    id: 'exp7',
    name: 'DAO Governance',
    creatorId: 'system',
    isTokenGated: true,
    tokenAddress: 'cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn',
    members: Array.from({ length: 67 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 433 }),
    description: 'Discuss DAO structures, governance models, and voting mechanisms',
    category: 'Social'
  },
  {
    id: 'exp8',
    name: 'Metaverse Land',
    creatorId: 'system',
    isTokenGated: false,
    members: Array.from({ length: 104 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 765 }),
    description: 'Virtual real estate in the metaverse - buying, selling, and developing',
    category: 'NFT'
  },
  {
    id: 'exp9',
    name: 'Solana Devs',
    creatorId: 'system',
    isTokenGated: false,
    members: Array.from({ length: 92 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 612 }),
    description: 'Technical discussions about Solana development',
    category: 'Education'
  },
  {
    id: 'exp10',
    name: 'Play-to-Earn',
    creatorId: 'system',
    isTokenGated: true,
    tokenAddress: 'cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn',
    members: Array.from({ length: 187 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 1054 }),
    description: 'Play-to-earn gaming strategies and opportunities',
    category: 'Gaming'
  },
  {
    id: 'exp11',
    name: 'Token Economics',
    creatorId: 'system',
    isTokenGated: false,
    members: Array.from({ length: 71 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 492 }),
    description: 'Discussions on tokenomics and economic models in crypto',
    category: 'DeFi'
  },
  {
    id: 'exp12',
    name: 'Community Builders',
    creatorId: 'system',
    isTokenGated: false,
    members: Array.from({ length: 129 }).map(() => ({ userId: Math.random().toString() })),
    messages: Array.from({ length: 843 }),
    description: 'Strategies for building and growing web3 communities',
    category: 'Social'
  },
];

export async function GET() {
  // In a real app, you would fetch from a database and apply filters/pagination
  
  // Simulate some delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(exploreChannels);
} 