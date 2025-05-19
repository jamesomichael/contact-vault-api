import { RequestHandler } from 'express';
import dayjs from 'dayjs';

import { AuthorisedRequest } from '../types/auth';

import * as contactsModel from '../models/contacts.model';
import Contact from '../db/models/Contact';

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
		console.log(
			`[contactsController: fetchContactById] Fetching contact ${id} for user ${userId}...`
		);

		if (!contactsModel.isValidObjectId(id)) {
			console.error(
				'[contactsController: fetchContactById] The contact ID is invalid.'
			);
			res.status(400).json({ message: 'Contact ID is invalid.' });
			return;
		}

		const contact = await Contact.findOne({ _id: id, userId });

		if (!contact) {
			console.error(
				'[contactsController: fetchContactById] Contact does not exist.'
			);
			res.status(404).json({ message: 'Contact not found.' });
			return;
		}

		console.error(
			'[contactsController: fetchContactById] Contact retrieved.'
		);

		res.status(200).json({
			id: contact.id,
			name: contact.name,
			email: contact.email,
			phoneNumber: contact.phoneNumber,
			type: contact.type,
			createdAt: contact.createdAt,
			updatedAt: contact.updatedAt,
		});
	} catch (error: any) {
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
		console.log(
			`[contactsController: updateContact] Updating contact ${id} for user ${userId}...`
		);

		if (!contactsModel.isValidObjectId(id)) {
			console.error(
				'[contactsController: updateContact] The contact ID is invalid.'
			);
			res.status(400).json({ message: 'Contact ID is invalid.' });
			return;
		}

		const contact = await Contact.findOneAndUpdate(
			{ _id: id, userId },
			{ ...updates, updatedAt: dayjs().valueOf() },
			{ new: true }
		);

		if (!contact) {
			console.error(
				'[contactsController: updateContact] Contact does not exist.'
			);
			res.status(404).json({ message: 'Contact not found.' });
			return;
		}

		console.error('[contactsController: updateContact] Contact updated.');

		res.status(200).json({
			id: contact.id,
			name: contact.name,
			email: contact.email,
			phoneNumber: contact.phoneNumber,
			type: contact.type,
			createdAt: contact.createdAt,
			updatedAt: contact.updatedAt,
		});
	} catch (error: any) {
		console.error(`[contactsController: updateContact] ${error.message}`);
		res.status(500).json({ message: 'Something went wrong.' });
	}
};

const deleteContact: RequestHandler = async (req, res): Promise<void> => {
	const { id } = req.params;
	const userId = (req as AuthorisedRequest).user.id;
	try {
		console.log(
			`[contactsController: deleteContact] Deleting contact ${id} for user ${userId}...`
		);

		if (!contactsModel.isValidObjectId(id)) {
			console.error(
				'[contactsController: deleteContact] The contact ID is invalid.'
			);
			res.status(400).json({ message: 'Contact ID is invalid.' });
			return;
		}

		const contact = await Contact.findOneAndDelete({ _id: id, userId });

		if (!contact) {
			console.error(
				'[contactsController: deleteContact] Contact does not exist.'
			);
			res.status(404).json({ message: 'Contact not found.' });
			return;
		}

		console.error('[contactsController: deleteContact] Contact deleted.');
		res.status(204).end();
	} catch (error: any) {
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
