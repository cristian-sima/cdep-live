// @flow

import express from "express";

import { requireLogin, requireAdministrator } from "../utility";

import { updateUsers, getUsers } from "./operations";

const router = express.Router();

router.get("/", [requireLogin, requireAdministrator, getUsers]);
router.post("/update", [requireLogin, requireAdministrator, updateUsers]);

export default router;
