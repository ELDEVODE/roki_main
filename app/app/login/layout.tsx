import { Suspense } from "react";
import LoadingComponent from "@/app/components/Loading";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<LoadingComponent />}>{children}</Suspense>
    </div>
  );
}
