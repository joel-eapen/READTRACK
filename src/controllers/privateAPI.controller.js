import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import userModel from "../models/user.model.js";
import bookModel from "../models/book.model.js";
import mongoose from "mongoose";

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

const findOneBook = asyncHandler(
  async(req,res)=>{
    const{id} = req.params
    const isValid = mongoose.isValidObjectId(id)
    if(!isValid){
      throw new ApiError(400,"Inavlid mongo object ID")
    }

    const user = await userModel.findOne({
      clerkUserId:req.user.clerkUserId
    })

    if(!user){
      throw new ApiError(404,"User not found")
    }

    const book = await bookModel.findOne({
      _id:id,
      userId:user._id
    })
    .select("-userId")

    if(!book){
      throw new ApiError(404,"Book not found")
    }

    return res.status(200).json(new ApiResponse(200,book,"Book fetched succesfully"))

  }
);

const updateBook=asyncHandler(async(req,res)=>{
  const{id}=req.params
  let {pagesRead,percentRead,status} = req.body

  if(!req.params){
    throw new ApiError(400,"Provide params")
  }

  if(!req.body){
    throw new ApiError(400,"Provide atleast one body item")
  }

  const user = await userModel.findOne({
    clerkUserId:req.user.clerkUserId
  })

  if(!user){
    throw new ApiError(404,"User not found")
  }

  const book = await bookModel.findOne({
    _id:id,
    userId:user._id
  })

  if(!book){
    throw new ApiError(404,"Book not found")
  }

  const totalPages = book.totalPages
  if(totalPages===undefined || totalPages===0){
    throw new ApiError(400,"The total pages is not available,choose another book")
  }

  const hasPagesRead = pagesRead !==undefined
  const hasPercentRead = percentRead !==undefined
  const hasStatus = status!==undefined

  if(hasPagesRead && hasPercentRead){
    throw new ApiError(400,"Provide only one value")
  }

  if(hasPagesRead && !hasPercentRead){
    if(pagesRead>totalPages){
      throw new ApiError(400,"The pages read cannot be greater than the total pages")
    }
    percentRead = Math.round((pagesRead/totalPages)*100)
    book.percentRead=percentRead
    book.pagesRead=pagesRead
  }

  if(hasPercentRead && !hasPagesRead){
    pagesRead = Math.round((percentRead/100)*totalPages)
    percentRead = Math.round((pagesRead/totalPages)*100)
    book.pagesRead=pagesRead
    book.percentRead=percentRead
  }

  if(hasStatus){
   if(status==="finished"){
    book.status=status
    book.finishedAt=new Date()
    book.pagesRead=totalPages
    book.percentRead=100
   }

   else if(!book.startedAt && status==="current_read"){
    book.startedAt=new Date()
    book.status=status
   }

   else if (status==="want_to_read"){
    book.status=status
   }

   else{
    book.status=status
   }


  }

  await book.save()

  return res.status(200).json(new ApiResponse(200,book,"Book updated succesfully"))
})
export default {
  addToLibrary,
  findAllBook,
  findOneBook,
  updateBook
};
