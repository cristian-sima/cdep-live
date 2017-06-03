// @flow

import type { Option } from "types";

type OptiuneComisiePropTypes = {
  optiune : Option;
}

type ThumbsIconPropType = {
  optiune : Option;
}

type OptiunePropTypes = {
  optiune : Option;
  content: any;
  inline?:bool;
}

import React from "react";
import classNames from "classnames";

import { optiunePro, optiuneContra, optiuneAbtinere } from "utility";

const ThumbsIcon = ({ optiune } : ThumbsIconPropType) => {

  if (optiune !== optiuneContra && optiune !== optiunePro) {
    return (
      null
    );
  }

  const getType = () => {
    switch (optiune) {
      case optiunePro:
        return "up";
      case optiuneContra:
        return "down";

      default:
        return "";
    }
  };

  return (
    <i className={`fa fa-thumbs-${getType()}`} />
  );
};

export const Optiune = ({ optiune, content, inline } : OptiunePropTypes) => {
  const getText = () => {
    switch (optiune) {
      case optiunePro:
        return "text-success";
      case optiuneContra:
        return "text-danger";
      case optiuneAbtinere:
        return "text-warning";
      default:
        return "";
    }
  };

  return (
    <div className={classNames(`${getText()} no-wrap`, {
      "d-inline": inline,
    })}>
      <ThumbsIcon optiune={optiune} />
      {" "}
      {content}
    </div>
  );
};

export const OptiuneComisie = ({ optiune } : OptiuneComisiePropTypes) => (
  <Optiune
    content={"Comisie"}
    optiune={optiune}
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
