# NestJS Authentication and Wallet System

This is a NestJS application that implements an authentication system with a wallet system. The application uses a PostgreSQL database to store user information and wallet transactions.

## Technologies used

- NestJS
- TypeORM
- PostgreSQL

## Getting started

1. Clone the repository
2. Install dependencies with `yarn install`
3. Create a `.env` file in the root directory with the following variables:
   DB_HOST_DEV='<database host>'
   DB_PORT='<database port>'
   DB_USERNAME='<database username>'
   DB_PASSWORD='<database password>'
   DB_NAME='<database name>'
   JWT_SECRETE='<secrete key for JWT>'
   HASH_SALT='<number of salrounds for bcrypt>'

4. Start the server with `npm run start:dev`

## Endpoints

The following endpoints are available:

- `POST /api/auth/signup`: Create a new user.
- `POST /api/auth/login`: Authenticate a user and generate a JWT token.
- `GET /api/users/hello`: Get user details without password.
- `PUT /api/users/update_user`: Update user's address.
- `GET /api/users/all`: Get all users (admin only).
- `POST /api/wallet/fund`: Fund user's wallet.
- `POST /api/wallet/debit`: Debit user's wallet.
- `GET /api/wallet/balance`: Get user's wallet balance.
- `GET /api/transaction/user`: Get user's wallet transactions.
- `GET /api/transaction/all-transactions`: Get all transactions (admin only).
- `/api/transaction/generate-transaction-ref`: Generate transactionREf.

## Database

The application uses a PostgreSQL database to store user information and wallet transactions. The User, wallet and Transaction entities are defined in the `src/`directory corresponding with their names.
