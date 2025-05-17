import { NextRequest } from 'next/server';
import { demoPrisma } from '@/app/utils/demo-prisma';
import { Prisma } from '@prisma/client';

// Type for Prisma errors
type PrismaError = {
  code: string;
  message: string;
  meta?: any;
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, walletAddress, inviteCode } = await req.json();
    const { id } = await context.params;
    
    console.log(`Join API - Request: channelId=${id}, userId=${userId}, walletAddress=${walletAddress}${inviteCode ? ', with invite' : ''}`);
    
    // Validate input parameters
    if (!userId) {
      console.error("Join API - Missing userId in request");
      return new Response(JSON.stringify({ 
        error: "Missing required parameter: userId", 
        details: "A valid user ID must be provided"
      }), { status: 400 });
    }
    
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
      // Try to find the user first by ID
      console.log(`Join API - Looking for user with ID: ${userId}`);
      user = await demoPrisma.demoUser.findUnique({
        where: { id: userId }
      });
      
      // If user doesn't exist, check by wallet address (if provided)
      if (!user && walletAddress) {
        console.log(`Join API - User ID not found, checking by wallet address: ${walletAddress}`);
        user = await demoPrisma.demoUser.findUnique({
          where: { walletAddress }
        });
        
        // If we found a user by wallet address but with different ID, return conflict error
        if (user) {
          console.log(`Join API - Found existing user with wallet address ${walletAddress}, ID: ${user.id}`);
          return new Response(JSON.stringify({ 
            error: "User with this wallet address already exists", 
            details: `Please use user ID: ${user.id} instead of ${userId}`
          }), { status: 409 });
        }
      }
      
      // If user still doesn't exist, create a new one
      if (!user) {
        console.log(`Join API - User ${userId} not found, creating new user`);
        
        if (!walletAddress) {
          console.error("Join API - Cannot create user without wallet address");
          return new Response(JSON.stringify({ 
            error: "Cannot create user", 
            details: "No wallet address provided for user creation"
          }), { status: 400 });
        }
        
        const walletToUse = walletAddress;
        
        // Double-check that no user exists with this wallet address
        const existingUserWithWallet = await demoPrisma.demoUser.findUnique({
          where: { walletAddress: walletToUse }
        });
        
        if (existingUserWithWallet) {
          console.log(`Join API - User with wallet address ${walletToUse} already exists, ID: ${existingUserWithWallet.id}`);
          return new Response(JSON.stringify({ 
            error: "User with this wallet address already exists", 
            details: `Please use the existing account with ID: ${existingUserWithWallet.id}`
          }), { status: 409 });
        }
        
        // Create the new user with provided ID and wallet address
        try {
          user = await demoPrisma.demoUser.create({
            data: {
              id: userId,
              walletAddress: walletToUse,
              name: `User-${userId.substring(0, 6)}`
            }
          });
          console.log(`Join API - Created new user: ${user.id} with wallet: ${walletToUse}`);
        } catch (error: unknown) {
          const createError = error as PrismaError;
          console.error("Join API - Error creating user:", createError);
          // Check if it's a unique constraint error
          if (createError.code === 'P2002') {
            return new Response(JSON.stringify({ 
              error: "Failed to create user", 
              details: "A user with this ID or wallet address already exists",
              code: createError.code
            }), { status: 409 });
          }
          return new Response(JSON.stringify({ 
            error: "Failed to create user", 
            details: String(createError),
            code: createError.code
          }), { status: 500 });
        }
      }
    } catch (error: unknown) {
      const prismaError = error as PrismaError;
      console.error("Join API - Error ensuring user exists:", prismaError);
      return new Response(JSON.stringify({ 
        error: "Could not create or find user", 
        details: prismaError.message || String(prismaError),
        code: prismaError.code
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
    try {
      const membership = await demoPrisma.demoMembership.create({
        data: {
          userId: user.id, // Use the resolved user ID
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
      
      console.log(`Join API - User ${user.id} added as member to channel ${id}`);
      
      return new Response(JSON.stringify(membership));
    } catch (error: unknown) {
      const membershipError = error as PrismaError;
      console.error("Join API - Error creating membership:", membershipError);
      return new Response(JSON.stringify({ 
        error: "Failed to add user to channel",
        details: String(membershipError),
        code: membershipError.code
      }), { status: 500 });
    }
  } catch (error: any) {
    console.error('Join API - Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "An error occurred while joining the channel",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code
    }), { status: 500 });
  }
} 