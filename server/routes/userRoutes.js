import express from "express";
import { getUserbyI, getUserResumes, loginUser, registerUser } from "../config/controllers/userController.js";
import protect from "../middleware/auth.js";
const userRouter=express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);

userRouter.get('/data',protect,getUserbyI);
userRouter.get('/resumes',protect,getUserResumes);


export default userRouter;

