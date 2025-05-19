import { RequestHandler } from 'express';

import { AuthorisedRequest } from '../types/auth';

import * as contactsModel from '../models/contacts.model';

const createContact: RequestHandler = async (req, res): Promise<void> => {
	const { name, email, phoneNumber, type } = req.body;
	const userId = (req as AuthorisedRequest).user.id;
	try {
		const contact = await contactsModel.createContact(
			{ name, email, phoneNumber, type },
			userId
		);
		res.status(200).json(contact);
	} catch (error: any) {
		console.error(`[contactsController: createContact] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const fetchContacts: RequestHandler = async (req, res): Promise<void> => {
	const userId = (req as AuthorisedRequest).user.id;
	try {
		const contacts = await contactsModel.getContacts(userId);
		res.status(200).json({ contacts });
	} catch (error: any) {
		console.error(`[contactsController: fetchContacts] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const fetchContactById: RequestHandler = async (req, res): Promise<void> => {
	const { id } = req.params;
	const userId = (req as AuthorisedRequest).user.id;
	try {
		if (!contactsModel.isValidObjectId(id)) {
			console.error(
				'[contactsController: fetchContactById] The contact ID is invalid.'
			);
			res.status(400).json({ message: 'Contact ID is invalid.' });
			return;
		}

		const contact = await contactsModel.getContactById(id, userId);
		res.status(200).json(contact);
	} catch (error: any) {
		if (/Contact not found/.test(error.message)) {
			res.status(404).json({ message: 'Contact not found.' });
			return;
		}
		console.error(
			`[contactsController: fetchContactById] ${error.message}`
		);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const updateContact: RequestHandler = async (req, res): Promise<void> => {
	const { id } = req.params;
	const userId = (req as AuthorisedRequest).user.id;
	const updates = req.body;
	try {
		if (!contactsModel.isValidObjectId(id)) {
			console.error(
				'[contactsController: updateContact] The contact ID is invalid.'
			);
			res.status(400).json({ message: 'Contact ID is invalid.' });
			return;
		}
		const contact = await contactsModel.updateContact(updates, id, userId);
		res.status(200).json(contact);
	} catch (error: any) {
		if (/Contact not found/.test(error.message)) {
			res.status(404).json({ message: 'Contact not found.' });
			return;
		}
		console.error(`[contactsController: updateContact] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const deleteContact: RequestHandler = async (req, res): Promise<void> => {
	const { id } = req.params;
	const userId = (req as AuthorisedRequest).user.id;
	try {
		if (!contactsModel.isValidObjectId(id)) {
			console.error(
				'[contactsController: deleteContact] The contact ID is invalid.'
			);
			res.status(400).json({ message: 'Contact ID is invalid.' });
			return;
		}
		await contactsModel.deleteContact(id, userId);
		res.status(204).end();
	} catch (error: any) {
		if (/Contact not found/.test(error.message)) {
			res.status(404).json({ message: 'Contact not found.' });
			return;
		}
		console.error(`[contactsController: deleteContact] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

export default {
	createContact,
	fetchContacts,
	fetchContactById,
	updateContact,
	deleteContact,
};
