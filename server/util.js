/* eslint-disable no-magic-numbers, no-sync, callback-return */
import createClientSession from "client-sessions";
import bcrypt from "bcrypt";

export const
  marcaOperator = 0,
  marcaAdministrator = 999;

export const sessionMiddleware = createClientSession({
  cookieName     : "session",
  secret         : "B83hfuin3989j3*&R383hfuin3989j3+3-83hfuin3989j3_ASD",
  duration       : 3000 * 60 * 1000,
  activeDuration : 5 * 60 * 1000,
});

export const cryptPassword = (raw : string) : string => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(raw, salt);
};

export const performLogin = (req, res, next) => {
  const { session, db } = req;

  const thereIsASession = (
    typeof session !== "undefined" &&
    typeof session.marca !== "undefined"
  );

  if (thereIsASession) {
    const
      { marca } = session,
      users = db.collection("users");

    users.findOne({ marca }, (err, user) => {
      if (!err && user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
      }

      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
};

export const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(403).json({
      Error: "Accesul nu este permis",
    });
  }
};

export const requireAdministrator = ({ user : { marca } }, res, next) => {
  if (marca === marcaAdministrator) {
    next();
  } else {
    res.status(403).json({
      Error: "Accesul nu este permis",
    });
  }
};
