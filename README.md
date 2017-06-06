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

- {Maybe} Run `npm run dist:stop`
- Run `npm run dist:automatic`
- Run `npm run dist:serve`
- Enjoy a cup of coffee

# Development

0. `cd D:/workspace/src/github.com/cristian-sima/live`
1. Run `mongod --dbpath=./data`
2. Run `npm3 run dev:client:start`
3. Run `npm3 run dev:server:start`
