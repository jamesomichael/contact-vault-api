import mongoose from 'mongoose';

const isValidObjectId = (id: string) => mongoose.isValidObjectId(id);

export { isValidObjectId };
