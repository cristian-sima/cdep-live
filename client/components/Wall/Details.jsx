// @flow

type DetailsPropTypes = {
  data: any;
}

import React from "react";

import { OptiuneGuvern, OptiuneComisie } from "./Optiuni";

const Details = ({ data } : DetailsPropTypes) => {
  const
    cameraDecizionala = data.get("cameraDecizionala"),
    comisie = data.get("comisie"),
    guvern = data.get("guvern");

  return (
    <div>
      {
        typeof guvern === "undefined" ? null : (
          <OptiuneGuvern
            an={data.get("anGuvern")}
            optiune={guvern}
          />
        )
      }
      {
        typeof comisie === "undefined" ? null : (
          <OptiuneComisie
            optiune={comisie}
          />
        )
      }
      {
        cameraDecizionala ? (
          <div className="text-center">
            <hr className="hr-sm" />
            {"Vot decizional"}
          </div>
        ) : null
      }
    </div>
  );
};

export default Details;
