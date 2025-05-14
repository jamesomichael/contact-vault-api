import { RequestHandler } from 'express';

import { AuthorisedRequest } from '../types/auth';

import Contact from '../db/models/Contact';

const createContact: RequestHandler = async (req, res): Promise<void> => {
	const { name, email, phoneNumber, type } = req.body;
	const userId = (req as AuthorisedRequest).user.id;
	try {
		console.log(
			`[contactsController: createContact] Creating contact for user ${userId}...`
		);
		const contact = new Contact({
			name,
			email,
			phoneNumber,
			type,
			userId,
		});
		await contact.save();
		console.log('[contactsController: createContact] Contact created.');
		res.status(200).json({
			id: contact.id,
			name,
			email,
			phoneNumber,
			type,
		});
	} catch (error: any) {
		console.error(`[contactsController: createContact] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export default { createContact };
