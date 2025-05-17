import { NextRequest, NextResponse } from "next/server";
import { demoPrisma } from "@/app/utils/demo-prisma";

// Register a new user or get an existing one
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, name, username, profileImage, description } = body;
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    
    // Check if user already exists
    let user = await demoPrisma.demoUser.findUnique({
      where: { walletAddress }
    });
    
    if (user) {
      return NextResponse.json(user);
    }
    
    // Create a new user with additional profile fields
    user = await demoPrisma.demoUser.create({
      data: { 
        name: name || `User-${walletAddress.slice(0, 6)}`,
        walletAddress,
        username: username,
        profileImage: profileImage,
        description: description,
      }
    });
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error("Error creating/getting user:", error);
    return NextResponse.json(
      { error: "Failed to create/get user", details: String(error) },
      { status: 500 }
    );
  }
}

// Update user information using PUT (used by the ChatSidebar component)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, name, username, profileImage, description } = body;
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    
    // Find user by wallet address
    let user = await demoPrisma.demoUser.findUnique({
      where: { walletAddress }
    });
    
    if (user) {
      // Update existing user
      user = await demoPrisma.demoUser.update({
        where: { walletAddress },
        data: { 
          name,
          username,
          profileImage,
          description
        }
      });
    } else {
      // Create user if not found
      user = await demoPrisma.demoUser.create({
        data: { 
          name: name || `User-${walletAddress.slice(0, 6)}`,
          walletAddress,
          username: username || "",
          profileImage: profileImage || "",
          description: description || "",
        }
      });
    }
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: String(error) },
      { status: 500 }
    );
  }
}

// Update user information
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, username, profileImage, description } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Update the user
    const user = await demoPrisma.demoUser.update({
      where: { id: userId },
      data: { 
        name,
        username,
        profileImage,
        description
      }
    });
    
    return NextResponse.json(user);
    
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: String(error) },
      { status: 500 }
    );
  }
} 