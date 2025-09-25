import { email, z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string(),
    password: z.string().min(8),
    email: z.email(),
});

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(5).max(20),
    adminId: z.string()
})