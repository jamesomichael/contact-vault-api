import mongoose from 'mongoose';

import Contact from '../db/models/Contact';

import {
	ContactDocument,
	ContactDto,
	CreateContactDto,
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

export { isValidObjectId, createContact, getContacts };
