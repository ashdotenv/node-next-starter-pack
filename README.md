# Node.js and Next.js Starter Pack

## Project Overview

This repository is a full-stack application built with Node.js, TypeScript, and Next.js. It consists of two main components:

1. **Client**: A Next.js application using React and Redux Toolkit for state management.
2. **Server**: A Node.js server using Express, with TypeScript for type safety.

## Client

The client is a Next.js application that leverages React for building user interfaces and Redux Toolkit for managing application state. It includes Tailwind CSS for styling.

### Key Features

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Redux Toolkit**: Simplifies state management with Redux.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

### Scripts

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for code quality issues.

## Server

The server is built with Node.js and Express, using TypeScript for type safety. It includes various middleware for handling requests, authentication, and more.

### Key Features

- **Express**: A minimal and flexible Node.js web application framework.
- **TypeScript**: Provides static typing for JavaScript.
- **Mongoose**: An ODM for MongoDB, used for database interactions.
- **JWT**: Used for authentication and authorization.

### Scripts

- `dev`: Starts the server in development mode using `ts-node-dev`.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ashdotenv/node-next-starter-pack
   cd node-next-starter-pack
   ```

2. **Install dependencies**:
   - For the client:
     ```bash
     cd client
     pnpm install
     ```

   - For the server:
     ```bash
     cd server
     pnpm install
     ```

3. **Environment Variables**:
   - Copy the `.env.example` file to `.env` in both the client and server directories and fill in the necessary environment variables.

4. **Running the Application**:
   - Start the client:
     ```bash
     cd client
     pnpm dev
     ```

   - Start the server:
     ```bash
     cd server
     pnpm dev
     ```

