import { NextRequest } from 'next/server';
import { demoPrisma } from '@/app/utils/demo-prisma';
import { randomBytes } from 'crypto';

/**
 * Generate an invite link for a channel
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, expiryOption, maxUses } = await req.json();
    const { id: channelId } = await context.params;
    
    console.log(`Invite API - Create request: userId=${userId}, channelId=${channelId}, expiryOption=${expiryOption}`, { maxUses });
    
    // Validate input
    if (!userId || !channelId) {
      return new Response(JSON.stringify({ 
        error: "Missing required parameters", 
        debug: { userId, channelId }
      }), { status: 400 });
    }
    
    // Check if the channel exists
    const channel = await demoPrisma.demoChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!channel) {
      console.log(`Invite API - Channel ${channelId} not found`);
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Generate a unique invite code
    const inviteCode = randomBytes(4).toString('hex');
    
    // Calculate expiry date if needed
    let expiresAt: Date | null = null;
    if (expiryOption === '24h') {
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
    } else if (expiryOption === 'custom' && typeof maxUses === 'object' && maxUses?.days) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + maxUses.days);
    }
    
    // Set max uses - handling different formats
    let maxUsesCount: number | null = null;
    if (maxUses === 'once' || maxUses === 1) {
      maxUsesCount = 1;
    } else if (typeof maxUses === 'number' && maxUses > 0) {
      maxUsesCount = maxUses;
    } else if (typeof maxUses === 'object' && maxUses?.count) {
      maxUsesCount = maxUses.count;
    }
    
    // Create the invite in the database
    const invite = await demoPrisma.demoInvite.create({
      data: {
        inviteCode,
        channelId,
        createdBy: userId,
        expiresAt,
        maxUses: maxUsesCount,
        useCount: 0
      }
    });
    
    console.log(`Invite API - Created invite ${inviteCode} for channel ${channelId} by user ${userId}`);
    
    // Return the invite details
    return new Response(JSON.stringify({
      inviteCode,
      channelId,
      expiresAt,
      maxUses: maxUsesCount
    }));
    
  } catch (error: any) {
    console.error('Invite API - Creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "An unknown error occurred",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { status: 500 });
  }
}

/**
 * Get details about an invite
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const inviteCode = req.nextUrl.searchParams.get('code');
    
    if (!inviteCode) {
      return new Response(JSON.stringify({ error: "Invalid invite code" }), { status: 400 });
    }
    
    // Get the invite from the database
    const invite = await demoPrisma.demoInvite.findUnique({
      where: { inviteCode },
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            _count: {
              select: { members: true }
            }
          }
        }
      }
    });
    
    if (!invite) {
      return new Response(JSON.stringify({ error: "Invite not found" }), { status: 404 });
    }
    
    // Check if the invite has expired
    if (invite.expiresAt && new Date() > invite.expiresAt) {
      // Delete expired invite
      await demoPrisma.demoInvite.delete({
        where: { id: invite.id }
      });
      return new Response(JSON.stringify({ error: "Invite has expired" }), { status: 410 });
    }
    
    // Check if max uses has been reached
    if (invite.maxUses !== null && invite.useCount >= invite.maxUses) {
      return new Response(JSON.stringify({ error: "Invite has reached maximum use count" }), { status: 410 });
    }
    
    if (!invite.channel) {
      // Channel doesn't exist anymore, remove the invite
      await demoPrisma.demoInvite.delete({
        where: { id: invite.id }
      });
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({
      channel: {
        id: invite.channel.id,
        name: invite.channel.name,
        memberCount: invite.channel._count.members
      },
      expiresAt: invite.expiresAt,
      maxUses: invite.maxUses,
      useCount: invite.useCount
    }));
    
  } catch (error: any) {
    console.error('Invite API - Details error:', error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), { status: 500 });
  }
} 