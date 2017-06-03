// @flow

export * from "./request";
export * from "./validation";

const delimitator = "|";

export const
  marcaAdministrator = 999,
  marcaOperator = 0,
  optiuneContra = 0,
  optiuneNecunoscuta = -1,
  optiunePro = 1,
  optiuneAbtinere = 2,
  optiuneLiberaAlegere = 3;

const encode = (parts : Array<string>) => {

  const raw = parts.join(delimitator);

  if (raw === "") {
    return null;
  }

  return raw;
};

export const processPublicVote = ({ publicVote, group, isPublicVote }) => {
  const parts = typeof publicVote === "string" ? publicVote.split(delimitator) : [];

  if (isPublicVote) {
    if (parts.includes(group)) {
      return publicVote;
    }

    parts.push(group);

    return encode(parts);
  }

  const withoutGroup = parts.filter((item) => item !== group);

  return encode(withoutGroup);
};
