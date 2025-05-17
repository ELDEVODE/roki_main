import { NextResponse } from 'next/server';

// Create a function to generate sample subchannels for each channel
function generateSubchannels(count = 1) {
  const types = ["TEXT", "VOICE", "VIDEO"];
  return Array.from({ length: count }).map((_, index) => {
    // Determine if this subchannel should be token gated
    const isTokenGated = Math.random() > 0.7; // 30% chance of being token gated
    
    return {
      id: `sub-${Math.random().toString(36).substring(2, 10)}`,
      name: index === 0 ? "general" : ["announcements", "random", "help", "introductions", "resources"][Math.floor(Math.random() * 5)],
      type: types[Math.floor(Math.random() * types.length)],
      isTokenGated: index === 0 ? false : isTokenGated, // general is never token gated
      tokenAddress: isTokenGated ? 'cTokELwf3CuXFTUzLcRENMzWrkfMD1T6YgGBKDmV3rn' : null,
      messages: Array.from({ length: Math.floor(Math.random() * 100) + 20 })
    };
  });
}

// Sample explore channel data for demo
const exploreChannels = [
  {
    id: 'exp1',
    name: 'NFT Collectors',
    creatorId: 'system',
    members: Array.from({ length: 124 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(4),
    description: 'Discuss NFT collections, drops, and trading strategies',
    category: 'NFT'
  },
  {
    id: 'exp2',
    name: 'DeFi Strategies',
    creatorId: 'system',
    members: Array.from({ length: 89 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(3),
    description: 'Talk about yield farming, liquidity pools, and DeFi protocols',
    category: 'DeFi'
  },
  {
    id: 'exp3',
    name: 'Gaming Guild',
    creatorId: 'system',
    members: Array.from({ length: 212 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(5),
    description: 'For gamers and gaming enthusiasts',
    category: 'Gaming'
  },
  {
    id: 'exp4',
    name: 'Crypto Art',
    creatorId: 'system',
    members: Array.from({ length: 76 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(2),
    description: 'Digital art and crypto art discussions',
    category: 'Art'
  },
  {
    id: 'exp5',
    name: 'Music NFTs',
    creatorId: 'system',
    members: Array.from({ length: 58 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(3),
    description: 'Discuss music NFTs and the future of music ownership',
    category: 'Music'
  },
  {
    id: 'exp6',
    name: 'Web3 Developers',
    creatorId: 'system',
    members: Array.from({ length: 145 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(4),
    description: 'A community for web3 developers to share knowledge and resources',
    category: 'Education'
  },
  {
    id: 'exp7',
    name: 'DAO Governance',
    creatorId: 'system',
    members: Array.from({ length: 67 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(2),
    description: 'Discuss DAO structures, governance models, and voting mechanisms',
    category: 'Social'
  },
  {
    id: 'exp8',
    name: 'Metaverse Land',
    creatorId: 'system',
    members: Array.from({ length: 104 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(3),
    description: 'Virtual real estate in the metaverse - buying, selling, and developing',
    category: 'NFT'
  },
  {
    id: 'exp9',
    name: 'Solana Devs',
    creatorId: 'system',
    members: Array.from({ length: 92 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(4),
    description: 'Technical discussions about Solana development',
    category: 'Education'
  },
  {
    id: 'exp10',
    name: 'Play-to-Earn',
    creatorId: 'system',
    members: Array.from({ length: 187 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(5),
    description: 'Play-to-earn gaming strategies and opportunities',
    category: 'Gaming'
  },
  {
    id: 'exp11',
    name: 'Token Economics',
    creatorId: 'system',
    members: Array.from({ length: 71 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(2),
    description: 'Discussions on tokenomics and economic models in crypto',
    category: 'DeFi'
  },
  {
    id: 'exp12',
    name: 'Community Builders',
    creatorId: 'system',
    members: Array.from({ length: 129 }).map(() => ({ userId: Math.random().toString() })),
    subchannels: generateSubchannels(3),
    description: 'Strategies for building and growing web3 communities',
    category: 'Social'
  },
];

// Add a helper property to easily identify token-gated channels for the UI
const enhancedExploreChannels = exploreChannels.map(channel => {
  // A channel is considered token gated if any of its subchannels are token gated
  const hasTokenGatedSubchannel = channel.subchannels.some(sub => sub.isTokenGated);
  
  return {
    ...channel,
    hasTokenGatedContent: hasTokenGatedSubchannel
  };
});

export async function GET() {
  // In a real app, you would fetch from a database and apply filters/pagination
  
  // Simulate some delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(enhancedExploreChannels);
} 