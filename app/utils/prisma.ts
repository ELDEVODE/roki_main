import { PrismaClient } from '../../prisma/generated/democlient';
import { createClient } from '@supabase/supabase-js';

// Supabase client for when Prisma fails
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// For the demo, we need to create a custom Prisma client that uses our demo schema
declare global {
  var demoPrisma: PrismaClient | undefined;
  var inMemoryDataStore: InMemoryStore | undefined;
}

// In-memory data store for development/demo when database connection fails
interface InMemoryStore {
  users: any[];
  channels: any[];
  memberships: any[];
  messages: any[];
}

const createInMemoryStore = (): InMemoryStore => ({
  users: [],
  channels: [],
  memberships: [],
  messages: []
});

// Use in-memory store if we can't connect to the database
const inMemoryStore = global.inMemoryDataStore || createInMemoryStore();
if (process.env.NODE_ENV !== 'production') global.inMemoryDataStore = inMemoryStore;

// Mock Prisma client that uses in-memory store and falls back to Supabase
class InMemoryPrismaClient {
  demoUser: any;
  demoChannel: any;
  demoMembership: any;
  demoMessage: any;

  constructor() {
    this.demoUser = this.createModelAPI('users', 'DemoUser');
    this.demoChannel = this.createModelAPI('channels', 'DemoChannel');
    this.demoMembership = this.createModelAPI('memberships', 'DemoMembership');
    this.demoMessage = this.createModelAPI('messages', 'DemoMessage');
  }

  private createModelAPI(collection: keyof InMemoryStore, tableName: string) {
    return {
      create: async ({ data }: any) => {
        try {
          // Try Supabase first
          const { data: result, error } = await supabaseClient
            .from(tableName)
            .insert(data)
            .select()
            .single();
            
          if (error) throw error;
          return result;
        } catch (error) {
          console.log(`Falling back to in-memory for ${tableName}.create`, error);
          // Fall back to in-memory
          const id = data.id || `cuid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          const item = { ...data, id, createdAt: new Date() };
          
          // Special handling for relationships in demo data
          if (tableName === 'DemoChannel' && data.creatorId) {
            // Find the creator in the users store to include their name
            const creator = inMemoryStore.users.find((user: any) => user.id === data.creatorId);
            if (creator) {
              item.creator = { id: creator.id, name: creator.name };
            }
          }
          
          inMemoryStore[collection].push(item);
          return item;
        }
      },
      findUnique: async ({ where }: any) => {
        try {
          // Try with Supabase first
          const key = Object.keys(where)[0];
          const value = where[key];
          
          const { data: result, error } = await supabaseClient
            .from(tableName)
            .select('*')
            .eq(key, value)
            .single();
            
          if (error) throw error;
          return result;
        } catch (error) {
          console.log(`Falling back to in-memory for ${tableName}.findUnique`, error);
          // Fall back to in-memory
          return inMemoryStore[collection].find((item: any) => 
            Object.entries(where).every(([key, value]) => item[key] === value)
          );
        }
      },
      findMany: async ({ where, include }: any = {}) => {
        try {
          // Try with Supabase first
          let query = supabaseClient.from(tableName).select('*');
          
          if (where) {
            // Add filters for each where condition
            Object.entries(where).forEach(([key, value]) => {
              if (value !== undefined) {
                query = query.eq(key, value);
              }
            });
          }
          
          const { data: results, error } = await query;
          
          if (error) throw error;
          return results;
        } catch (error) {
          console.log(`Falling back to in-memory for ${tableName}.findMany`, error);
          // Fall back to in-memory
          let results = [...inMemoryStore[collection]];
          
          if (where) {
            results = results.filter((item: any) => 
              Object.entries(where).every(([key, value]) => {
                if (value === undefined) return true;
                return item[key] === value;
              })
            );
          }
          
          return results;
        }
      },
      update: async ({ where, data }: any) => {
        try {
          // Try with Supabase first
          const key = Object.keys(where)[0];
          const value = where[key];
          
          const { data: result, error } = await supabaseClient
            .from(tableName)
            .update({ ...data, updatedAt: new Date() })
            .eq(key, value)
            .select()
            .single();
            
          if (error) throw error;
          return result;
        } catch (error) {
          console.log(`Falling back to in-memory for ${tableName}.update`, error);
          // Fall back to in-memory
          const index = inMemoryStore[collection].findIndex((item: any) => 
            Object.entries(where).every(([key, value]) => item[key] === value)
          );
          if (index !== -1) {
            inMemoryStore[collection][index] = { 
              ...inMemoryStore[collection][index], 
              ...data,
              updatedAt: new Date()
            };
            return inMemoryStore[collection][index];
          }
          return null;
        }
      }
    };
  }
}

// Try to create real Prisma client, fall back to Supabase/in-memory
let prismaClient: PrismaClient | InMemoryPrismaClient;

try {
  // Create a singleton instance of the Prisma client
  prismaClient = global.demoPrisma || new PrismaClient();
  if (process.env.NODE_ENV !== 'production') global.demoPrisma = prismaClient as PrismaClient;
  console.log("Using real Prisma client with database");
} catch (error) {
  console.error("Failed to initialize Prisma client, using Supabase with in-memory fallback:", error);
  prismaClient = new InMemoryPrismaClient();
}

export const prisma = prismaClient; 