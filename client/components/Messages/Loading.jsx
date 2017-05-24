// @flow

type LoadingMessagePropTypes = {
  message? : string;
};


import React from "react";

export const LoadingMessage = ({ message } : LoadingMessagePropTypes) => {
  const getMessage = () => {
    if (message === "") {
      return null;
    }

    return (
      <div className="mb-4">
        {message}
      </div>
    );
  };

  return (
    <div className="text-center fancy-text mt-4">
      {getMessage()}
      <div>
        <i className="fa fa-refresh fa-spin fa-fw" />
      </div>
    </div>
  );
};
