// @flow

type DetailsPropTypes = {
  data: any;
  group: string;

  isToggled: boolean;
}

import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import { OptiuneGuvern, OptiuneComisie, Optiune } from "./Optiuni";

import { optiuneNecunoscuta } from "utility";

const Details = ({ data, group } : DetailsPropTypes) => {
  const
    cameraDecizionala = data.get("cameraDecizionala"),
    comisie = data.get("comisie"),
    guvern = data.get("guvern"),
    publicVote = data.get("publicVote") || "",
    parties = publicVote.split("|").filter((party) => party !== group && party !== "");

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
      {
        parties.length > 0 ? (
          <div>
            <hr className="hr-sm" />
            <ReactCSSTransitionGroup
              transitionEnterTimeout={700}
              transitionLeaveTimeout={700}
              transitionName="party">
              {
                parties.map((party) => {
                  const optiune = data.get(party),
                    doNotDisplay = (
                    typeof optiune === "undefined" ||
                    optiune === null ||
                    optiune === optiuneNecunoscuta
                  );

                  if (doNotDisplay) {
                    return null;
                  }

                  return (
                    <Optiune content={`${party} `} inline key={party} optiune={optiune} />
                  );
                })
              }
            </ReactCSSTransitionGroup>
          </div>
        ) : null
      }
    </div>
  );
};

export default Details;
