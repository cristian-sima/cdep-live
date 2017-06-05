const delimitator = "|";

export const
  marcaOperator = 0,
  marcaAdministrator = 999,

  optiuneNecunoscuta = -1,
  optiuneContra = 0,
  optiunePro = 1,
  optiuneAbtinere = 2;

export const hasGroupVoted = ({ publicVote, group }) => {
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

export const proceseazaGuvern = (raw : string) : ?number => {
  if (typeof raw === "undefined") {
    return raw;
  }

  switch (raw) {
    case "NEGATIV":
      return Number(optiuneContra);
    case "FAVORABIL":
      return Number(optiunePro);
    default:
      return optiuneNecunoscuta;
  }
};

export const proceseazaComisie = (raw : string) : ?number => {
  if (typeof raw === "undefined") {
    return raw;
  }

  switch (raw) {
    case "RESPINGERE":
      return Number(optiuneContra);
    case "ADOPTARE":
      return Number(optiunePro);
    default:
      return optiuneNecunoscuta;
  }
};

export const prepareItem = (rawItem) => {
  const
  obtineAn = (raw : string) : ?number => {

    const
      parts = String(raw).split("."),
      nrOfElements = 3;

    if (parts.length === nrOfElements) {
      const value = Number(parts[2]);

      if (isNaN(value) || value === "") {
        return optiuneNecunoscuta;
      }

      return value;
    }

    return optiuneNecunoscuta;
  };

  const { titlu, proiect, pozitie, guvern, comisia : comisie } = rawItem;

  const newItem = {
    position          : Number(pozitie),
    title             : String(titlu).trim(),
    project           : String(proiect).trim(),
    cameraDecizionala : String(rawItem["camera decizionala"]) === "DA",
  };

  // daca avem pozitia guvernului
  if (typeof guvern !== "undefined") {
    const optiune = proceseazaGuvern(guvern);

    if (optiune !== optiuneNecunoscuta) {
      newItem.guvern = optiune;
    }

    // daca avem data guvernului
    if (typeof guvern !== "undefined") {
      const
        dataGuvern = rawItem["data guvern"],
        an = obtineAn(dataGuvern);

      if (an !== optiuneNecunoscuta) {
        newItem.anGuvern = an;
      }
    }
  }

  // daca avem pozitia comisiei
  if (typeof comisie !== "undefined") {
    const optiune = proceseazaComisie(comisie);

    if (optiune !== optiuneNecunoscuta) {
      newItem.comisie = optiune;
    }
  }

  return newItem;
};
