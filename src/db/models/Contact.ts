import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
	phoneNumber: {
		type: String,
	},
	type: {
		type: String,
		default: 'personal',
	},
	createdAt: {
		type: Number,
		default: Date.now,
	},
	updatedAt: {
		type: Number,
		default: Date.now,
	},
});

export default mongoose.model('contact', ContactSchema);
