import { prisma } from '@/app/utils/prisma';

export async function POST(req: Request) {
  const { walletAddress, name } = await req.json();
  
  try {
    // Find or create user with Prisma
    let user = await prisma.demoUser.findUnique({
      where: { walletAddress }
    });
    
    if (!user) {
      user = await prisma.demoUser.create({
        data: { 
          walletAddress, 
          name: name || `User-${walletAddress.slice(0, 6)}` 
        }
      });
    }
    
    return new Response(JSON.stringify(user));
  } catch (error: any) {
    console.error('User creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 