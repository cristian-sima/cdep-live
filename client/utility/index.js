// @flow

export * from "./request";
export * from "./validation";

export const
  marcaAdministrator = 999,
  marcaOperator = 0,
  optiuneContra = 0,
  optiuneNecunoscuta = -1,
  optiunePro = 1,
  optiuneAbtinere = 2,
  optiuneLiberaAlegere = 3;

export const processPublicVote = ({ publicVote, group, isPublicVote }) => {
  const current = publicVote ? publicVote : "";

  if (isPublicVote) {
    const parts = String(current).split("|");

    if (parts.includes(group)) {
      return current;
    }

    parts.push(group);

    return parts.join("|");
  }

  return publicVote;
};
