import express from "express";
import bodyParser from "body-parser";
import { cryptPassword } from "./util";

const router = express.Router();

router.use(bodyParser.urlencoded({
  extended: true,
}));

router.use(bodyParser.json());

router.post("/auth/login", ({ body, db }, res) => {

  const {
    UserID: {
      Position1,
      Position2,
      Position3,
    },
    Password : RawPassword,
  } = body;

  const ID = Number(`${Position1 || " "}${Position2 || " "}${Position3 || " "}`, 10);

  const error = () => res.json({
    Error: "Datele nu au fost corecte pentru a vă conecta",
  });

  if (isNaN(ID)) {
    error();
  } else {

    cryptPassword(RawPassword, (errCrypt, encryptedPassword) => {
      const users = db.collection("users");

      const
        credentials = {
          "marca"    : ID,
          "password" : encryptedPassword,
        };

      users.findOne(credentials, (err, docs) => {

        console.log("err", err);

        if (err !== null || !docs) {
          error();
        } else {
          res.json({
            Error: "",
          });
        }
      });
    });
  }
});

export default router;
