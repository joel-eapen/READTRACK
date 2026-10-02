import searchController from "../controllers/search.controller.js";
import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";

const searchRouter = Router();

searchRouter.get("/search", requireAuth, searchController.search);

export default searchRouter;
