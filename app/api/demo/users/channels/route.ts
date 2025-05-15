import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

interface Channel {
  id: string;
  creatorId?: string;
  name?: string;
  members?: any[];
  creator?: {
    id: string;
    name?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get("walletAddress");
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    
    // Check which Prisma client we have (real or in-memory)
    // @ts-ignore - We're doing a runtime check here
    const isRealPrisma = prisma.user !== undefined;
    
    // First find the user by wallet address
    let user;
    if (isRealPrisma) {
      // Using real Prisma client
      // @ts-ignore - Type safety is checked at runtime
      user = await prisma.user.findFirst({
        where: {
          walletAddresses: {
            some: {
              address: walletAddress
            }
          }
        }
      });
    } else {
      // Using InMemoryPrismaClient
      // @ts-ignore - Type safety is checked at runtime
      user = await prisma.demoUser.findUnique({
        where: { walletAddress }
      });
    }
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Find channels based on which client we're using
    let userChannels: Channel[];
    if (isRealPrisma) {
      // Using real Prisma client
      // @ts-ignore - Type safety is checked at runtime
      userChannels = await prisma.channel.findMany({
        where: {
          OR: [
            { creatorId: user.id },
            {
              members: {
                some: {
                  userId: user.id
                }
              }
            }
          ]
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true
            }
          },
          members: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
    } else {
      // Using InMemoryPrismaClient - simplified query for demo
      // @ts-ignore - Type safety is checked at runtime
      const allChannels = await prisma.demoChannel.findMany({
        include: {
          members: true
        }
      });
      
      // Filter manually for the in-memory client
      userChannels = allChannels.filter((channel: Channel) => 
        channel.creatorId === user.id || 
        (channel.members && channel.members.some((m: any) => String(m.userId) === String(user.id)))
      );
      
      console.log(`Found ${userChannels.length} channels for user ${user.id}`);
      
      // Attach creator info if available
      for (const channel of userChannels) {
        if (channel.creatorId) {
          // @ts-ignore - Type safety is checked at runtime
          const creator = await prisma.demoUser.findUnique({
            where: { id: channel.creatorId }
          });
          if (creator) {
            channel.creator = { id: creator.id, name: creator.name };
            console.log(`Added creator info to channel ${channel.id}: ${JSON.stringify(channel.creator)}`);
          } else {
            console.log(`Creator ${channel.creatorId} not found for channel ${channel.id}`);
          }
        } else {
          console.log(`Channel ${channel.id} has no creatorId`);
        }
        
        // Log member information to debug
        if (channel.members) {
          console.log(`Channel ${channel.id} has ${channel.members.length} members: ${JSON.stringify(channel.members)}`);
        } else {
          console.log(`Channel ${channel.id} has no members array`);
        }
      }
    }
    
    return NextResponse.json(userChannels);
  } catch (error) {
    console.error("Error fetching user channels:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
} 