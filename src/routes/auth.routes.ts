import express, { Router } from 'express';
import {registerUser, loginUser, passwordReset, logoutUser} from '../controllers/auth.controller.js'

const authRoutes:Router = express.Router();

authRoutes.post('/register', registerUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/password-reset', passwordReset);
authRoutes.post('/logout', logoutUser);

export default authRoutes;
