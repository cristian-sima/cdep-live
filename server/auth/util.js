// @flow

import type { AccountCategory } from "../types";


type GetMarcaArgTypes = {
  Position1?: string;
  Position2?: string;
  Position3?: string;
}

type DataType = {| nume : string; prenume: string; marca: string; grup: string; vot: boolean; |};

type PrepareUserType = (data : DataType, temporaryPassword : string) => {|
  name: string;
  marca: number;
  group: string;
  temporaryPassword: string;
  requireChange: boolean;
  canVote: boolean;
  category: AccountCategory;
|}

type ErrorType = (error? : Error) => any;

type GetSpecialAccounts = (callback : (specialAccounts : Array<*>) => any, error : ErrorType) => any;

import bcrypt from "bcrypt";

import { marcaOperator, marcaAdministrator, marcaContPublic, contParlamentar } from "../utility";

export const getMarca = ({ Position1, Position2, Position3 } : GetMarcaArgTypes) => (
  Number(`${Position1 || " "}${Position2 || " "}${Position3 || " "}`)
);

export const generateTemporaryPassword = () => {
  const
    min = 1000,
    max = 9999,
    raw = Math.floor(Math.random() * (max - min + 1)) + min;

  return String(raw);
};

export const prepareUser : PrepareUserType = (data, temporaryPassword) => {
  const { nume, prenume, marca, grup, vot } = data;

  return {
    name     : `${nume} ${prenume}`,
    marca    : Number(marca),
    group    : grup,
    temporaryPassword,
    canVote  : vot,
    category : contParlamentar,

    requireChange: true,
  };
};

export const getSpecialAccounts : GetSpecialAccounts = (callback, error) => (
  bcrypt.hash("parola", 10, (errHasing, hash) => {
    if (errHasing) {
      return error(errHasing);
    }

    return callback([
      {
        marca             : marcaOperator,
        name              : "Operator",
        temporaryPassword : "1234",
        requireChange     : true,
      },
      {
        marca             : marcaAdministrator,
        name              : "Administrator",
        temporaryPassword : "1234",
        requireChange     : true,
      },
      {
        marca             : marcaContPublic,
        name              : "Public",
        temporaryPassword : "",
        requireChange     : false,
        password          : hash,
      },
    ]);
  })
);
