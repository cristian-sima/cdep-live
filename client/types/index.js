// @flow

type OptiuneNecunoscuta = -1;
type OptiuneContra = 0;
type OptiunePro = 1;
type OptiuneAbtinere = 2;

export type ErrorType = string;

export type OptiuneType = OptiunePro | OptiuneContra | OptiuneAbtinere | OptiuneNecunoscuta;

export type Resolve = (data : any) => void;
export type Reject = (arg : { error : string }) => void;

export type Response = {
  body: any;
};

export * from "./actions";
export * from "./modal";
export * from "./state";
