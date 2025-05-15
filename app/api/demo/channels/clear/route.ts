import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function DELETE(request: NextRequest) {
  try {
    // Check which Prisma client we have (real or in-memory)
    // @ts-ignore - We're doing a runtime check here
    const isRealPrisma = prisma.user !== undefined;
    
    if (isRealPrisma) {
      // Using real Prisma client - first delete all messages and memberships
      // @ts-ignore - Type safety is checked at runtime
      await prisma.message.deleteMany({});
      // @ts-ignore - Type safety is checked at runtime
      await prisma.member.deleteMany({});
      // @ts-ignore - Type safety is checked at runtime
      await prisma.channel.deleteMany({});
    } else {
      // Using InMemoryPrismaClient
      // Just clear the arrays in our in-memory store
      // @ts-ignore - Accessing internal implementation
      if (global.inMemoryDataStore) {
        // @ts-ignore - Accessing internal implementation
        global.inMemoryDataStore.messages = [];
        // @ts-ignore - Accessing internal implementation
        global.inMemoryDataStore.memberships = [];
        // @ts-ignore - Accessing internal implementation
        global.inMemoryDataStore.channels = [];
      }
    }
    
    return NextResponse.json({ success: true, message: "All channels cleared successfully" });
  } catch (error) {
    console.error("Error clearing channels:", error);
    return NextResponse.json(
      { error: "Failed to clear channels", details: String(error) },
      { status: 500 }
    );
  }
} 