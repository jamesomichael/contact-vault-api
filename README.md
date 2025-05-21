# Contact Vault API

![Coverage](https://img.shields.io/codecov/c/github/jamesomichael/contact-vault-api)
[![Docs](https://img.shields.io/badge/docs-openapi-blue.svg)](https://jamesomichael.github.io/contact-vault-api/)

Manage your personal and business contacts with _Contact Vault_, a RESTful API built with **Node.js**, **Express**, and **TypeScript**.

### **Features**

-   🔐 JWT-based authentication
-   📇 Create, read, update, and delete contacts
-   🏷️ Categorise contacts as personal or business
-   ✅ Strict schema validation with Joi
-   🧪 Full test coverage across controllers and models
-   📘 OpenAPI 3.0-compliant API [documentation](https://jamesomichael.github.io/contact-vault-api/)

### **Tech Stack**

-   **Node.js**
-   **Express**
-   **TypeScript**
-   **MongoDB & Mongoose**
-   **Celebrate (Joi)**
-   **JWT**
-   **bcryptjs**
-   **Jest**

## **Local Development**

### **Prerequisites**

In order to run the server locally, you will need an active [MongoDB database cluster](https://cloud.mongodb.com/).

### **Steps**

1. Install the required dependencies:

```bash
npm install
```

2. Create a `.env` file with the following environment variables:

```ini
NODE_ENV=development
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

3. Run the server:

```bash
npm run dev
```
