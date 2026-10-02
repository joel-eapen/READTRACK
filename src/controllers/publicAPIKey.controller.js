import asyncHandler from "../utils/asyncHandler.js";
import bookModel from "../models/book.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const getAllBooks = asyncHandler(async(req,res)=>{
    const userId = req.apiKey.userId
     if(!userId){
        throw new ApiError(404,"User Id not found")
    }

    const isValid = mongoose.isValidObjectId(userId)
    if(!isValid){
        throw new ApiError(400,"Mongo object is invalid")
    }
    const {page,limit} = req.query
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const skip = (pageNumber-1)*limitNumber

    if(pageNumber<=0 || limitNumber <=0){
        throw new ApiError(401,"Invalid query params")
    }



    const [books, totalDocuments] = await Promise.all([
        bookModel.find({
        userId
    })
    .skip(skip)
    .limit(limitNumber)
    .sort({createdAt:-1})
    .select("-_id -userId"),

    bookModel.countDocuments({userId})
    ])

    const totalPage = Math.ceil(totalDocuments/limitNumber)

    if(books.length===0){
        return res.status(200).json(new ApiResponse(200,{
            books,
            pagination:{
                page:pageNumber,
                limit:limitNumber,
                totalDocuments,
                totalPage
            }
        },"No books to fetch"))
    }

    return res.status(200).json(new ApiResponse(200,{
            books,
            pagination:{
                page:pageNumber,
                limit:limitNumber,
                totalDocuments,
                totalPage
            }
        },"Book fetched successfully"))

});

export default {
    getAllBooks
}