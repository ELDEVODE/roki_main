import { PermissionType, RoleTemplateType } from "@prisma/client";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          privyId: string;
          email: string | null;
          name: string | null;
          username: string | null;
          profileImage: string | null;
          description: string | null;
          createdAt: string;
          updatedAt: string;
          online: boolean;
          lastSeen: string | null;
        };
        Insert: {
          id?: string;
          privyId: string;
          email?: string | null;
          name?: string | null;
          username?: string | null;
          profileImage?: string | null;
          description?: string | null;
          createdAt?: string;
          updatedAt?: string;
          online?: boolean;
          lastSeen?: string | null;
        };
        Update: {
          id?: string;
          privyId?: string;
          email?: string | null;
          name?: string | null;
          username?: string | null;
          profileImage?: string | null;
          description?: string | null;
          createdAt?: string;
          updatedAt?: string;
          online?: boolean;
          lastSeen?: string | null;
        };
      };
      WalletAddress: {
        Row: {
          id: string;
          address: string;
          userId: string;
          isDefault: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          address: string;
          userId: string;
          isDefault?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          address?: string;
          userId?: string;
          isDefault?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Channel: {
        Row: {
          id: string;
          title: string;
          icon: string | null;
          type: string;
          parentId: string | null;
          maxRoles: number;
          creatorId: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          title: string;
          icon?: string | null;
          type: string;
          parentId?: string | null;
          maxRoles?: number;
          creatorId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          title?: string;
          icon?: string | null;
          type?: string;
          parentId?: string | null;
          maxRoles?: number;
          creatorId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      SubChannel: {
        Row: {
          id: string;
          title: string;
          icon: string | null;
          type: string;
          parentId: string | null;
          creatorId: string | null;
          sentTime: string | null;
          deliveryStatus: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          title: string;
          icon?: string | null;
          type: string;
          parentId?: string | null;
          creatorId?: string | null;
          sentTime?: string | null;
          deliveryStatus?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          title?: string;
          icon?: string | null;
          type?: string;
          parentId?: string | null;
          creatorId?: string | null;
          sentTime?: string | null;
          deliveryStatus?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Content: {
        Row: {
          id: string;
          message: string;
          channelId: string;
          userId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          message: string;
          channelId: string;
          userId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          message?: string;
          channelId?: string;
          userId?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Reaction: {
        Row: {
          id: string;
          emoji: string;
          contentId: string;
          userId: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          emoji: string;
          contentId: string;
          userId: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          emoji?: string;
          contentId?: string;
          userId?: string;
          createdAt?: string;
        };
      };
      Role: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          permissions: PermissionType[];
          templateType: RoleTemplateType;
          isDefault: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          permissions: PermissionType[];
          templateType?: RoleTemplateType;
          isDefault?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          permissions?: PermissionType[];
          templateType?: RoleTemplateType;
          isDefault?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      ChannelRole: {
        Row: {
          id: string;
          channelId: string;
          roleId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          channelId: string;
          roleId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          channelId?: string;
          roleId?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      UserRole: {
        Row: {
          id: string;
          userId: string;
          roleId: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          roleId: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          roleId?: string;
          createdAt?: string;
        };
      };
      Member: {
        Row: {
          id: string;
          userId: string;
          channelId: string;
          image: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          channelId: string;
          image?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          channelId?: string;
          image?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      MemberRole: {
        Row: {
          id: string;
          memberId: string;
          channelRoleId: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          memberId: string;
          channelRoleId: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          memberId?: string;
          channelRoleId?: string;
          createdAt?: string;
        };
      };
      Tag: {
        Row: {
          id: string;
          name: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          createdAt?: string;
        };
      };
      ContentTag: {
        Row: {
          contentId: string;
          tagId: string;
        };
        Insert: {
          contentId: string;
          tagId: string;
        };
        Update: {
          contentId?: string;
          tagId?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      PermissionType: PermissionType;
      RoleTemplateType: RoleTemplateType;
    };
  };
}
