
import {
  updatingList,
  toggleItem,
  togglePublicVote,
  updateTemporaryComment,
  updatingComment,
} from "./list";

describe("list actions", () => {

  it("should create an action to show that the list is updating", () => {
    const
      expectedAction = {
        type: "UPDATING_LIST",
      };

    expect(updatingList()).toEqual(expectedAction);
  });

  it("should create an action to toggle an item", () => {
    const
      payload = "324n2mnkm342",
      expectedAction = {
        type: "TOGGLE_ITEM",
        payload,
      };

    expect(toggleItem(payload)).toEqual(expectedAction);
  });

  it("should create an action to update the temporary comment", () => {
    const
      payload = "comment",
      expectedAction = {
        type: "UPDATE_TEMPORARY_COMMENT",
        payload,
      };

    expect(updateTemporaryComment(payload)).toEqual(expectedAction);
  });

  it("should create an action to show that the comment is updating", () => {
    const
    expectedAction = {
      type: "UPDATING_COMMENT",
    };

    expect(updatingComment()).toEqual(expectedAction);
  });

  it("should create an action to toggle public vote", () => {
    const
    expectedAction = {
      type: "TOGGLE_PUBLIC_VOTE",
    };

    expect(togglePublicVote()).toEqual(expectedAction);
  });
});
