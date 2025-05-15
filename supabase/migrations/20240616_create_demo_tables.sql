-- Create Demo tables for Roki application

-- DemoUser table
CREATE TABLE IF NOT EXISTS "DemoUser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT,
  "name" TEXT,
  "walletAddress" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DemoChannel table
CREATE TABLE IF NOT EXISTS "DemoChannel" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "creatorId" UUID REFERENCES "DemoUser"("id"),
  "tokenGated" BOOLEAN DEFAULT FALSE,
  "tokenAddress" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DemoMembership table
CREATE TABLE IF NOT EXISTS "DemoMembership" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES "DemoUser"("id"),
  "channelId" UUID REFERENCES "DemoChannel"("id"),
  "role" TEXT DEFAULT 'member',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("userId", "channelId")
);

-- DemoMessage table
CREATE TABLE IF NOT EXISTS "DemoMessage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "content" TEXT NOT NULL,
  "userId" UUID REFERENCES "DemoUser"("id"),
  "channelId" UUID REFERENCES "DemoChannel"("id"),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "DemoUser_walletAddress_idx" ON "DemoUser"("walletAddress");
CREATE INDEX IF NOT EXISTS "DemoChannel_creatorId_idx" ON "DemoChannel"("creatorId");
CREATE INDEX IF NOT EXISTS "DemoMembership_userId_idx" ON "DemoMembership"("userId");
CREATE INDEX IF NOT EXISTS "DemoMembership_channelId_idx" ON "DemoMembership"("channelId");
CREATE INDEX IF NOT EXISTS "DemoMessage_channelId_idx" ON "DemoMessage"("channelId");
CREATE INDEX IF NOT EXISTS "DemoMessage_userId_idx" ON "DemoMessage"("userId");

-- Enable Row Level Security (RLS)
ALTER TABLE "DemoUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DemoChannel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DemoMembership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DemoMessage" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- For public access during development/demo
CREATE POLICY "Allow public select on DemoUser" ON "DemoUser" FOR SELECT USING (true);
CREATE POLICY "Allow public insert on DemoUser" ON "DemoUser" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on DemoUser" ON "DemoUser" FOR UPDATE USING (true);

CREATE POLICY "Allow public select on DemoChannel" ON "DemoChannel" FOR SELECT USING (true);
CREATE POLICY "Allow public insert on DemoChannel" ON "DemoChannel" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on DemoChannel" ON "DemoChannel" FOR UPDATE USING (true);

CREATE POLICY "Allow public select on DemoMembership" ON "DemoMembership" FOR SELECT USING (true);
CREATE POLICY "Allow public insert on DemoMembership" ON "DemoMembership" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on DemoMembership" ON "DemoMembership" FOR UPDATE USING (true);

CREATE POLICY "Allow public select on DemoMessage" ON "DemoMessage" FOR SELECT USING (true);
CREATE POLICY "Allow public insert on DemoMessage" ON "DemoMessage" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on DemoMessage" ON "DemoMessage" FOR UPDATE USING (true); 