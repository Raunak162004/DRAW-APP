import {prisma } from '@repo/db/client';
import {CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/config"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { JWT_SECRET } from '@repo/backend-common/config'; 

export const login = async (req: Request, res: Response) => {
  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, password } = parsed.data; // parsed will look like { success: true, data: { email, password } }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 3600000, // 1 hour
  });

  return res.json({ message: "Login successful", token });
};




export const signup = async (req: Request, res: Response) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return res.json({ message: "Signup successful", newUser });
}




export const createRoom = async (req: Request, res: Response) => {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { name } = parsed.data;

  const newRoom = await prisma.room.create({
    data: { slug: name, adminId: parsed.data.adminId },
  });

  return res.json({ message: "Room created successfully", newRoom });
};