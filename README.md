# Wallet System API Documentation

Welcome to the Wallet System API documentation. This API facilitates the management of user wallets and transactions using Paystack integration. Below, you will find information on setting up, running, and testing the API.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Starting the Server](#starting-the-server)
  - [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

# Prerequisites

- Nestjs
- Express
- TypeScript
- Paystack API
- Prisma
- PostgreSQL database

# Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IgnatiusFrancis/WalletSystem.git
   cd WalletSystem

   # Install dependencies:
   npm install
   ```

# Configuration

Create a .env file in the root directory and configure the following environment variables:

```env
PAYSTACK_API_KEY=your_paystack_api_key
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
```

# Usage

## Starting the Server

To start the API server, run the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The API will be accessible at http://localhost:3000.

## API Endpoints

### Sign Up

- **URL**: /auth/signup
- **Method**: POST
- **Request Body**: `{ "email": "user@example.com", "password": "your_password" }`
- **Response**: Detailed response information is available in the [API Documentation](https://documenter.getpostman.com/view/12345678/your-api-documentation-url)

### Sign In

- **URL**: /auth/signin
- **Method**: POST
- **Request Body**: `{ "email": "user@example.com", "password": "your_password" }`
- **Response**: Detailed response information is available in the [API Documentation](https://documenter.getpostman.com/view/12345678/your-api-documentation-url)

### Create Wallet

- **URL**: /wallet/create
- **Method**: POST
- **Request Body**: `{ "currency": "NGN", "name": "James" }`
- **Response**: Detailed response information is available in the [API Documentation](https://documenter.getpostman.com/view/12345678/your-api-documentation-url)

### Fund Wallet

- **URL**: /wallet/fund
- **Method**: POST
- **Request Body**: `{ "walletId": "your_wallet_id", "amount": "500" }`
- **Response**: Detailed response information is available in the [API Documentation](https://documenter.getpostman.com/view/12345678/your-api-documentation-url)

### Transfer

- **URL**: /transfer
- **Method**: POST
- **Request Body**: `{ "senderWalletId": "sender_wallet_id", "receiverWalletId": "receiver_wallet_id", "amount": "300" }`
- **Response**: Detailed response information is available in the [API Documentation](https://documenter.getpostman.com/view/12345678/your-api-documentation-url)

...

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

...

```bash

```

## Contributing

...

## License

...

## Contact

...

Feel free to explore the API and refer to the [API Documentation](https://documenter.getpostman.com/view/12345678/your-api-documentation-url) for detailed information on each endpoint and their functionalities.
