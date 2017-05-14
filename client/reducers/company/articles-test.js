
/* eslint-disable no-undefined, no-magic-numbers */

import reducer, {
  getArticle,
  getArticlesAreFetched,
  getArticlesAreFetching,
  getArticlesHaveError,
  getArticlesShouldFetch,
  getArticlesSorted,
  getArticlesFilteredByName,
} from "./articles";

import * as Immutable from "immutable";
import { noError } from "utility";

import { addArticle, modifyArticle, deleteArticle, COMPANY_RESET_DATA } from "actions";

describe("company/articles reducer", () => {

  it("returns the initial state", () => {
    const result = reducer(undefined, { type: "" });

    expect(result).toEqual({
      fetched  : false,
      fetching : false,
      error    : noError,

      data: Immutable.Map(),
    });
  });
  it("should handle COMPANY_FETCH_ARTICLES_PENDING", () => {
    const
      initialState = {
        fetching : false,
        error    : "Problem",
      },
      result = reducer(initialState, { type: "COMPANY_FETCH_ARTICLES_PENDING" });

    expect(result).toEqual({
      fetching : true,
      error    : noError,
    });
  });
  it("should handle COMPANY_FETCH_ARTICLES_REJECTED", () => {
    const
      initialState = {
        fetching : true,
        error    : noError,
      },
      error = "This is an error",
      result = reducer(initialState, {
        type    : "COMPANY_FETCH_ARTICLES_REJECTED",
        payload : { error },
      });

    expect(result).toEqual({
      fetching: false,
      error,
    });
  });
  it("should handle COMPANY_FETCH_ARTICLES_FULFILLED", () => {
    const
      initialState = {
        fetching : true,
        fetched  : false,

        data: Immutable.Map(),
      },
      action = {
        type    : "COMPANY_FETCH_ARTICLES_FULFILLED",
        payload : {
          entities: Immutable.Map({
            "1": Immutable.Map({
              ID: 1,
            }),
            "2": Immutable.Map({
              ID: 2,
            }),
          }),
        },
      },
      result = reducer(initialState, action);

    expect(result).toEqual({
      fetching : false,
      fetched  : true,

      data: Immutable.Map({
        "1": Immutable.Map({
          ID: 1,
        }),
        "2": Immutable.Map({
          ID: 2,
        }),
      }),
    });
  });
  it("should handle COMPANY_ADD_ARTICLE", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            ID: 1,
          }),
        }),
      },
      article = Immutable.Map({
        ID: 2,
      }),
      result = reducer(initialState, addArticle(article));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          ID: 1,
        }),
        "2": Immutable.Map({
          ID: 2,
        }),
      }),
    });
  });
  it("should handle COMPANY_MODIFY_ARTICLE", () => {
    const
      initialState = {
        data: Immutable.Map({
          "5": Immutable.Map({
            ID: 5,
          }),
          "6": Immutable.Map({
            ID: 6,
          }),
          "4": Immutable.Map({
            ID   : 4,
            Name : "Initial",
          }),
        }),
      },
      article = Immutable.Map({
        ID   : 4,
        Name : "Modified",
      }),
      result = reducer(initialState, modifyArticle(article));

    expect(result).toEqual({
      data: Immutable.Map({
        "4": Immutable.Map({
          ID   : 4,
          Name : "Modified",
        }),
        "5": Immutable.Map({
          ID: 5,
        }),
        "6": Immutable.Map({
          ID: 6,
        }),
      }),
    });
  });
  it("should handle COMPANY_DELETE_ARTICLE", () => {
    const
      initialState = {
        data: Immutable.Map({
          "1": Immutable.Map({
            ID: 1,
          }),
          "2": Immutable.Map({
            ID: 2,
          }),
        }),
      },
      result = reducer(initialState, deleteArticle(2));

    expect(result).toEqual({
      data: Immutable.Map({
        "1": Immutable.Map({
          ID: 1,
        }),
      }),
    });
  });
  it("handles the COMPANY_RESET_DATA", () => {
    const initialState = {
      error    : "Problem",
      fetching : true,
      fetched  : true,

      data: Immutable.Map({
        "1": Immutable.Map({
          ID: 1,
        }),
        "2": Immutable.Map({
          ID: 2,
        }),
      }),
    };

    const result = reducer(initialState, { type: COMPANY_RESET_DATA });

    expect(result).toEqual({
      error    : noError,
      fetched  : false,
      fetching : false,

      data: Immutable.Map(),
    });
  });

  it("selects the article", () => {
    const
      article = Immutable.Map({
        ID   : 6,
        Name : "Article 6",
      }),
      state = {
        companyArticles: {
          data: Immutable.Map({
            "6": article,
          }),
        },
      };

    expect(getArticle(state, "6")).toEqual(article);
  });
  it("getArticlesAreFetched", () => {
    expect(
      getArticlesAreFetched({
        companyArticles: {
          error    : noError,
          fetching : false,
          fetched  : true,
        },
      })
    ).toEqual(true);

    expect(
      getArticlesAreFetched({
        companyArticles: {
          error    : "This is an error",
          fetching : true,
          fetched  : false,
        },
      })
    ).toEqual(false);
  });
  it("getArticlesAreFetching", () => {
    expect(
      getArticlesAreFetching({
        companyArticles: {
          error    : noError,
          fetching : true,
        },
      })
    ).toEqual(true);

    expect(
      getArticlesAreFetching({
        companyArticles: {
          error    : "This is an error",
          fetching : false,
        },
      })
    ).toEqual(false);
  });
  it("getArticlesHaveError", () => {
    expect(
      getArticlesHaveError({
        companyArticles: {
          error: "This is an error",
        },
      })
    ).toEqual(true);

    expect(
      getArticlesHaveError({
        companyArticles: {
          error: noError,
        },
      })
    ).toEqual(false);
  });
  it("getArticlesShouldFetch", () => {
    expect(
      getArticlesShouldFetch({
        companyInfo: {
          fetching : false,
          fetched  : true,
          error    : noError,
        },
        companyArticles: {
          error    : noError,
          fetching : false,
          fetched  : false,
        },
      })
    ).toEqual(true);

    expect(
      getArticlesShouldFetch({
        companyInfo: {
          fetching : true,
          fetched  : false,
          error    : "Problem",
        },
        companyArticles: {
          error    : "Problem",
          fetching : true,
          fetched  : true,
        },
      })
    ).toEqual(false);
  });
  it("getArticlesSorted", () => {
    expect(
      getArticlesSorted({
        companyArticles: {
          data: Immutable.Map({
            "4": Immutable.Map({
              ID   : 4,
              Name : "Țurțuri",
            }),
            "3": Immutable.Map({
              ID   : 3,
              Name : "prune",
            }),
            "7": Immutable.Map({
              ID   : 7,
              Name : "Alune",
            }),
          }),
        },
      })
    ).toEqual(Immutable.List([
      Immutable.Map({
        ID   : 7,
        Name : "Alune",
      }),
      Immutable.Map({
        ID   : 3,
        Name : "prune",
      }),
      Immutable.Map({
        ID   : 4,
        Name : "Țurțuri",
      }),
    ]));
  });
  describe("getArticlesFilteredByName selector", () => {
    const selector = getArticlesFilteredByName({
      companyArticles: {
        data: Immutable.Map({
          "4": Immutable.Map({
            ID   : 4,
            Name : "Țurțuri",
          }),
          "3": Immutable.Map({
            ID   : 3,
            Name : "prune",
          }),
          "7": Immutable.Map({
            ID   : 7,
            Name : "Tărie",
          }),
        }),
      },
    });

    it("handles diacritics", () => {
      expect(
        selector("t")
      ).toEqual(Immutable.List([
        Immutable.Map({
          ID   : 7,
          Name : "Tărie",
        }),
        Immutable.Map({
          ID   : 4,
          Name : "Țurțuri",
        }),
      ]));
    });

    it("handles case", () => {
      expect(
        selector("P")
      ).toEqual(Immutable.List([
        Immutable.Map({
          ID   : 3,
          Name : "prune",
        }),
      ]));
    });

    it("handles case when nothing in the Map", () => {
      expect(
        selector("z")
      ).toEqual(Immutable.List([]));
    });

    it("searches inside the words", () => {
      // search inside the words
      expect(
        selector("ri")
      ).toEqual(Immutable.List([
        Immutable.Map({
          ID   : 7,
          Name : "Tărie",
        }),
        Immutable.Map({
          ID   : 4,
          Name : "Țurțuri",
        }),
      ]));
    });
  });
});
