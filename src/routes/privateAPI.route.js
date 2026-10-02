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

privateRouter.get(
  "/books/:id",
  requireAuth,
  privateAPIController.findOneBook
)

privateRouter.patch(
  "/books/:id",
  requireAuth,
  privateAPIController.updateBook
)

privateRouter.delete(
  "/books/:id",
  requireAuth,
  privateAPIController.deleteBook
)
export default privateRouter;
