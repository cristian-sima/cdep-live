// @flow

import type { Database, Item, User, VoteItemData } from "../types";

type VoteItemTypes = {
  db: Database;
  data: VoteItemData;
  user: User;
  callback: (oldPublicVote : boolean) => void;
}

type UpdateCommentTypes = {
  db: Database;
  data: {
    id: string;
    comment: string;
  };
  callback: () => void;
}

import { ObjectId } from "mongodb";
import fetch from "node-fetch";

import { error, getToday } from "../utility";
import { prepareItem, processPublicVote, optiuneNecunoscuta } from "./util";

import { URL } from "../../config";

export const selectItem = (db : Database, id : string, callback : () => void) => {
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

export const updateList = (db : Database, callback : (list : Array<Item>) => void) => {
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

export const voteItem = ({ db, data, user, callback } : VoteItemTypes) => {

  const
    { id, isPublicVote, optiune } = data,
    { group } = user;

  const
    list = db.collection("list"),
    whereQuery = { _id: ObjectId(id) };

  list.findOne(whereQuery, (errFindOne, item) => {
    if (errFindOne) {
      return error(errFindOne);
    }

    const { publicVote } = item;

    const updateQuery = {
      $set: {
        [group]    : optiune,
        publicVote : processPublicVote({
          publicVote,
          isPublicVote: optiune === optiuneNecunoscuta ? false : isPublicVote,
          group,
        }),
      },
    };

    return list.update(whereQuery, updateQuery, (errUpdate) => {
      if (errUpdate) {
        return error(errUpdate);
      }

      return callback(publicVote);
    });
  });
};

export const updateComment = ({ db, data, callback } : UpdateCommentTypes) => {

  const { id, comment } = data;

  const
    list = db.collection("list"),
    whereQuery = { _id: ObjectId(id) };

  list.findOne(whereQuery, (errFindOne) => {
    if (errFindOne) {
      return error(errFindOne);
    }

    const updateQuery = {
      $set: {
        comment,
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
