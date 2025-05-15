import express from 'express';
import { celebrate } from 'celebrate';
import asyncHandler from 'express-async-handler';

import {
	createContact as createSchema,
	getContactById as getOneSchema,
	updateContact as updateSchema,
	deleteContact as deleteSchema,
} from '../schemas/contacts.schema';

import contactsController from '../controllers/contacts.controller';
import { auth as authMiddleware } from '../middleware';

const router = express.Router();

router.post(
	'/',
	[authMiddleware, celebrate(createSchema)],
	asyncHandler(contactsController.createContact)
);

router.get('/', authMiddleware, asyncHandler(contactsController.fetchContacts));

router.get(
	'/:id',
	[authMiddleware, celebrate(getOneSchema)],
	asyncHandler(contactsController.fetchContactById)
);

router.patch(
	'/:id',
	[authMiddleware, celebrate(updateSchema)],
	asyncHandler(contactsController.updateContact)
);

router.delete(
	'/:id',
	[authMiddleware, celebrate(deleteSchema)],
	asyncHandler(contactsController.deleteContact)
);

export default router;
