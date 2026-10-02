import privateAPIController from "../controllers/privateAPI.controller.js";
import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { validateBook } from "../validators/book.validator.js";

const privateRouter = Router();

privateRouter.post(
  "/books",
  requireAuth,
  validateBook,
  privateAPIController.addToLibrary
);

privateRouter.get(
  "/books",
  requireAuth,
  privateAPIController.findAllBook
)

export default privateRouter;
