import { NextRequest } from 'next/server';
import { demoPrisma } from '@/app/utils/demo-prisma';

/**
 * Debug endpoint to check if a user is a member of a channel
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: channelId } = await context.params;
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "UserId parameter is required" }), { status: 400 });
    }
    
    // Check if channel exists
    const channel = await demoPrisma.demoChannel.findUnique({
      where: { id: channelId },
      select: {
        id: true,
        name: true,
        creatorId: true
      }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Fetch all members to check if user is in the list
    const allMembers = await demoPrisma.demoMembership.findMany({
      where: { channelId },
      select: { userId: true }
    });
    
    // Check if user is a member
    const isMember = allMembers.some(member => String(member.userId) === String(userId));
    
    // Check if user is the creator
    const isCreator = String(channel.creatorId) === String(userId);
    
    // Direct query for the specific membership record
    const membership = await demoPrisma.demoMembership.findFirst({
      where: {
        channelId,
        userId
      }
    });
    
    return new Response(JSON.stringify({
      channelId,
      userId,
      channelName: channel.name,
      isCreator,
      isMember,
      allMembers,
      specificMembership: membership,
      userIdType: typeof userId,
      memberTypes: allMembers.map(m => typeof m.userId)
    }));
    
  } catch (error: any) {
    console.error('Debug membership error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 