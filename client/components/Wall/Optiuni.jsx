// @flow

import type { Option } from "types";

type OptiuneComisiePropTypes = {
  optiune : Option;
}

type OptiunePropTypes = {
  optiune : Option;
  content: any;
}

import React from "react";

import { optiunePro } from "utility";

const Optiune = ({ optiune, content } : OptiunePropTypes) => {
  const
    thumbsType = optiune === optiunePro ? "up" : "down",
    textType = optiune === optiunePro ? "success" : "danger";

  return (
    <span className={`text-${textType}`}>
      <i className={`fa fa-thumbs-${thumbsType}`} />
      {" "}
      {content}
    </span>
  );
};

export const OptiuneComisie = ({ optiune } : OptiuneComisiePropTypes) => (
  <Optiune
    content={"Comisie"}
    optione={optiune}
  />
);

type OptiuneGuvernPropTypes = {
  optiune : Option;
  an?: number;
}

const getYear = (an) => {
  if (typeof an === "undefined") {
    return "";
  }

  return ` (${an})`;
};

export const OptiuneGuvern = ({ optiune, an } : OptiuneGuvernPropTypes) => (
  <Optiune
    content={`Guvern${getYear(an)}`}
    optiune={optiune}
  />
);
