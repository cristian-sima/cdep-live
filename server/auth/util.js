
import { marcaOperator, marcaAdministrator } from "../utility";

export const getMarca = ({ Position1, Position2, Position3 }) => (
  Number(`${Position1 || " "}${Position2 || " "}${Position3 || " "}`, 10)
);

export const generateTemporaryPassword = () => {
  const
    min = 1000,
    max = 9999,
    raw = Math.floor(Math.random() * (max - min + 1)) + min;

  return String(raw);
};

export const prepareUser = ({ nume, prenume, marca, grup }, temporaryPassword) => ({
  name  : `${nume} ${prenume}`,
  marca : Number(marca),
  group : grup,
  temporaryPassword,

  requireChange: true,
});

export const specialAccounts = [{
  marca             : marcaOperator,
  name              : "Operator",
  temporaryPassword : "1234",
  requireChange     : true,
}, {
  marca             : marcaAdministrator,
  name              : "Administrator",
  temporaryPassword : "1234",
  requireChange     : true,
}];
