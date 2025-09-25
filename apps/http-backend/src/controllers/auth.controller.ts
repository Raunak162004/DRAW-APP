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

  const { username, password } = parsed.data; // parsed will look like { success: true, data: { username, password } }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  

  return res.json({ message: "Login successful", token });
};




export const signup = ()=>{
  console.log("Login");

  return;
}
export const room = ()=>{
  console.log("Login");

  return;
}