// @flow

import express from "express";

import { requireLogin } from "../utility";

import { changePassword, signOff, reconnect } from "./operations";

const router = express.Router();

router.post("/changePassword", [
  requireLogin,
  changePassword,
]);
router.post("/signOff", [
  requireLogin,
  signOff,
]);
router.post("/reconnect", [
  requireLogin,
  reconnect,
]);

export default router;
