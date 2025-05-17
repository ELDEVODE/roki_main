import { PrismaClient as DemoPrismaClient } from '../prisma/generated/democlient';

const demoPrisma = new DemoPrismaClient();

interface TableCount {
  tableName: string;
  count: number;
}

async function checkDatabaseStatus() {
  console.log("📊 Checking database status...");
  
  try {
    // Get counts for all tables
    const tables: TableCount[] = [
      { 
        tableName: "DemoUsers", 
        count: await demoPrisma.demoUser.count() 
      },
      { 
        tableName: "DemoChannels", 
        count: await demoPrisma.demoChannel.count() 
      },
      { 
        tableName: "DemoSubChannels", 
        count: await demoPrisma.demoSubChannel.count() 
      },
      { 
        tableName: "DemoMemberships", 
        count: await demoPrisma.demoMembership.count() 
      },
      { 
        tableName: "DemoMessages", 
        count: await demoPrisma.demoMessage.count() 
      },
      { 
        tableName: "DemoInvites", 
        count: await demoPrisma.demoInvite.count() 
      }
    ];
    
    // Print the results in a table format
    console.log("\nCurrent Database Status:");
    console.log("------------------------");
    
    // Find the longest table name for formatting
    const longestNameLength = Math.max(...tables.map(t => t.tableName.length));
    
    // Print each table count
    tables.forEach(table => {
      const padding = " ".repeat(longestNameLength - table.tableName.length + 2);
      console.log(`${table.tableName}:${padding}${table.count} records`);
    });
    
    // Print summary
    const totalRecords = tables.reduce((sum, table) => sum + table.count, 0);
    console.log("------------------------");
    console.log(`Total Records: ${totalRecords}`);
    
    if (totalRecords === 0) {
      console.log("\n✅ Database is clean - all tables are empty.");
    } else {
      console.log("\n⚠️  Database contains data - tables are not empty.");
    }
    
  } catch (error) {
    console.error("❌ Error checking database status:", error);
    process.exit(1);
  } finally {
    await demoPrisma.$disconnect();
  }
}

checkDatabaseStatus()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  }); 