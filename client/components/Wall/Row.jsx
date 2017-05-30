// @flow

type RowPropTypes = {
  data : any;
  showVat: boolean;

  showModifyModal: (id : number) => void;
  showDeleteModal: (id : number) => void;
};

import React from "react";

import { OptiuneGuvern, OptiuneComisie } from "./Optiuni";

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.data !== nextProps.data
    );
  }

  render () {
    const { data } = this.props;

    const
      isSelected = data.get("isSelected"),
      position = data.get("position"),
      title = data.get("title"),
      project = data.get("project"),
      cameraDecizionala = data.get("cameraDecizionala"),
      comisia = data.get("comisia"),
      guvern = data.get("guvern");

    return (
      <tr className={isSelected ? "table-info" : ""}>
        <td className="text-center">
          {position}
        </td>
        <td>
          <strong>{project}</strong>
          <div className="wrap-truncate small ellipsis">
            {title}
          </div>
        </td>
        <td className="small">
          {
            typeof guvern === "undefined" ? null : (
              <OptiuneGuvern
                an={data.get("anGuvern")}
                optiune={guvern}
              />
            )
          }
          {
            typeof comisia === "undefined" ? null : (
              <OptiuneComisie
                optiune={comisia}
              />
            )
          }
            {
              cameraDecizionala ? (
                <div className="text-center">
                  <hr style={{
                    marginTop    : "0.3rem",
                    marginBottom : "0.3rem",
                  }} />
                    {"Vot decizional"}
                </div>
              ) : null
            }
        </td>
      </tr>
    );
  }
}

export default Row;
