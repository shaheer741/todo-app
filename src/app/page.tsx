"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {session && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Welcome to Todo App
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <>
              <p className="text-lg text-center">
                Hello, {session.user?.name}!
              </p>
              <Button
                onClick={() => signOut()}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Sign Out
              </Button>
            </>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
