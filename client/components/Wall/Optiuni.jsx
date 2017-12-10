// @flow

import type { OptiuneType } from "types";

type OptiuneComisiePropTypes = {
  optiune : OptiuneType;
}

type ThumbsIconPropType = {
  optiune : OptiuneType;
}

type OptiunePropTypes = {
  optiune : OptiuneType;
  content: any;
  inline?:bool;
}

import React from "react";
import classNames from "classnames";

import { optiunePro, optiuneContra, optiuneAbtinere } from "utility";

const ThumbsIcon = ({ optiune } : ThumbsIconPropType) => {

  switch (optiune) {
    case optiunePro:
      return (<i className="fa fa-thumbs-up" />);
    case optiuneContra:
      return (<i className="fa fa-thumbs-down" />);
    case optiuneAbtinere:
      return (<i className="fa fa-minus-circle" />);

    default:
      return null;
  }

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
    content="Comisie"
    optiune={optiune}
  />
);

type OptiuneGuvernPropTypes = {
  optiune : OptiuneType;
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
