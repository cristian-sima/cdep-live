// @flow

type RowPropTypes = {
  data : any;
  isResetingPassword: bool;
  resetPassword: (id : string) => () => void;
};

import React from "react";

const Row = ({
  data,
  resetPassword,
  isResetingPassword,
} : RowPropTypes) => {
  const
    id = data.get("_id"),
    marca = data.get("marca"),
    requireChange = data.get("requireChange"),
    temporaryPassword = data.get("temporaryPassword"),
    group = data.get("group"),
    name = data.get("name");

  return (
    <tr>
      <td className="no-wrap">
        {name}
      </td>
      <td className="text-center">
        {marca}
      </td>
      <td className="text-center">
        {group}
      </td>
      <td className="no-wrap font-weight-bold text-center">
        {requireChange ? temporaryPassword : null}
      </td>
      <td className="text-center">
        <button
          className="btn btn-sm btn-info"
          disabled={isResetingPassword}
          onClick={resetPassword(id)}>
          {"Resetează parola"}
        </button>
      </td>
    </tr>
  );
};

export default Row;
