// @flow

import express from "express";

import { requireLogin, requireAdministrator } from "../utility";

import { updateUsers, getUsers, resetPassword } from "./operations";

const router = express.Router();

router.get("/", [
  requireLogin,
  requireAdministrator,
  getUsers,
]);
router.post("/update", [
  requireLogin,
  requireAdministrator,
  updateUsers,
]);
router.post("/:accountID/reset-password", [
  requireLogin,
  resetPassword,
]);

export default router;
