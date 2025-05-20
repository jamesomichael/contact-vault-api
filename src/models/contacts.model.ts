import mongoose from 'mongoose';
import dayjs from 'dayjs';

import Contact from '../db/models/Contact';

import {
	ContactDocument,
	ContactDto,
	CreateContactDto,
	UpdateContactDto,
} from '../types/contact';

const isValidObjectId = (id: string): boolean => mongoose.isValidObjectId(id);

const formatContactData = ({
	id,
	name,
	email,
	phoneNumber,
	type,
	createdAt,
	updatedAt,
}: ContactDocument): ContactDto => ({
	id,
	name,
	createdAt,
	type,
	...(email && { email }),
	...(phoneNumber && { phoneNumber }),
	...(updatedAt && { updatedAt }),
});

const createContact = async (
	{ name, email, phoneNumber, type }: CreateContactDto,
	userId: string
): Promise<ContactDto> => {
	console.log(
		`[contactsModel: createContact] Creating contact for user ${userId}...`
	);
	const contactDocument = new Contact({
		name,
		email,
		phoneNumber,
		type,
		userId,
	});
	await contactDocument.save();
	console.log('[contactsModel: createContact] Contact created.');
	const contact = formatContactData(contactDocument);
	return contact;
};

const getContacts = async (userId: string): Promise<ContactDto[]> => {
	console.log(
		`[contactsModel: getContacts] Fetching all contacts for user ${userId}...`
	);
	const contactDocuments = await Contact.find({ userId }).sort({ date: -1 });
	const contacts = contactDocuments.map((contact) =>
		formatContactData(contact)
	);
	console.log('[contactsModel: getContacts] Contacts retrieved.');
	return contacts;
};

const getContactById = async (
	id: string,
	userId: string
): Promise<ContactDto> => {
	console.log(
		`[contactsModel: getContactById] Fetching contact ${id} for user ${userId}...`
	);
	const contactDocument = await Contact.findOne({ _id: id, userId });
	if (!contactDocument) {
		console.error(
			'[contactsModel: getContactById] Contact does not exist.'
		);
		throw new Error('Contact not found.');
	}
	const contact = formatContactData(contactDocument);
	console.error('[contactsModel: getContactById] Contact retrieved.');
	return contact;
};

const updateContact = async (
	updates: UpdateContactDto,
	id: string,
	userId: string
): Promise<ContactDto> => {
	console.log(
		`[contactsModel: updateContact] Updating contact ${id} for user ${userId}...`
	);
	const contactDocument = await Contact.findOneAndUpdate(
		{ _id: id, userId },
		{ ...updates, updatedAt: dayjs().valueOf() },
		{ new: true }
	);
	if (!contactDocument) {
		console.error('[contactsModel: updateContact] Contact does not exist.');
		throw new Error('Contact not found.');
	}
	const contact = formatContactData(contactDocument);
	console.error('[contactsModel: updateContact] Contact updated.');
	return contact;
};

const deleteContact = async (id: string, userId: string): Promise<boolean> => {
	console.log(
		`[contactsModel: deleteContact] Deleting contact ${id} for user ${userId}...`
	);
	const contactDocument = await Contact.findOneAndDelete({ _id: id, userId });
	if (!contactDocument) {
		console.error('[contactsModel: deleteContact] Contact does not exist.');
		throw new Error('Contact not found.');
	}
	console.error('[contactsModel: deleteContact] Contact deleted.');
	return true;
};

export {
	isValidObjectId,
	createContact,
	getContacts,
	getContactById,
	updateContact,
	deleteContact,
};
