import { NextRequest, NextResponse } from "next/server";
import { demoPrisma } from "@/app/utils/demo-prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, email, name } = body;
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    
    console.log(`Users/me API - Request for wallet: ${walletAddress}`);
    
    // Check if user already exists
    let user = await demoPrisma.demoUser.findUnique({
      where: { walletAddress }
    });
    
    if (user) {
      console.log(`Users/me API - Found existing user: ${user.id}`);
      return NextResponse.json(user);
    }
    
    // Create a new user
    user = await demoPrisma.demoUser.create({
      data: { 
        name: name || `User-${walletAddress.slice(0, 6)}`,
        walletAddress,
        username: email ? email.split('@')[0] : undefined,
      }
    });
    
    console.log(`Users/me API - Created new user: ${user.id}`);
    return NextResponse.json(user);
    
  } catch (error) {
    console.error("Users/me API - Error:", error);
    return NextResponse.json(
      { error: "Failed to get or create user", details: String(error) },
      { status: 500 }
    );
  }
} 