import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/utils/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get("walletAddress");
    
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }
    
    // First find the user by wallet address
    const user = await db.user.findFirst({
      where: {
        walletAddresses: {
          some: {
            address: walletAddress
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Find all channels where the user is a member or creator
    const userChannels = await db.channel.findMany({
      where: {
        OR: [
          {
            creatorId: user.id
          },
          {
            members: {
              some: {
                userId: user.id
              }
            }
          }
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        },
        members: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json(userChannels);
  } catch (error) {
    console.error("Error fetching user channels:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 