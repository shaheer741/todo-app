"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import withAuth from "@/components/withAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, LogOut } from "lucide-react";

function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask, userId: session?.user?.id }),
    });

    if (res.ok) {
      const newTaskData = await res.json();
      setTasks((prevTasks) => [newTaskData, ...prevTasks]); //  Insert new task at the top
      setNewTask("");
    }
  };

  const deleteTask = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });

    if (res.ok) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); //  Remove task instantly
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 w-full">
      <Card className="w-full max-w-md flex flex-col h-[550px] shadow-lg border">
        {/*  Header with Welcome Message & Logout Button */}
        <CardHeader className="sticky top-0 bg-white z-10 flex flex-row justify-between items-center p-4 border-b">
          <div>
            <CardTitle className="text-2xl">Todo Dashboard</CardTitle>
            <p className="text-sm text-gray-600">
              Welcome, {session?.user?.name || session?.user?.email} 👋
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition"
          >
            Logout
            <LogOut className="w-5 h-5" />
          </Button>
        </CardHeader>

        {/*  Input & Add Button  */}
        <CardContent className="sticky top-12 bg-white z-10 py-2 border-b">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="New Todo"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={addTask}
              className="bg-green-500 hover:bg-green-600"
            >
              Add
            </Button>
          </div>
        </CardContent>

        {/*  Scrollable Task List */}
        <ScrollArea className="flex-1 overflow-y-auto p-2">
          <CardContent className="flex flex-col gap-2">
            {tasks.length === 0 && (
              <p className="text-center text-gray-500">No tasks yet</p>
            )}
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center p-3 border rounded shadow-sm transition hover:bg-gray-100"
              >
                <span className="font-medium">{task.title}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(
                        `/edit/${task.id}?title=${encodeURIComponent(
                          task.title
                        )}`
                      )
                    }
                  >
                    <Pencil className="w-5 h-5 text-blue-500 hover:text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}

export default withAuth(Dashboard);
