# live
Live content and suggestions for laws

# Installing the app

1. Install NodeJS
2. Run `npm install`
3. Install database
  1. `npm install mongodb`
  2. Install the database
  - Download the right MongoDB version from https://www.mongodb.com/download-center
  - Create a database directory (in this case under `/data`).
  - Install and start a `mongod` process: `mongod --dbpath=./data`

# Development
1. Run `mongod --dbpath=./data`
2. Run `npm3 run dev:client:start`
3. Run `npm3 run dev:server:start`

# Production environment

1. Run `mongod --dbpath=./data`
2. Run `npm run dist:client:build`
3. Run `npm run dist:server:build`
4. Run `npm run dist:serve`
5. Enjoy a cup of coffee
