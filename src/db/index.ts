import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI!;

const connect = async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('MongoDB Connected.');
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		process.exit(1);
	}
};

export default { connect };
