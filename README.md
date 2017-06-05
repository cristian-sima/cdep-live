# live
Live content and suggestions for voting laws

# Distribution

## Just first time
- Install NodeJS
- Run `npm install --production --only=prod`
- Download the right MongoDB version from https://www.mongodb.com/download-center
- Create a folder `data`
- Create a file `./client/conf.json` which contains:
```
{
  "hostname": "localhost:3000"
}
```
`hostname` reflects the public address of the server

- Run `mongod --dbpath=./data`

## Everytime

- Run `npm run dist:client:build`
- Run `npm run dist:server:build`
- Run `npm run dist:serve`
- Enjoy a cup of coffee

# Development

1. Run `mongod --dbpath=./data`
2. Run `npm3 run dev:client:start`
3. Run `npm3 run dev:server:start`
