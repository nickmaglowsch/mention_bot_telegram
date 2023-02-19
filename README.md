# mentions-bot

Telegram bot that creates aliases for bulk mentioning people inside a group.

## Installation

1. Clone the repository: `git clone https://github.com/username/mentions-bot.git`
2. Install dependencies: `npm install`

## Usage

To start the bot, run the following command:

``npm start``

This will start the bot with the compiled code in the `dist/` directory.

To start the bot in development mode, run:

``npm run start:dev``


This will start the bot using `ts-node`, which compiles TypeScript on the fly.

## Configuration

The bot uses `dotenv` to load environment variables. Create a `.env` file in the root directory of the project and add the following variables:

```
TOKEN=<your Telegram bot token>
DATABASE_URL=<your MongoDB connection URI>
```

## Scripts

- `npm test`: Run tests using Jest with the `--silent` option.
- `npm run test:verbose`: Run tests using Jest with the `--verbose` option.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm start`: Start the bot with the compiled code in the `dist/` directory.
- `npm run start:dev`: Start the bot using `ts-node`.
- `npm run lint`: Run ESLint on the `src/` directory.
- `npm run lint:fix`: Run ESLint with the `--fix` option on the `src/` directory.
- `npm run test:coverage`: Run tests with coverage report.
- `npm run test:coverage:json`: Run tests with coverage report in JSON format.

## Hooks

The project uses `husky` to set up Git hooks. The `pre-push` hook runs the tests and checks that the code meets the minimum coverage threshold specified in the `package.json` file.

## Dependencies

The project uses the following dependencies:

- `dotenv`: Loads environment variables from a `.env` file.
- `lodash`: Provides utility functions for arrays, numbers, objects, and strings.
- `mongoose`: A MongoDB object modeling tool.
- `node-telegram-bot-api`: A Telegram Bot API wrapper for Node.js.
- `pino`: A logger for Node.js.
- `@types/jest`: TypeScript type definitions for Jest.
- `@types/lodash`: TypeScript type definitions for Lodash.
- `@types/mongoose`: TypeScript type definitions for Mongoose.
- `@types/node`: TypeScript type definitions for Node.js.
- `@types/node-telegram-bot-api`: TypeScript type definitions for node-telegram-bot-api.
- `@typescript-eslint/eslint-plugin`: An ESLint plugin for TypeScript.
- `eslint`: A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.
- `husky`: Git hooks made easy.
- `jest`: A JavaScript testing framework.
- `jest-cli`: Command line interface for running Jest.
- `ts-jest`: TypeScript preprocessor for Jest.
- `ts-node`: TypeScript execution and REPL for Node.js.
- `typescript`: A typed superset of JavaScript that compiles to plain JavaScript.

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.
