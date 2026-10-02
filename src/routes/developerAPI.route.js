import developerAPIController from "../controllers/developerAPI.controller.js";
import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import apiAuth from "../middlewares/apiAuth.js";

const developerRouter = Router()

developerRouter.post(
    "/api-keys",
    requireAuth,
    developerAPIController.createAPIKey
);

developerRouter.get(
    "/api-keys",
    requireAuth,
    developerAPIController.findKeyMetaData
);

developerRouter.delete(
    "/api-keys/:id",
    requireAuth,
    developerAPIController.deleteAPIKey
);



export default developerRouter