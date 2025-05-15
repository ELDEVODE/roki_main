import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

// Register a new user or get an existing one
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, name } = body;
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    
    // Check which client we have
    // @ts-ignore - We're doing a runtime check here
    const isRealPrisma = prisma.user !== undefined;
    
    if (isRealPrisma) {
      // Using real Prisma client
      // First, check if a user with this wallet already exists
      // @ts-ignore - Type safety is checked at runtime
      let user = await prisma.user.findFirst({
        where: {
          walletAddresses: {
            some: {
              address: walletAddress
            }
          }
        }
      });
      
      if (user) {
        return NextResponse.json(user);
      }
      
      // Create a new user
      // @ts-ignore - Type safety is checked at runtime
      user = await prisma.user.create({
        data: {
          name: name || `User-${walletAddress.slice(0, 6)}`,
          walletAddresses: {
            create: {
              address: walletAddress,
              isDefault: true
            }
          }
        }
      });
      
      return NextResponse.json(user);
    } else {
      // Using InMemoryPrismaClient
      // @ts-ignore - Type safety is checked at runtime
    let user = await prisma.demoUser.findUnique({
      where: { walletAddress }
    });
    
      if (user) {
        return NextResponse.json(user);
      }
      
      // Create a new user
      // @ts-ignore - Type safety is checked at runtime
      user = await prisma.demoUser.create({
        data: { 
          name: name || `User-${walletAddress.slice(0, 6)}`,
          walletAddress
        }
      });
      
      return NextResponse.json(user);
    }
    
  } catch (error) {
    console.error("Error creating/getting user:", error);
    return NextResponse.json(
      { error: "Failed to create/get user", details: String(error) },
      { status: 500 }
    );
  }
}

// Update user information
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Check which client we have
    // @ts-ignore - We're doing a runtime check here
    const isRealPrisma = prisma.user !== undefined;
    
    if (isRealPrisma) {
      // Using real Prisma client
      // @ts-ignore - Type safety is checked at runtime
      const user = await prisma.user.update({
        where: { id: userId },
        data: { name }
      });
      
      return NextResponse.json(user);
    } else {
      // Using InMemoryPrismaClient
      // @ts-ignore - Type safety is checked at runtime
      const user = await prisma.demoUser.update({
        where: { id: userId },
        data: { name }
      });
      
      return NextResponse.json(user);
    }
    
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: String(error) },
      { status: 500 }
    );
  }
} 