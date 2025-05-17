import { demoPrisma } from '@/app/utils/demo-prisma';
import { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { name, icon } = await req.json();
  
  try {
    // Update the channel with the provided fields
    const channel = await demoPrisma.demoChannel.update({
      where: { id },
      data: {
        name: name || undefined,
        icon: icon || undefined
      },
      include: {
        members: true,
        subchannels: true,
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return new Response(JSON.stringify(channel));
  } catch (error: any) {
    console.error('Channel update error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 