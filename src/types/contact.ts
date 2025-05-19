import { Document } from 'mongoose';

export type ContactType = 'personal' | 'business';

export interface CreateContactDto {
	name: string;
	email: string;
	phoneNumber: string;
	type: ContactType;
}

export interface ContactDocument extends Document {
	name: string;
	email?: string | null | undefined;
	phoneNumber?: string | null | undefined;
	type?: ContactType;
	createdAt: number;
	updatedAt?: number | null | undefined;
}

export interface ContactDto {
	id: string;
	name: string;
	email?: string | null | undefined;
	phoneNumber?: string | null | undefined;
	type?: ContactType;
	createdAt: number;
	updatedAt?: number | null | undefined;
}
