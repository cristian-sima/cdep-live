// @flow

type RowPropTypes = {
  data : any;
};

import React from "react";

const Row = ({
  data,
} : RowPropTypes) => {
  const
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
    </tr>
  );
};

export default Row;
