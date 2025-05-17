import { NextRequest } from 'next/server';
import { demoPrisma } from '@/app/utils/demo-prisma';

/**
 * Get invite details for a specific invite code
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response(JSON.stringify({ error: "Missing invite code" }), { status: 400 });
    }
    
    // Get the invite from the database
    const invite = await demoPrisma.demoInvite.findUnique({
      where: { inviteCode: code },
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
    
    // Return the invite details
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
    console.error('Error getting invite details:', error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), { status: 500 });
  }
} 