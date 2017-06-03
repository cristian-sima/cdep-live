
import {
  showButtons,
} from "./users";

describe("users actions", () => {

  it("should create an action to show the buttons", () => {
    const
      expectedAction = {
        type: "SHOW_BUTTONS",
      };

    expect(showButtons()).toEqual(expectedAction);
  });

});
