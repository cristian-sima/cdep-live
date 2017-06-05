// @flow

import express from "express";
import bodyParser from "body-parser";

import auth from "./auth";
import users from "./users";

import { sessionMiddleware, findCurrentAccount } from "./utility";

import { login } from "./auth/operations";

const router = express.Router();

const bodyParserMiddleware = bodyParser.urlencoded({ extended: true });

router.use(bodyParserMiddleware);
router.use(bodyParser.json());
router.use(sessionMiddleware);

router.post("/login", login);

router.use(findCurrentAccount);

router.use("/auth", auth);
router.use("/users", users);

export default router;
