// @flow

import type { Socket, Database, VoteItemData } from "../types";

type UpdateCommentTypes = (socket : Socket, db : Database) =>
(clientData : { comment : string, id: string}) => any;

import { error, isSpecialAccount, contParlamentar } from "../utility";

import {
  selectItem as performSelectItem,
  updateList as performUpdateList,
  expressSuggestion as performVoteItem,
  updateComment as performUpdateComment,
} from "../items/operations";

import { hasGroupVoted } from "../items/util";

export const selectItem = (socket : Socket, db : Database) => (id : string) => {
  if (isSpecialAccount(socket.request.session.user.marca)) {
    return performSelectItem(db, id, () => {
      const data = {
        type    : "SELECT_ITEM",
        payload : id,
      };

      socket.emit("msg", data);
      socket.broadcast.emit("msg", data);
    });
  }

  return error("Nu ai voie");
};

export const updateList = (socket : Socket, db : Database) => () => {
  socket.broadcast.emit("msg", {
    type: "UPDATING_LIST",
  });

  performUpdateList(db, (items) => {

    const info = db.collection("info");

    return info.findOne({}, (errFindInfo, { itemSelected }) => {
      if (errFindInfo) {
        return error(errFindInfo);
      }

      const data = {
        type    : "UPDATE_LIST",
        payload : {
          list         : items,
          itemSelected : itemSelected || null,
        },
      };

      socket.emit("msg", data);
      socket.broadcast.emit("msg", data);

      return null;
    });
  });
};

export const expressSuggestion = (socket : Socket, db : Database) => (clientData : VoteItemData) => {
  const
    { user } = socket.request.session,
    { group, canVote, category } = user;

  const canExpressSuggestions = canVote && category === contParlamentar;

  if (canExpressSuggestions) {
    const callback = (oldPublicVote : boolean) => {

      const hasPublicVoted = hasGroupVoted({
        publicVote: oldPublicVote,
        group,
      });

      const shouldBroadcast = (
        clientData.isPublicVote || hasPublicVoted
      );

      const data = {
        type    : "EXPRESS_SUGGESTION",
        payload : {
          ...clientData,
          group,
        },
      };

      socket.emit("msg", data);

      if (shouldBroadcast) {
        return socket.broadcast.emit("msg", data);
      }

      return socket.to(group).emit("msg", data);
    };

    return performVoteItem({
      db,
      data: clientData,
      user,
      callback,
    });
  }

  return error("Nu ai voie");
};


export const updateComment : UpdateCommentTypes = (socket, db) => (clientData) => {
  const
    { user } = socket.request.session,
    { marca } = user;

  if (isSpecialAccount(marca)) {
    const callback = () => {
      const data = {
        type    : "UPDATE_COMMENT",
        payload : clientData,
      };

      socket.emit("msg", data);

      return socket.broadcast.emit("msg", data);
    };

    return performUpdateComment({
      db,
      data: clientData,
      callback,
    });
  }

  return error("Nu ai voie");
};
