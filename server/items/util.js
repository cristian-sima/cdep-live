// @flow
/* eslint-disable no-undefined */

import type { RawItem } from "../types";

type ProcessPublicVoteTypes = {
 publicVote: string;
 group: string;
 isPublicVote: bool;
}

type Data = {
  position: number;
  title: string;
  project: string;
  cameraDecizionala: boolean;
  description?: string;
  guvern?: number;
  anGuvern?: number;
  comisie?: number;
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
    return null;
  }

  switch (raw) {
    case "NEGATIV":
      return Number(optiuneContra);
    case "FAVORABIL":
      return Number(optiunePro);
    default:
      return null;
  }
};

export const getAnGuvern = (guvern?: string, year? : string) : ?number => {
  if (typeof guvern === "undefined" || typeof year === "undefined") {
    return null;
  }

  const
    parts = String(year).split("."),
    nrOfElements = 3;

  if (parts.length === nrOfElements) {
    const value = Number(parts[2]);

    if (isNaN(value) || parts[2] === "") {
      return null;
    }

    return value;
  }

  return null;
};

export const getComisie = (raw? : string) : ?number => {
  if (typeof raw === "undefined") {
    return null;
  }

  switch (raw) {
    case "RESPINGERE":
      return Number(optiuneContra);
    case "ADOPTARE":
      return Number(optiunePro);
    default:
      return null;
  }
};

export const prepareItem = (rawItem : RawItem) : Data => {

  const { titlu, proiect, pozitie, descriere, guvern, comisia : comisie } = rawItem;

  const data : Data = {
    position          : Number(pozitie),
    title             : String(titlu).trim(),
    project           : String(proiect).trim(),
    cameraDecizionala : String(rawItem["camera decizionala"]) === "DA",
  };

  if (typeof descriere !== "undefined") {
    data.description = String(descriere);
  }

  const optiuneGuvern = getGuvern(guvern);

  if (optiuneGuvern !== null) {
    data.guvern = optiuneGuvern;

    const anGuvern = getAnGuvern(guvern, rawItem["data guvern"]);

    if (anGuvern !== null) {
      data.anGuvern = anGuvern;
    }
  }

  const optiuneComisie = getComisie(comisie);

  if (optiuneComisie !== null) {
    data.comisie = optiuneComisie;
  }

  return data;
};
