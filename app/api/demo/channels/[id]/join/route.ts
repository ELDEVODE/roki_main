import { NextRequest } from 'next/server';
import { demoPrisma } from '@/app/utils/demo-prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, walletAddress, inviteCode } = await req.json();
    const { id } = params;
    
    console.log(`Join API - Request: channelId=${id}, userId=${userId}${inviteCode ? ', with invite' : ''}`);
    
    // First check if the channel exists
    const channel = await demoPrisma.demoChannel.findUnique({
      where: { id },
      include: {
        members: true,
        subchannels: {
          where: {
            isTokenGated: true
          }
        }
      }
    });
    
    if (!channel) {
      console.log(`Join API - Channel ${id} not found`);
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Ensure user exists - create if not found
    let user = null;
    try {
      // Try to find the user first
      user = await demoPrisma.demoUser.findUnique({
        where: { id: userId }
      });
      
      // If user doesn't exist, create a new one
      if (!user) {
        console.log(`Join API - User ${userId} not found, creating new user`);
        user = await demoPrisma.demoUser.create({
          data: {
            id: userId,
            walletAddress: walletAddress || `0x${userId.substring(0, 10)}`, // Use part of userId if no wallet address
            name: `User-${userId.substring(0, 6)}`
          }
        });
        console.log(`Join API - Created new user: ${user.id}`);
      }
    } catch (error) {
      console.error("Join API - Error ensuring user exists:", error);
      return new Response(JSON.stringify({ 
        error: "Could not create or find user", 
        details: error instanceof Error ? error.message : String(error)
      }), { status: 500 });
    }
    
    // Normalize user ID for consistent comparison
    const normalizedUserId = String(userId).toLowerCase();
    
    // Check if user is already a member with case-insensitive comparison
    const existingMembership = channel.members.find(
      member => String(member.userId).toLowerCase() === normalizedUserId
    );
    
    if (existingMembership) {
      console.log(`Join API - User ${userId} is already a member of channel ${id}`);
      // User is already a member
      return new Response(JSON.stringify({ 
        message: "User is already a member of this channel",
        membership: existingMembership
      }));
    }
    
    // If there are token-gated subchannels and no invite code, verify access
    if (channel.subchannels.length > 0 && !inviteCode) {
      // For demo, we'll simplify and allow anyone to join
      // In a real app, you'd verify token ownership here
      console.log("Join API - Channel has token-gated subchannels, but allowing join for demo purposes");
    }
    
    // If invite code is provided, validate it
    if (inviteCode) {
      // Get the invite from the database
      const invite = await demoPrisma.demoInvite.findUnique({
        where: { inviteCode }
      });
      
      if (!invite) {
        console.log(`Join API - Invalid invite code: ${inviteCode}`);
        return new Response(JSON.stringify({ error: "Invalid invite code" }), { status: 400 });
      }
      
      if (invite.channelId !== id) {
        console.log(`Join API - Invite code is for a different channel: ${invite.channelId}`);
        return new Response(JSON.stringify({ error: "Invite code is for a different channel" }), { status: 400 });
      }
      
      // Check if the invite has expired
      if (invite.expiresAt && new Date() > invite.expiresAt) {
        console.log(`Join API - Invite has expired: ${inviteCode}`);
        // Delete expired invite
        await demoPrisma.demoInvite.delete({
          where: { id: invite.id }
        });
        return new Response(JSON.stringify({ error: "Invite has expired" }), { status: 410 });
      }
      
      // Check if max uses has been reached
      if (invite.maxUses !== null && invite.useCount >= invite.maxUses) {
        console.log(`Join API - Invite has reached maximum use count: ${inviteCode}`);
        return new Response(JSON.stringify({ error: "Invite has reached maximum use count" }), { status: 410 });
      }
      
      // Increment the use count
      const updatedInvite = await demoPrisma.demoInvite.update({
        where: { id: invite.id },
        data: { useCount: { increment: 1 } }
      });
      
      console.log(`Join API - Incremented invite ${inviteCode} use count to ${updatedInvite.useCount}`);
      
      // If max uses reached, delete the invite
      if (updatedInvite.maxUses !== null && updatedInvite.useCount >= updatedInvite.maxUses) {
        console.log(`Join API - Max uses reached, deleting invite: ${inviteCode}`);
        await demoPrisma.demoInvite.delete({
          where: { id: invite.id }
        });
      }
    }
    
    // Add the user as a member
    const membership = await demoPrisma.demoMembership.create({
      data: {
        userId,
        channelId: id,
        role: 'MEMBER'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    console.log(`Join API - User ${userId} added as member to channel ${id}`);
    
    return new Response(JSON.stringify(membership));
  } catch (error: any) {
    console.error('Join API - Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "An error occurred while joining the channel",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { status: 500 });
  }
} 