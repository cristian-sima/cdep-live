// @flow

type LoadingSmallMessagePropTypes = {
  message? : string;
};


import React from "react";

export const LoadingSmallMessage = ({ message } : LoadingSmallMessagePropTypes) => {
  const getMessage = () => {
    if (message === null) {
      return null;
    }

    return (
      <span>
        {" "}{message}
      </span>
    );
  };

  return (
    <div className="text-center fancy-text-sm">
      <i className="fa fa-refresh fa-spin fa-fw" />{getMessage()}
    </div>
  );
};
