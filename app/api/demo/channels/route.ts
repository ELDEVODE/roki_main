import { prisma } from '@/app/utils/prisma';
import { NextRequest } from 'next/server';

// Define variables without exporting them
const demoChannels = new Map();
const demoMessages = new Map();
const demoMemberships = new Map();

export async function POST(req: NextRequest) {
  const { name, creatorId } = await req.json();
  
  try {
    // First, get the creator's information to include with the channel
    const creator = await prisma.demoUser.findUnique({
      where: { id: creatorId },
      select: { id: true, name: true }
    });
    
    if (!creator) {
      return new Response(JSON.stringify({ error: "Creator not found" }), { status: 404 });
    }
    
    console.log("Creating channel with creator:", creator);
    
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
              userId: creatorId,
              role: 'OWNER'
            }
          }
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
      
      // For in-memory client, manually add membership if needed
      // @ts-ignore - We're doing a runtime check here
      const isRealPrisma = prisma.user !== undefined;
      if (!isRealPrisma) {
        // Check if member was already added (should be done by members.create above)
        if (!channel.members || !channel.members.some((m: any) => m.userId === creatorId)) {
          console.log("Adding creator as member manually for in-memory client");
          // @ts-ignore - Type safety is checked at runtime
          await prisma.demoMembership.create({
            data: {
              channelId: channel.id,
              userId: creatorId,
              role: 'OWNER'
            }
          });
        }
      }
      
      console.log("Channel created with data:", JSON.stringify(channel, null, 2));
      
      // Make sure creator info is included in the response
      const responseChannel = {
        ...channel,
        creator: creator,
        members: channel.members || []
      };
      
      return new Response(JSON.stringify(responseChannel));
    } catch (error: any) {
      console.error('Channel creation error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  } catch (error: any) {
    console.error('Creator lookup error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  
  try {
    if (id) {
      // Get channel with members and messages
      const channel = await prisma.demoChannel.findUnique({
        where: { id },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          messages: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      });
      
      if (!channel) {
        return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
      }
      
      // Manually fetch creator info and add it to the response
      if (channel.creatorId) {
        try {
          const creator = await prisma.demoUser.findUnique({
            where: { id: channel.creatorId },
            select: { id: true, name: true }
          });
          
          if (creator) {
            // Add creator info to the channel
            const enhancedChannel = {
              ...channel,
              creator: creator
            };
            
            return new Response(JSON.stringify(enhancedChannel));
          }
        } catch (error) {
          console.error('Error fetching creator info:', error);
          // Continue without creator info
        }
      }
      
      // Return channel without creator info if we couldn't get it
      return new Response(JSON.stringify(channel));
    }
    
    return new Response(JSON.stringify({ error: "Channel ID required" }), { status: 400 });
  } catch (error: any) {
    console.error('Channel fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 