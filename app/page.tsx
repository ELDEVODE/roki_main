"use client";

import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import HomePage from "./Pages/Home";

export default function Home() {
  const { ready } = usePrivy();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HomePage />
    </div>
  );
}
