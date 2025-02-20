"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component: any) {
  return function ProtectedPage(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.replace("/auth/signin");
      }
    }, [status, router]);

    if (status === "loading") {
      return null;
    }

    if (!session) {
      return null; 
    }

    return <Component {...props} />;
  };
}
