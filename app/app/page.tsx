"use client";
import { UserProfile } from "../components/UserProfile";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            Dashboard
          </h1>
          <p className="text-xl text-gray-400">
            Welcome to your dashboard. Here you can manage your account and view
            your profile information.
          </p>
        </div>
        <UserProfile />
      </div>
    </div>
  );
}
