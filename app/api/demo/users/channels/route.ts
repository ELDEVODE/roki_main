import { NextRequest, NextResponse } from "next/server";
import { demoPrisma } from "@/app/utils/demo-prisma";

interface Channel {
  id: string;
  creatorId?: string;
  name?: string;
  members?: any[];
  subchannels?: any[];
}

// We'll create a separate type with the creator property
interface ChannelWithCreator extends Channel {
  creator?: {
    id: string;
    name?: string | null;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get("walletAddress");
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    
    // Find the user by wallet address
    const user = await demoPrisma.demoUser.findUnique({
      where: { walletAddress }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Find all channels the user is a member of or has created
    const allChannels = await demoPrisma.demoChannel.findMany({
      include: {
        members: true,
        subchannels: true
      }
    });
    
    // Filter manually for channels where user is a member or creator
    const userChannels: ChannelWithCreator[] = allChannels.filter((channel) => 
      channel.creatorId === user.id || 
      (channel.members && channel.members.some((m: any) => String(m.userId) === String(user.id)))
    );
    
    console.log(`Found ${userChannels.length} channels for user ${user.id}`);
    
    // Attach creator info if available
    for (const channel of userChannels) {
      if (channel.creatorId) {
        const creator = await demoPrisma.demoUser.findUnique({
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

      // Log subchannel information
      if (channel.subchannels) {
        console.log(`Channel ${channel.id} has ${channel.subchannels.length} subchannels`);
      } else {
        console.log(`Channel ${channel.id} has no subchannels`);
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