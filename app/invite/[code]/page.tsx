"use client";

import { useParams } from 'next/navigation';
import { InvitePageClient } from './InvitePageClient';

export default function InvitePage() {
  const params = useParams();
  const code = params?.code as string;
  
  return <InvitePageClient code={code} />;
} 