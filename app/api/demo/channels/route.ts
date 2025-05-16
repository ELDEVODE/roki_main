import { prisma } from '@/app/utils/prisma';
import { NextRequest } from 'next/server';

// Define variables without exporting them
const demoChannels = new Map();
const demoMessages = new Map();
const demoMemberships = new Map();

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { name, creatorId, isTokenGated, tokenAddress } = await req.json();
    
    // Validate required fields
    if (!name || !creatorId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400
      });
    }
    
    // Create the channel
    const channel = await prisma.demoChannel.create({
      data: {
        name,
        creatorId,
        isTokenGated: isTokenGated || false,
        tokenAddress: isTokenGated ? tokenAddress : null
      }
    });
    
    // Add creator as a member automatically
    await prisma.demoMembership.create({
      data: {
        userId: creatorId,
        channelId: channel.id
      }
    });
    
    return new Response(JSON.stringify(channel));
  } catch (error: any) {
    console.error('Create channel error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
}

export async function GET() {
  try {
    const channels = await prisma.demoChannel.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return new Response(JSON.stringify(channels));
  } catch (error: any) {
    console.error('Fetch channels error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
} 