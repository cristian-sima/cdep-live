import createClientSession from "client-sessions";

const
  StatusForbidden = 403,

  notAllowedMessage = "Accesul nu este permis",

  duration = 180000000,
  activeDuration = 300000;

export const
  marcaOperator = 0,
  marcaAdministrator = 999,

  StatusServiceUnavailable = 503,

  sessionMiddleware = createClientSession({
    cookieName : "session",
    secret     : "B83hfuin3989j3*&R383hfuin3989j3+3-83hfuin3989j3_ASD",
    duration,
    activeDuration,
  }),

  isSpecialAccount = (marca) => marca === marcaOperator || marca === marcaAdministrator,
  isNormalUser = (marca) => !isSpecialAccount(marca),

  getToday = () => {
    const
      date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      nine = 9,
      dayString = day < nine ? `0${String(day)}` : day,
      monthString = month < nine ? `0${String(month)}` : month;

    return `${dayString}.${monthString}.${year}`;
  },
  error = (msg) => {
    throw (msg || "Ceva nu a mers cum trebuia");
  },
  findCurrentAccount = (req, res, next) => {

    const { session, db } = req;

    const thereIsASession = (
      typeof session !== "undefined" &&
      typeof session.marca !== "undefined"
    );

    if (thereIsASession) {
      const
        { marca } = session,
        users = db.collection("users");

      return users.findOne({ marca }, (err, user) => {
        if (!err && user) {
          req.user = user;
          delete req.user.password;
          req.session.user = user;
        }

        // finishing processing the middleware and run the route
        next();
      });
    }

    return next();
  },

  requireLogin = (req, res, next) => {
    if (req.user) {
      return next();
    }

    return res.status(StatusForbidden).json({
      Error: notAllowedMessage,
    });
  },

  requireAdministrator = ({ user : { marca } }, res, next) => {
    if (marca === marcaAdministrator) {
      return next();
    }

    return res.status(StatusForbidden).json({
      Error: notAllowedMessage,
    });
  };
