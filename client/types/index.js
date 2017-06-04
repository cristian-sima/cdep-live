// @flow

type OptiuneNecunoscuta = -1;
type OptiuneContra = 0;
type OptiunePro = 1;
type OptiuneAbtinere = 2;

export type ErrorType = string;

export type OptiuneType = OptiunePro | OptiuneContra | OptiuneAbtinere | OptiuneNecunoscuta;

export * from "./actions";
export * from "./modal";
export * from "./state";
