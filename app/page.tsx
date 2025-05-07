"use client";

import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import HomePage from "./Pages/Home";
import LoadingComponent from "./components/Loading";
import { useState } from "react";

export default function Home() {
  const { ready } = usePrivy();

  // loading state using useState
  const [loading, setLoading] = useState(true);

  if (!ready) {
    return (
      <div>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div>
      <HomePage />
    </div>
  );
}
