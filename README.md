# live
Live content and suggestions for voting laws


"list": "http://www.cdep.ro/pls/caseta/json_internship_vfinal?dat="

# Distribution

## Just first time
- Install NodeJS
- Run `npm install --production --only=prod`
- Download the right MongoDB version from https://www.mongodb.com/download-center
- Create a folder `data`
- Create a file `./client-conf.json` which contains:
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


# Scheme preluare date

## Ordinea de zi

```js
{
  "lista_de_vot": [
    {
      "pozitie" : string,
      "proiect" : string,
      "titlu": string,
      "descriere"?: string,
      "camera decizionala"?: "DA",
      "comisia"?: "RESPINGERE" | "ADOPTARE",
      "guvern"?: "NEGATIV" | "FAVORABIL",
      "data guvern"?: string:{zz.ll.anul}
      "idx"?: string,                       // id-ul proiectului pe cdep.ro
      "urgenta"?: boolean,                  // true daca este procedura de urgenta
      "organica"?: boolean,                 // true daca este lege organica,
    }
  ]  
}
```

## Lista utilizatori

```js
{
  "camera": {
    "legislatura": string, // ex. "2016"
    "deputati": [
      {
        "nume": string,
        "prenume": string,
        "marca": string,
        "grup": string
      },
    ]
  }
}
```
