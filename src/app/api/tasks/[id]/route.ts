import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; 
  const task = await prisma.task.findUnique({ where: { id } });
  return NextResponse.json(task);
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params; 
  const { title } = await req.json();
  await prisma.task.update({ where: { id }, data: { title } });
  return NextResponse.json({ message: "Task updated" });
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params; 
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ message: "Task deleted" });
}
