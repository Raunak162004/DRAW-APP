import express, { Router } from "express";
const router: Router = express.Router();

import { createRoom, login, signup } from "../controllers/auth.controller";

router.post("/login", login);

router.post("/register", signup);

router.post("/create-room", createRoom);

export default router;