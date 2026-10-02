import publicAPIKeyController from "../controllers/publicAPIKey.controller.js";
import { Router } from "express";
import apiAuth from "../middlewares/apiAuth.js";

const publicAPIRouter = Router();

publicAPIRouter.get(
    "/books",
    apiAuth,
    publicAPIKeyController.getAllBooks
)

export default publicAPIRouter