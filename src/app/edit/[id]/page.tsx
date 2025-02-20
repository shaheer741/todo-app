"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import withAuth from "@/components/withAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

function EditTask() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const initialTitle = searchParams.get("title") || "";
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState("");

  const updateTask = async () => {
    if (!title.trim()) {
      setError("Task title cannot be empty");
      return;
    }

    setError("");

    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Edit Task</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            onClick={updateTask}
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={!title.trim()}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(EditTask);
