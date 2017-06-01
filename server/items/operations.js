import { ObjectId } from "mongodb";
import fetch from "node-fetch";

import { error, getToday } from "../utility";
import { prepareItem } from "./util";

import { URL } from "../../config";

export const selectItem = (db, id, callback) => {
  const
    list = db.collection("list"),
    info = db.collection("info");

  const whereQuery = { _id: ObjectId(id) };

  list.findOne(whereQuery, (errFindOne) => {
    if (errFindOne) {
      return error(errFindOne);
    }

    const newInfo = {
      $set: {
        itemSelected: id,
      },
    };

    return info.updateMany({}, newInfo, (errUpdate) => {
      if (errUpdate) {
        return error(errUpdate);
      }

      return callback();
    });
  });
};

export const updateList = (db, callback) => {
  const
  processData = ({ lista_de_vot: rawList }) => {
    const today = getToday();

    const
      info = db.collection("info"),
      list = db.collection("list");

    const
      insert = () => {
        const
      insertList = () => {
        const newList = [];

        for (const rawItem of rawList) {
          newList.push(prepareItem(rawItem));
        }

        return list.insertMany(newList, (errInsertNewList, { ops }) => {
          if (errInsertNewList) {
            return error(errInsertNewList);
          }

          return callback(ops);
        });
      };

        const query = {
          $set: {
            updateDate: today,
          },
        };

        return info.updateMany({}, query, (errUpdate) => {
          if (errUpdate) {
            return error(errUpdate);
          }

          return insertList();
        });
      },
      clearData = () => (
        list.remove((errRemoveAll) => {
          if (errRemoveAll) {
            return error(errRemoveAll);
          }

          return insert();
        })
      );

    return info.findOne({}, (errFind, { updateDate }) => {
      if (errFind) {
        return error(errFind);
      }

      if (typeof updateDate === "undefined") {
        return insert();
      }

      if (updateDate === today) {
        return list.find({}).toArray((errFindList, data) => {
          if (errFindList) {
            return error(errFindList);
          }

          return callback(data);
        });
      }

      return clearData();
    });
  };

  fetch(URL.list).
  then((response) => response.json()).
  then((json) => {
    processData(json);
  }).
  catch((errRequest) => {
    error(errRequest);
  });
};

const processPublicVote = ({ publicVote, group, isPublicVote }) => {
  const current = publicVote ? publicVote : "";

  if (isPublicVote) {
    const parts = String(current).split("|");

    if (parts.includes(group)) {
      return current;
    }

    parts.push(group);

    return parts.join("|");
  }

  return publicVote;
};

export const voteItem = (db, { id, isPublicVote, optiune }, { group }, callback) => {
  const
    list = db.collection("list");

  const whereQuery = { _id: ObjectId(id) };

  list.findOne(whereQuery, (errFindOne, item) => {
    console.log("errFindOne", errFindOne);
    console.log("item", item);
    if (errFindOne) {
      return error(errFindOne);
    }

    const { publicVote } = item;

    const updateQuery = {
      $set: {
        [group]    : optiune,
        publicVote : processPublicVote({
          publicVote,
          isPublicVote,
          group,
        }),
      },
    };

    return list.update(whereQuery, updateQuery, (errUpdate) => {
      if (errUpdate) {
        return error(errUpdate);
      }

      return callback();
    });
  });
};
