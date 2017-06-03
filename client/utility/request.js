/* eslint-disable no-underscore-dangle */
// @flow

type Resolve = (data : any) => void;
type Reject = (arg : { error : string }) => void;

type Response = {
  body: any;
};

import * as Immutable from "immutable";

// entities ---> Object { "1": Immutable.Map(), ... ]) }F
// result ---> List([ "1", "2", "3" ])
export const normalizeArray = (raw : Array<any>) => (
  raw.reduce((previous, current) => {
    const stringID = String(current._id);

    previous.entities = previous.entities.set(stringID, Immutable.Map(current));

    previous.result = previous.result.push(stringID);

    return previous;
  }, {
    entities : Immutable.Map(),
    result   : Immutable.List(),
  })
);

export const withPromiseCallback = (resolve : Resolve, reject : Reject) => (
  (error : Error, response : Response) => {
    if (error) {
      reject({ error: error.message });
    } else {
      resolve(response.body);
    }
  }
);
