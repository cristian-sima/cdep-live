import express from "express";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({
  extended: true,
}));

router.use(bodyParser.json());

router.post("/auth/login", ({ body }, res) => {

  const {
    UserID: {
      Position1,
      Position2,
      Position3,
    },
    // Password,
  } = body;

  console.log("body", body);

  const ID = Number(`${Position1 || " "}${Position2 || " "}${Position3 || " "}`, 10);

  if (isNaN(ID)) {
    res.json({
      Error: "Datele nu au fost corecte pentru a vă conecta",
    });
  } else {
    res.json({
      Error: "",
    });
  }
});

export default router;
