import dotenv from 'dotenv';
import express from 'express';
import { errors } from 'celebrate';

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV !== 'production') {
	dotenv.config();
}

const PORT = process.env.PORT || 3000;

import authRoutes from './routes/auth.route';
import contactsRoutes from './routes/contacts.route';
import database from './db';

database.connect();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);

app.use(errors());

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
