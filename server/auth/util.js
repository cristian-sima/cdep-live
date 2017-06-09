// @flow

type GetMarcaArgTypes = {
  Position1?: string;
  Position2?: string;
  Position3?: string;
}

type DataType = {| nume : string; prenume: string; marca: string; grup: string; |};

type PrepareUserType = (data : DataType, temporaryPassword : string) => {|
  name: string;
  marca: number;
  group: string;
  temporaryPassword: string;
  requireChange: boolean;
|}

type ErrorType = (error? : Error) => any;

type GetSpecialAccounts = (callback : (specialAccounts : Array<*>) => any, error : ErrorType) => any;

import bcrypt from "bcrypt";

import { marcaOperator, marcaAdministrator, marcaContPublic } from "../utility";

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

export const prepareUser : PrepareUserType = ({ nume, prenume, marca, grup }, temporaryPassword) => ({
  name  : `${nume} ${prenume}`,
  marca : Number(marca),
  group : grup,
  temporaryPassword,

  requireChange: true,
});

export const getSpecialAccounts : GetSpecialAccounts = (callback, error) => (
  bcrypt.hash("parola", 10, (errHasing, hash) => {
    if (errHasing) {
      return error(errHasing);
    }

    return callback([{
      marca             : marcaOperator,
      name              : "Operator",
      temporaryPassword : "1234",
      requireChange     : true,
    }, {
      marca             : marcaAdministrator,
      name              : "Administrator",
      temporaryPassword : "1234",
      requireChange     : true,
    }, {
      marca             : marcaContPublic,
      name              : "Public",
      temporaryPassword : "",
      requireChange     : false,
      password          : hash,
    }]);
  })
);
