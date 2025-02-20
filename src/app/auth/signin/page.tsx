"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (providerId: string) => {
    if (providerId === "credentials") {
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/");
      }
    } else {
      await signIn(providerId, { callbackUrl: "/" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Email & Password Sign-In */}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={() => handleSignIn("credentials")}
            className="w-full"
          >
            Sign in with Email
          </Button>

          {/* Google Sign-In */}
          <Button
            onClick={() => handleSignIn("google")}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Sign in with Google
          </Button>

          {/* Sign-Up Link */}
          <Button
            variant="link"
            onClick={() => router.push("/auth/signup")}
            className="text-blue-500 w-full"
          >
            Don't have an account? Sign up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
