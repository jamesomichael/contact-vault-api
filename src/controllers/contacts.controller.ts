import { RequestHandler } from 'express';

import { AuthorisedRequest } from '../types/auth';

import { isValidObjectId } from '../models/contacts.model';
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

const fetchContacts: RequestHandler = async (req, res): Promise<void> => {
	const userId = (req as AuthorisedRequest).user.id;
	try {
		console.log(
			`[contactsController: fetchContacts] Fetching all contacts for user ${userId}...`
		);
		const contacts = await Contact.find({ userId }).sort({ date: -1 });
		const formattedContacts = contacts.map(
			({ id, name, email, phoneNumber, type, date }) => ({
				id,
				name,
				email,
				phoneNumber,
				type,
				date,
			})
		);
		console.log('[contactsController: fetchContacts] Contacts retrieved.');
		res.status(200).json({ contacts: formattedContacts });
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

		if (!isValidObjectId(id)) {
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
			date: contact.date,
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

		if (!isValidObjectId(id)) {
			console.error(
				'[contactsController: updateContact] The contact ID is invalid.'
			);
			res.status(400).json({ message: 'Contact ID is invalid.' });
			return;
		}

		const contact = await Contact.findOneAndUpdate(
			{ _id: id, userId },
			updates,
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
			date: contact.date,
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

		if (!isValidObjectId(id)) {
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
