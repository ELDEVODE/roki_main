import { prisma } from '@/app/utils/prisma';
import { NextRequest } from 'next/server';

// Define a type for the message
interface DemoMessage {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  createdAt: Date;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { content, userId } = await req.json();
  const channelId = (await params).id;
  
  try {
    // Check if channel exists
    const channel = await prisma.demoChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Check if user is a member
    const membership = await prisma.demoMembership.findFirst({
      where: {
        userId,
        channelId
      }
    });
    
    if (!membership) {
      return new Response(
        JSON.stringify({ error: "You must be a member to send messages" }), 
        { status: 403 }
      );
    }
    
    // Create a message
    const message = await prisma.demoMessage.create({
      data: {
        content,
        userId,
        channelId
      },
      include: {
        user: true
      }
    });
    
    return new Response(JSON.stringify(message));
  } catch (error: any) {
    console.error('Message creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const channelId = (await params).id;
  
  try {
    // Check if channel exists
    const channel = await prisma.demoChannel.findUnique({
      where: { id: channelId }
    });
    
    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), { status: 404 });
    }
    
    // Get messages
    const messages = await prisma.demoMessage.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' },
      include: { user: true }
    });
    
    return new Response(JSON.stringify(messages));
  } catch (error: any) {
    console.error('Message fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 