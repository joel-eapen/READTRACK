import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import userModel from "../models/user.model.js";
import bookModel from "../models/book.model.js";

const addToLibrary = asyncHandler(async (req, res) => {
  const { externalId, title, author, coverImg, isbn, totalPages } = req.body;
  const user = await userModel.findOne({
    clerkUserId: req.user.clerkUserId,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let book = await bookModel.findOne({
    userId: user._id,
    externalId,
  });

  if (book) {
    throw new ApiError(409, "A similar book exists in your library");
  }

  if (!book) {
    book = await bookModel.create({
      userId: user._id,
      externalId,
      title,
      author,
      coverImg,
      isbn,
      totalPages,
      status: "want_to_read",
    });
  }

  return res.status(200).json(new ApiResponse(200, book));
});

const findAllBook = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  if (pageNumber <= 0 || limitNumber <= 0) {
    throw new ApiError(400, "The query parameters are invalid");
  }

  const skip = (pageNumber - 1) * limitNumber;
  const user = await userModel.findOne({
    clerkUserId: req.user.clerkUserId,
  });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const [books, totalDocuments] = await Promise.all([
    bookModel.find({
      userId: user._id,
    })
    .skip(skip)
    .limit(limitNumber)
    .sort({createdAt:-1})
    .select("-userId"),

    bookModel.countDocuments({
      userId: user._id,
    }),
  ]);

  const totalPages = Math.ceil(totalDocuments/limitNumber)

  if(books.length===0){
    return res.status(200).json(new ApiResponse(200,{
        books:[],
        pagination:{
            pageNumber,
            limitNumber,
            totalDocuments,
            totalPages
        }
    },"No books have been fetched"))
  }

  return res.status(200).json(new ApiResponse(200,{
    books,
    pagination:{
        pageNumber,
        limitNumber,
        totalDocuments,
        totalPages
    }
  },"Books have been fetched successfully"))
});

export default {
  addToLibrary,
  findAllBook
};
