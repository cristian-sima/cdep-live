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
    <div className="text-center mt-4">
      <div className="fancy-text">
        {getMessage()}
      </div>
      <div className="uil-ring-css"><div /></div>
    </div>
  );
};
