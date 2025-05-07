import { Suspense } from "react";
import LoadingComponent from "../components/Loading";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense fallback={<LoadingComponent />}>
        <div>{children}</div>
      </Suspense>
    </div>
  );
}
