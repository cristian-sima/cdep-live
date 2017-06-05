// @flow

export type User = {
  _id: string;
  group: string;
  marca: number;
  name: string;
  password: string;
}

export type Item = {
  _id: string;
}

export type RawItem = {
  titlu: string;
  proiect: string;
  pozitie: string;
  guvern?: string;
  comisia?: string;
  descriere?: string;
  "camera decizionala"?: string;
  "data guvern"?: string;
}

export type ExpressServer = any;

type Collection = {
  findOne: (query : any, callback : (error?: Error, data : any) => any) => void;
  find: (query: any) => {
    toArray: (callback : (error?: Error, data : any) => void) => void;
  };
  updateMany: (where : any, set : any, callback : (error?: Error) => any) => void;
  insertMany: (list : Array<*>, callback : (error?: Error, result : { ops : any }) => any) => void;
  remove: (callback : (error?: Error) => any) => void;
  update: (where : any, set : any, callback : (error?: Error) => any) => void;
}

export type Database = {
  collection: (name : string) => Collection;
}

type Session = {
  reset: () => void;
  marca: number;
  user: User;
};

type Emiter = (name : string, data? : any) => void;
type Emit = { emit: Emiter };

export type Request = {
  body: any;
  db: any;
  session: Session;
  user: User;
};

export type Response = {
  json: (data : any) => void;
  status: (status : number) => Response;
}

export type Next = (error?: Error) => any;

export type Socket = {
  request: {
    session: Session;
    user: User;
  };
  emit: Emiter;
  broadcast: Emit;
  to: (group: string) => Emit;
}

type OptiuneNecunoscuta = -1;
type OptiuneContra = 0;
type OptiunePro = 1;
type OptiuneAbtinere = 2;

export type OptiuneType = OptiunePro | OptiuneContra | OptiuneAbtinere | OptiuneNecunoscuta;

export type VoteItemData = {
  optiune: OptiuneType;
  isPublicVote: bool;
  id: string;
}
