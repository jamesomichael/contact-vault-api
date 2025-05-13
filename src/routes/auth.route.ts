import express from 'express';
import { celebrate } from 'celebrate';
import asyncHandler from 'express-async-handler';

import {
	register as registerSchema,
	login as loginSchema,
} from '../schemas/auth.schema';

import authController from '../controllers/auth.controller';

const router = express.Router();

router.post(
	'/register',
	celebrate(registerSchema),
	asyncHandler(authController.register)
);

router.post(
	'/login',
	celebrate(loginSchema),
	asyncHandler(authController.login)
);

export default router;
