// @flow

import * as Immutable from "immutable";

export * from "./request";
export * from "./validation";

const delimitator = "|";

export const
  noError = "",

  marcaAdministrator = 999,
  marcaOperator = 0,

  optiuneNecunoscuta = -1,
  optiuneContra = 0,
  optiunePro = 1,
  optiuneAbtinere = 2;

export const getSortedItemList = (data) => (
  data.
  toList().
  sortBy((item) => item.get("position")).
  reduce((previous, current) => previous.push(current.get("_id")), Immutable.List())
);

export const encode = (parts : Array<string>) => {

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
