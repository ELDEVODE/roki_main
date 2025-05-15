import { prisma } from '@/app/utils/prisma';

// In-memory storage for the demo
export const demoChannels = new Map();
export const demoMessages = new Map();
export const demoMemberships = new Map();

export async function POST(req: Request) {
  const { name, creatorId } = await req.json();
  
  try {
    // Create a channel using Prisma
    const channel = await prisma.demoChannel.create({
      data: {
        name,
        creatorId,
        isTokenGated: false,
        // Add creator as a member automatically
        members: {
          create: {
            userId: creatorId
          }
        }
      },
      include: {
        members: true
      }
    });
    
    return new Response(JSON.stringify(channel));
  } catch (error: any) {
    console.error('Channel creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  
  try {
    if (id) {
      // Get channel with members and messages
      const channel = await prisma.demoChannel.findUnique({
        where: { id },
        include: {
          members: true,
          messages: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });
      
      if (!channel) {
        return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
      }
      
      return new Response(JSON.stringify(channel));
    }
    
    return new Response(JSON.stringify({ error: "Channel ID required" }), { status: 400 });
  } catch (error: any) {
    console.error('Channel fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 