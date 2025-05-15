"use client";

import { Suspense } from "react";
import LoadingComponent from "../components/Loading";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingComponent />}>
      {children}
    </Suspense>
  );
}
