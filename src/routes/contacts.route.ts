import express from 'express';
import { celebrate } from 'celebrate';
import asyncHandler from 'express-async-handler';

import { create as createSchema } from '../schemas/contacts.schema';

import contactsController from '../controllers/contacts.controller';
import { auth as authMiddleware } from '../middleware';

const router = express.Router();

router.post(
	'/',
	[authMiddleware, celebrate(createSchema)],
	asyncHandler(contactsController.createContact)
);

export default router;
