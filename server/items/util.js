// @flow
/* eslint-disable no-undefined */

import type { RawItem } from "../types";

type ProcessPublicVoteTypes = {
 publicVote: string;
 group: string;
 isPublicVote: bool;
}

const delimitator = "|";

export const
  marcaOperator = 0,
  marcaAdministrator = 999,

  optiuneNecunoscuta = -1,
  optiuneContra = 0,
  optiunePro = 1,
  optiuneAbtinere = 2;

export const hasGroupVoted = ({ publicVote, group } : { publicVote : bool; group : string }) => {
  const parts = typeof publicVote === "string" ? publicVote.split(delimitator) : [];

  return parts.includes(group);
};

export const encode = (parts : Array<string>) => {

  const raw = parts.join(delimitator);

  if (raw === "") {
    return null;
  }

  return raw;
};

export const processPublicVote = ({ publicVote, group, isPublicVote } : ProcessPublicVoteTypes) => {
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

export const getGuvern = (raw? : string) : ?number => {
  if (typeof raw === "undefined") {
    return undefined;
  }

  switch (raw) {
    case "NEGATIV":
      return Number(optiuneContra);
    case "FAVORABIL":
      return Number(optiunePro);
    default:
      return undefined;
  }
};

export const getAnGuvern = (guvern?: string, year? : string) : ?number => {
  if (typeof guvern === "undefined" || typeof year === "undefined") {
    return undefined;
  }

  const
    parts = String(year).split("."),
    nrOfElements = 3;

  if (parts.length === nrOfElements) {
    const value = Number(parts[2]);

    if (isNaN(value) || parts[2] === "") {
      return undefined;
    }

    return value;
  }

  return undefined;
};

export const getComisie = (raw? : string) : ?number => {
  if (typeof raw === "undefined") {
    return undefined;
  }

  switch (raw) {
    case "RESPINGERE":
      return Number(optiuneContra);
    case "ADOPTARE":
      return Number(optiunePro);
    default:
      return undefined;
  }
};

export const prepareItem = (rawItem : RawItem) => {

  const { titlu, proiect, pozitie, guvern, comisia : comisie } = rawItem;

  return {
    position          : Number(pozitie),
    title             : String(titlu).trim(),
    project           : String(proiect).trim(),
    cameraDecizionala : String(rawItem["camera decizionala"]) === "DA",

    guvern   : getGuvern(guvern),
    anGuvern : getAnGuvern(guvern, rawItem["data guvern"]),
    comisie  : getComisie(comisie),
  };
};
